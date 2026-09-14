import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import ListingCard from "../components/ListingCard";

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/listings/mine")
      .then((res) => setListings(res.data.listings))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between border-b-2 border-dashed border-line pb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold">My listings</h1>
          <p className="mt-1 text-ink/60">Everything you've listed, sold or not.</p>
        </div>
        <Link
          to="/new"
          className="shrink-0 rounded-md bg-mustard px-4 py-2 text-sm font-semibold text-ink hover:bg-mustard-dark"
        >
          + New listing
        </Link>
      </div>

      {loading ? (
        <p className="text-ink/60">Loading…</p>
      ) : error ? (
        <p className="text-clay">{error}</p>
      ) : listings.length === 0 ? (
        <p className="text-ink/60">You haven't listed anything yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
