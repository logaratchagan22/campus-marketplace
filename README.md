# Campus Marketplace (Buy/Sell)

A full-stack marketplace where students list used items (books, electronics, cycles,
furniture) with photos and a price, and browse/search listings by category.

## Tech stack

| Layer          | Choice                          | Why |
|----------------|----------------------------------|-----|
| Frontend       | React 19 + Vite                  | Fast dev server, component model fits a listing-heavy UI, large ecosystem |
| Styling        | Tailwind CSS v4                  | Utility classes speed up building consistent, responsive UI without a separate CSS architecture |
| Routing        | React Router v7                  | Standard client-side routing for a multi-page SPA (browse, detail, forms, auth) |
| Backend        | Node.js + Express                | Minimal, well-documented framework; pairs naturally with the JS frontend (one language end to end) |
| Database       | MongoDB + Mongoose                | Listings have a flexible, document-shaped structure (variable photo counts, optional fields); Mongoose adds schema validation on top |
| Authentication | JWT (jsonwebtoken) + bcryptjs     | Stateless auth that scales without server-side sessions; bcrypt for one-way password hashing |
| File uploads   | Multer                            | Standard middleware for handling `multipart/form-data` photo uploads in Express |

## Project structure

```
campus-marketplace/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/           # auth (JWT), upload (Multer), errorHandler
│   ├── models/               # User, Listing (Mongoose schemas)
│   ├── routes/               # auth.js, listings.js
│   ├── uploads/              # uploaded photos (served statically at /uploads)
│   ├── server.js             # Express app entry point
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/client.js     # Axios instance + auth token interceptor
│   │   ├── context/AuthContext.jsx
│   │   ├── components/       # Navbar, ListingCard, Pagination, ProtectedRoute
│   │   ├── pages/            # Home, Login, Register, ListingDetail, ListingForm, MyListings
│   │   └── App.jsx
│   └── .env.example
└── postman/
    └── campus-marketplace.postman_collection.json
```

## System architecture

```
Browser (React SPA)
   │  fetch/axios (JSON + multipart/form-data)
   ▼
Express API (Node.js)
   │  Mongoose ODM
   ▼
MongoDB (Users, Listings collections)

Photo uploads: Browser → multipart POST → Multer (disk storage) → /backend/uploads
                                                                  → served at GET /uploads/:filename
```

## Database design

**User**
| Field     | Type     | Notes |
|-----------|----------|-------|
| name      | String   | required |
| email     | String   | required, unique |
| password  | String   | required, bcrypt-hashed, never returned by default |
| campus    | String   | optional |

**Listing**
| Field       | Type       | Notes |
|-------------|------------|-------|
| title       | String     | required |
| description | String     | required |
| price       | Number     | required, >= 0 |
| quantity    | Number     | required, >= 0, default 1. Setting it to 0 on update auto-marks the listing sold |
| category    | String     | enum: books / electronics / cycles / furniture / other |
| condition   | String     | enum: new / like-new / good / fair / worn |
| photos      | [{url, filename}] | populated by Multer on upload |
| status      | String     | enum: available / sold (default available) |
| seller      | ObjectId → User | required |
| timestamps  | createdAt, updatedAt | automatic |

Indexes: a text index on `title` + `description` (search), and a compound index on
`category` + `status` + `createdAt` (fast filtered/sorted browsing).

## Setup

