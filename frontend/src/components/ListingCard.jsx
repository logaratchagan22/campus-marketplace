import { Link } from "react-router-dom";
import { ASSET_BASE_URL } from "../api/client";

const CATEGORY_LABELS = {
  books: "Books",
  electronics: "Electronics",
  cycles: "Cycles",
  furniture: "Furniture",
  other: "Other",
};

export default function ListingCard({ listing }) {
  const photo = listing.photos?.[0];
  const imgSrc = photo ? `${ASSET_BASE_URL}${photo.url}` : null;

  return (
    <Link
      to={`/listings/${listing._id}`}
      className="pin relative flex flex-col overflow-hidden rounded-sm border border-line bg-white shadow-[3px_3px_0_0_rgba(31,43,35,0.15)] transition-transform hover:-translate-y-0.5"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-line">
        {imgSrc ? (
          <img src={imgSrc} alt={listing.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-ink/40">
            No photo
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-snug">{listing.title}</h3>
          {listing.status === "sold" && (
            <span className="shrink-0 rounded-full bg-clay px-2 py-0.5 text-xs font-semibold text-paper">
              Sold
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <p className="font-display text-xl font-semibold text-forest">
            ₹{listing.price.toLocaleString("en-IN")}
          </p>
          {listing.quantity > 1 && (
            <span className="text-xs font-medium text-ink/50">× {listing.quantity} available</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-ink/60">
          <span>{CATEGORY_LABELS[listing.category] || listing.category}</span>
          <span>{listing.seller?.campus || "Campus"}</span>
        </div>
      </div>
    </Link>
  );
}
