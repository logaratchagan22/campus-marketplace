/**
 * Run with: npm test
 *
 * IMPORTANT: this connects to a real MongoDB and WIPES the Users, Listings,
 * Conversations and Messages collections before running. Point it at a
 * dedicated test database, never your real one.
 *
 * By default it reuses MONGO_URI from your .env but swaps the database name
 * to "campus_marketplace_test". To use a completely separate connection
 * string instead, set TEST_MONGO_URI in your .env.
 */
const path = require("path");
require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const User = require("../models/User");
const Listing = require("../models/Listing");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const TEST_MONGO_URI =
  process.env.TEST_MONGO_URI ||
  (process.env.MONGO_URI
    ? process.env.MONGO_URI.replace(/\/([^/?]+)(\?|$)/, "/campus_marketplace_test$2")
    : null);

let sellerToken;
let buyerToken;
let listingId;
let conversationId;

jest.setTimeout(20000);

beforeAll(async () => {
  if (!TEST_MONGO_URI) {
    throw new Error(
      "Set MONGO_URI (or TEST_MONGO_URI) in backend/.env before running tests"
    );
  }
  await mongoose.connect(TEST_MONGO_URI);
  await Promise.all([
    User.deleteMany({}),
    Listing.deleteMany({}),
    Conversation.deleteMany({}),
    Message.deleteMany({}),
  ]);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth", () => {
  test("registers a seller and a buyer", async () => {
    const seller = await request(app).post("/api/auth/register").send({
      name: "Seller One",
      email: "seller@test.edu",
      password: "password123",
    });
    expect(seller.status).toBe(201);
    sellerToken = seller.body.token;

    const buyer = await request(app).post("/api/auth/register").send({
      name: "Buyer One",
      email: "buyer@test.edu",
      password: "password123",
    });
    expect(buyer.status).toBe(201);
    buyerToken = buyer.body.token;
  });

  test("rejects duplicate email registration", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Seller One",
      email: "seller@test.edu",
      password: "password123",
    });
    expect(res.status).toBe(409);
  });

  test("rejects login with the wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "seller@test.edu", password: "wrongpassword" });
    expect(res.status).toBe(401);
  });
});

describe("Listings: CRUD + Multer file upload", () => {
  test("rejects listing creation without a token", async () => {
    const res = await request(app).post("/api/listings").field("title", "x");
    expect(res.status).toBe(401);
  });

  test("creates a listing with an uploaded photo (Multer)", async () => {
    const res = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${sellerToken}`)
      .field("title", "Used Data Structures textbook")
      .field("description", "4th edition, some highlighting")
      .field("price", "450")
      .field("quantity", "2")
      .field("category", "books")
      .field("condition", "good")
      .attach("photos", path.join(__dirname, "fixtures", "sample.jpg"));

    expect(res.status).toBe(201);
    expect(res.body.listing.photos).toHaveLength(1);
    expect(res.body.listing.photos[0].url).toMatch(/^\/uploads\//);
    expect(res.body.listing.quantity).toBe(2);
    listingId = res.body.listing._id;
  });

  test("rejects a non-image file upload", async () => {
    const res = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${sellerToken}`)
      .field("title", "Bad upload")
      .field("description", "should fail")
      .field("price", "10")
      .field("category", "other")
      .attach("photos", Buffer.from("not an image"), { filename: "notes.txt", contentType: "text/plain" });

    expect(res.status).toBe(400);
  });

  test("reads the created listing", async () => {
    const res = await request(app).get(`/api/listings/${listingId}`);
    expect(res.status).toBe(200);
    expect(res.body.listing.title).toBe("Used Data Structures textbook");
  });

  test("owner can update the listing", async () => {
    const res = await request(app)
      .put(`/api/listings/${listingId}`)
      .set("Authorization", `Bearer ${sellerToken}`)
      .field("price", "400");
    expect(res.status).toBe(200);
    expect(res.body.listing.price).toBe(400);
  });

  test("non-owner cannot update the listing", async () => {
    const res = await request(app)
      .put(`/api/listings/${listingId}`)
      .set("Authorization", `Bearer ${buyerToken}`)
      .field("price", "1");
    expect(res.status).toBe(403);
  });
});