### Prerequisites
- Node.js 18+
- A MongoDB connection string (local `mongod`, or a free MongoDB Atlas cluster)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI and a real JWT_SECRET
npm run dev        # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your API isn't on localhost:5000
npm run dev         # starts on http://localhost:5173
```

Open http://localhost:5173, register an account, and start listing items.

## API reference

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint          | Auth | Body |
|--------|-------------------|------|------|
| POST   | `/auth/register`  | No   | `{ name, email, password, campus }` |
| POST   | `/auth/login`     | No   | `{ email, password }` |
| GET    | `/auth/me`         | Yes  | — |

### Listings
| Method | Endpoint                | Auth        | Notes |
|--------|--------------------------|-------------|-------|
| GET    | `/listings`              | No          | Query: `q, category, status, minPrice, maxPrice, sort, page, limit` |
| GET    | `/listings/categories`   | No          | Returns the fixed category list |
| GET    | `/listings/mine`         | Yes         | Listings created by the logged-in user |
| GET    | `/listings/:id`          | No          | Single listing |
| POST   | `/listings`              | Yes         | `multipart/form-data`: title, description, price, category, condition, photos[] |
| PUT    | `/listings/:id`          | Yes (owner) | Same fields as POST, all optional; new photos are appended |
| PATCH  | `/listings/:id/status`   | Yes (owner) | `{ status: "available" | "sold" }` |
| DELETE | `/listings/:id`          | Yes (owner) | — |

All authenticated requests need `Authorization: Bearer <token>`.

### Conversations (in-app messaging)
| Method | Endpoint                          | Auth | Notes |
|--------|------------------------------------|------|-------|
| POST   | `/conversations`                   | Yes  | Buyer clicks "I'm interested": `{ listingId }`. Fails if the listing isn't available or you're the seller. |
| GET    | `/conversations`                   | Yes  | Inbox: every thread you're in, as buyer or seller |
| GET    | `/conversations/:id/messages`      | Yes (participant) | Full message history for one thread |
| POST   | `/conversations/:id/messages`      | Yes (participant) | `{ text }` |

**Privacy design:** buyer and seller only ever see each other's name inside the
chat — no email or phone number is exchanged. The moment a listing's status
becomes `sold` (via the status endpoint, an edit that zeroes out quantity, or
deletion), every conversation and message tied to that listing is **permanently
deleted** from the database. There is no way to recover or reopen it — this is
intentional, so buyer and seller have no lasting connection once the
transaction is done.

## Security notes

- Passwords are hashed with bcrypt before saving; the hash is excluded from query
  results unless explicitly requested (`.select('+password')`).
- JWTs are signed with a secret from `.env` and expire (`JWT_EXPIRES_IN`).
- Ownership checks on `PUT`, `PATCH /status`, and `DELETE` prevent editing someone
  else's listing even with a valid token.
- Multer restricts uploads to image MIME types and a 5 MB / 5-file limit.
- CORS is restricted to the origin(s) listed in `CLIENT_ORIGIN`.
- `.env` files are git-ignored; only `.env.example` (no real secrets) is committed.

## Testing

### Automated tests (Jest + Supertest)

`backend/tests/api.test.js` covers everything the assignment requires to be tested:

- **Multer file uploads** — creates a listing with a real attached image, and confirms non-image files are rejected
- **Search/filter/pagination** — text search, category filter, price range, sort order, and page/limit behaviour
- **CRUD** — create, read, update, delete, including ownership checks (a non-owner cannot edit/delete)
- **Status updates** — only the owner can mark a listing sold, and doing so permanently deletes any related conversations (the messaging privacy feature)

To run it:

```bash
cd backend
npm install
cp .env.example .env   # if you haven't already, and fill in MONGO_URI
npm test
```

**Important:** this test suite connects to a real MongoDB and wipes the
`Users`, `Listings`, `Conversations`, and `Messages` collections before
running. By default it reuses your `MONGO_URI` but swaps the database name to
`campus_marketplace_test`, so it won't touch your real data as long as you
haven't manually changed that behaviour. If you'd rather point it at a
completely separate cluster/connection string, set `TEST_MONGO_URI` in `.env`.

### Manual/API testing (Postman)

A Postman collection is included at `postman/campus-marketplace.postman_collection.json`
covering: register, login, create listing (with photo), browse/search/filter/pagination,
status update, edit, and delete — plus negative cases (missing fields, wrong owner,
invalid token). Import it into Postman or Thunder Client, set the `baseUrl` and
`token` collection variables, and run the requests top to bottom.

Manual test checklist:
- [ ] Register with a duplicate email → 409
- [ ] Login with wrong password → 401
- [ ] Create listing without a token → 401
- [ ] Create listing with 6 photos → rejected (limit is 5)
- [ ] Search `q=cycle` returns only matching listings
- [ ] Filter `category=books&minPrice=100&maxPrice=500` returns only listings in range
- [ ] Pagination: `page=2&limit=2` returns the next slice with correct `totalPages`
- [ ] Mark a listing "sold" as the owner → succeeds; as a different user → 403
- [ ] Delete a listing you don't own → 403
- [ ] Click "I'm interested" as the listing's own seller → 400
- [ ] Send a message, then mark the listing sold → conversation becomes 404 for both parties

## Future enhancements

- Image optimization/resizing on upload (e.g. sharp) instead of storing originals
- Cloud storage (S3/Cloudinary) for uploaded photos instead of local disk
- In-app messaging between buyer and seller
- Saved/favorited listings
- Email verification on registration
