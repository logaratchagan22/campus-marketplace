import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";
import ListingCard from "../components/ListingCard";
import Pagination from "../components/Pagination";

const CATEGORIES = [
  { value: "", label: "All categories" },
  { value: "books", label: "Books" },
  { value: "electronics", label: "Electronics" },
  { value: "cycles", label: "Cycles" },
  { value: "furniture", label: "Furniture" },
  { value: "other", label: "Other" },
];

export default function Home() {
  const [params, setParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Local form state mirrors the URL so filters are shareable/bookmarkable
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [minPrice, setMinPrice] = useState(params.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") || "");
  const [sort, setSort] = useState(params.get("sort") || "newest");

  const page = Number(params.get("page")) || 1;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    api
      .get("/listings", { params: Object.fromEntries(params) })
      .then((res) => {
        if (cancelled) return;
        setListings(res.data.listings);
        setPagination(res.data.pagination);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [params]);

  function applyFilters(e) {
    e?.preventDefault();
    const next = {};
    if (q) next.q = q;
    if (category) next.category = category;
    if (minPrice) next.minPrice = minPrice;
    if (maxPrice) next.maxPrice = maxPrice;
    if (sort && sort !== "newest") next.sort = sort;
    next.page = "1";
    setParams(next);
  }

  function goToPage(p) {
    const next = Object.fromEntries(params);
    next.page = String(p);
    setParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 border-b-2 border-dashed border-line pb-8">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          What's on the board today
        </h1>
        <p className="mt-2 max-w-xl text-ink/70">
          Buy and sell books, electronics, cycles and furniture with people on your campus.
        </p>
      </div>

      <form
        onSubmit={applyFilters}
        className="mb-8 grid grid-cols-1 gap-3 rounded-md border border-line bg-white p-4 sm:grid-cols-2 lg:grid-cols-6"
      >
        <input
          type="text"
          placeholder="Search listings…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-md border border-line px-3 py-2 text-sm lg:col-span-2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-line px-3 py-2 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="0"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="rounded-md border border-line px-3 py-2 text-sm"
        />

        <input
          type="number"
          min="0"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="rounded-md border border-line px-3 py-2 text-sm"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-md border border-line px-3 py-2 text-sm"
        >
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>

        <button
          type="submit"
          className="rounded-md bg-forest px-4 py-2 text-sm font-semibold text-paper hover:bg-forest-light lg:col-span-6"
        >
          Apply filters
        </button>
      </form>

      {error && <p className="mb-4 text-clay">{error}</p>}

      {loading ? (
        <p className="text-ink/60">Loading listings…</p>
      ) : listings.length === 0 ? (
        <p className="text-ink/60">
          Nothing matches yet. Try a different search or check back soon.
        </p>
      ) : (
        <>
          <p className="mb-4 text-sm text-ink/60">{pagination.total} listing(s) found</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={goToPage} />
        </>
      )}
    </div>
  );
}