describe("Search, filter, sort, pagination", () => {
  beforeAll(async () => {
    const extras = [
      { title: "Mountain bike", description: "Great condition cycle", price: 3000, category: "cycles" },
      { title: "Study lamp", description: "LED desk lamp", price: 200, category: "furniture" },
      { title: "Old calculus textbook", description: "Some wear on the cover", price: 150, category: "books" },
    ];
    for (const item of extras) {
      await request(app)
        .post("/api/listings")
        .set("Authorization", `Bearer ${sellerToken}`)
        .field("title", item.title)
        .field("description", item.description)
        .field("price", String(item.price))
        .field("category", item.category);
    }
  });

  test("text search only returns matching listings", async () => {
    const res = await request(app).get("/api/listings?q=textbook");
    expect(res.status).toBe(200);
    expect(res.body.listings.length).toBeGreaterThan(0);
    expect(
      res.body.listings.every((l) => /textbook/i.test(l.title) || /textbook/i.test(l.description))
    ).toBe(true);
  });

  test("category filter returns only that category", async () => {
    const res = await request(app).get("/api/listings?category=books");
    expect(res.status).toBe(200);
    expect(res.body.listings.every((l) => l.category === "books")).toBe(true);
  });

  test("price range filter respects min/max", async () => {
    const res = await request(app).get("/api/listings?minPrice=100&maxPrice=500");
    expect(res.status).toBe(200);
    expect(res.body.listings.every((l) => l.price >= 100 && l.price <= 500)).toBe(true);
  });

  test("pagination respects page size and reports totals", async () => {
    const res = await request(app).get("/api/listings?page=1&limit=2");
    expect(res.status).toBe(200);
    expect(res.body.listings.length).toBeLessThanOrEqual(2);
    expect(res.body.pagination.limit).toBe(2);
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.totalPages).toBeGreaterThanOrEqual(1);
  });

  test("sort=price_asc actually returns ascending prices", async () => {
    const res = await request(app).get("/api/listings?sort=price_asc&limit=50");
    const prices = res.body.listings.map((l) => l.price);
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });
});

describe("Status updates + messaging privacy", () => {
  test("buyer can express interest in an available listing", async () => {
    const res = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({ listingId });
    expect(res.status).toBe(201);
    conversationId = res.body.conversation._id;
  });

  test("seller cannot message themselves about their own listing", async () => {
    const res = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({ listingId });
    expect(res.status).toBe(400);
  });

  test("buyer and seller can exchange messages", async () => {
    const send = await request(app)
      .post(`/api/conversations/${conversationId}/messages`)
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({ text: "Is this still available?" });
    expect(send.status).toBe(201);

    const read = await request(app)
      .get(`/api/conversations/${conversationId}/messages`)
      .set("Authorization", `Bearer ${sellerToken}`);
    expect(read.status).toBe(200);
    expect(read.body.messages).toHaveLength(1);
  });

  test("a stranger cannot read someone else's conversation", async () => {
    const stranger = await request(app).post("/api/auth/register").send({
      name: "Stranger",
      email: "stranger@test.edu",
      password: "password123",
    });
    const res = await request(app)
      .get(`/api/conversations/${conversationId}/messages`)
      .set("Authorization", `Bearer ${stranger.body.token}`);
    expect(res.status).toBe(403);
  });

  test("only the owner can mark their listing as sold", async () => {
    const forbidden = await request(app)
      .patch(`/api/listings/${listingId}/status`)
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({ status: "sold" });
    expect(forbidden.status).toBe(403);

    const ok = await request(app)
      .patch(`/api/listings/${listingId}/status`)
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({ status: "sold" });
    expect(ok.status).toBe(200);
    expect(ok.body.listing.status).toBe("sold");
  });

  test("marking a listing sold permanently deletes its conversation", async () => {
    const res = await request(app)
      .get(`/api/conversations/${conversationId}/messages`)
      .set("Authorization", `Bearer ${sellerToken}`);
    expect(res.status).toBe(404);
  });

  test("owner can delete their listing", async () => {
    const res = await request(app)
      .delete(`/api/listings/${listingId}`)
      .set("Authorization", `Bearer ${sellerToken}`);
    expect(res.status).toBe(200);

    const check = await request(app).get(`/api/listings/${listingId}`);
    expect(check.status).toBe(404);
  });
});
