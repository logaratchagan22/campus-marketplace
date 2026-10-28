// import { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import api, { ASSET_BASE_URL } from "../api/client";
// import { useAuth } from "../context/AuthContext";

// export default function ListingDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [listing, setListing] = useState(null);
//   const [activePhoto, setActivePhoto] = useState(0);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [busy, setBusy] = useState(false);
//   const [messaging, setMessaging] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     api
//       .get(`/listings/${id}`)
//       .then((res) => setListing(res.data.listing))
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [id]);

//   const isOwner = user && listing && String(listing.seller?._id) === String(user.id);

//   async function toggleStatus() {
//     setBusy(true);
//     try {
//       const nextStatus = listing.status === "available" ? "sold" : "available";
//       const res = await api.patch(`/listings/${id}/status`, { status: nextStatus });
//       setListing(res.data.listing);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function handleDelete() {
//     if (!window.confirm("Delete this listing? This cannot be undone.")) return;
//     setBusy(true);
//     try {
//       await api.delete(`/listings/${id}`);
//       navigate("/my-listings");
//     } catch (err) {
//       setError(err.message);
//       setBusy(false);
//     }
//   }

//   async function handleInterested() {
//     if (!user) {
//       navigate("/login", { state: { from: `/listings/${id}` } });
//       return;
//     }
//     setMessaging(true);
//     setError("");
//     try {
//       const res = await api.post("/conversations", { listingId: id });
//       navigate(`/messages/${res.data.conversation._id}`);
//     } catch (err) {
//       setError(err.message);
//       setMessaging(false);
//     }
//   }

//   if (loading) return <p className="p-10 text-center text-ink/60">Loading…</p>;
//   if (error && !listing) return <p className="p-10 text-center text-clay">{error}</p>;
//   if (!listing) return null;

//   const photos = listing.photos || [];

//   return (
//     <div className="mx-auto max-w-4xl px-6 py-10">
//       <Link to="/" className="text-sm font-medium text-forest hover:underline">
//         ← Back to browsing
//       </Link>

//       <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
//         <div>
//           <div className="aspect-[4/3] overflow-hidden rounded-md border border-line bg-line">
//             {photos.length > 0 ? (
//               <img
//                 src={`${ASSET_BASE_URL}${photos[activePhoto].url}`}
//                 alt={listing.title}
//                 className="h-full w-full object-cover"
//               />
//             ) : (
//               <div className="flex h-full w-full items-center justify-center text-ink/40">
//                 No photo provided
//               </div>
//             )}
//           </div>

//           {photos.length > 1 && (
//             <div className="mt-3 flex gap-2">
//               {photos.map((p, i) => (
//                 <button
//                   key={p.filename}
//                   type="button"
//                   onClick={() => setActivePhoto(i)}
//                   className={`h-16 w-16 overflow-hidden rounded-md border-2 ${
//                     i === activePhoto ? "border-forest" : "border-transparent"
//                   }`}
//                 >
//                   <img src={`${ASSET_BASE_URL}${p.url}`} alt="" className="h-full w-full object-cover" />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         <div>
//           <div className="flex items-start justify-between gap-3">
//             <h1 className="font-display text-3xl font-semibold">{listing.title}</h1>
//             <span
//               className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
//                 listing.status === "sold" ? "bg-clay text-paper" : "bg-forest-light text-paper"
//               }`}
//             >
//               {listing.status === "sold" ? "Sold" : "Available"}
//             </span>
//           </div>

//           <p className="mt-2 font-display text-2xl font-semibold text-forest">
//             ₹{listing.price.toLocaleString("en-IN")}
//           </p>

//           <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
//             <dt className="text-ink/50">Category</dt>
//             <dd className="capitalize">{listing.category}</dd>
//             <dt className="text-ink/50">Condition</dt>
//             <dd className="capitalize">{listing.condition}</dd>
//             <dt className="text-ink/50">Quantity available</dt>
//             <dd>{listing.quantity ?? 1}</dd>
//             <dt className="text-ink/50">Seller</dt>
//             <dd>{listing.seller?.name}</dd>
//             <dt className="text-ink/50">Campus</dt>
//             <dd>{listing.seller?.campus || "—"}</dd>
//           </dl>

//           <p className="mt-6 whitespace-pre-wrap text-ink/80">{listing.description}</p>

//           {error && <p className="mt-4 text-sm text-clay">{error}</p>}

//           {!isOwner && listing.status === "available" && (
//             <div className="mt-8 border-t border-dashed border-line pt-6">
//               <button
//                 type="button"
//                 disabled={messaging}
//                 onClick={handleInterested}
//                 className="rounded-md bg-mustard px-5 py-2.5 text-sm font-semibold text-ink hover:bg-mustard-dark disabled:opacity-60"
//               >
//                 {messaging ? "Starting chat…" : "I'm interested"}
//               </button>
//               <p className="mt-2 text-xs text-ink/50">
//                 Opens a private message thread with the seller inside the app. No contact
//                 details are shared.
//               </p>
//             </div>
//           )}

//           {isOwner && (
//             <div className="mt-8 flex flex-wrap gap-3 border-t border-dashed border-line pt-6">
//               <button
//                 type="button"
//                 disabled={busy}
//                 onClick={toggleStatus}
//                 className="rounded-md bg-forest px-4 py-2 text-sm font-semibold text-paper hover:bg-forest-light disabled:opacity-60"
//               >
//                 Mark as {listing.status === "available" ? "sold" : "available"}
//               </button>
//               <Link
//                 to={`/listings/${id}/edit`}
//                 className="rounded-md border border-line px-4 py-2 text-sm font-semibold hover:bg-line/40"
//               >
//                 Edit
//               </Link>
//               <button
//                 type="button"
//                 disabled={busy}
//                 onClick={handleDelete}
//                 className="rounded-md border border-clay px-4 py-2 text-sm font-semibold text-clay hover:bg-clay/10 disabled:opacity-60"
//               >
//                 Delete
//               </button>
//               <Link
//                 to="/messages"
//                 className="rounded-md border border-line px-4 py-2 text-sm font-semibold hover:bg-line/40"
//               >
//                 View messages
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { ASSET_BASE_URL } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [messaging, setMessaging] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/listings/${id}`)
      .then((res) => setListing(res.data.listing))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = user && listing && String(listing.seller?._id) === String(user.id);
  // NEW ROLE CAPABILITY LOGIC PATH
  const canModerate = isOwner || (user && user.role === "admin");

  async function toggleStatus() {
    setBusy(true);
    try {
      const nextStatus = listing.status === "available" ? "sold" : "available";
      const res = await api.patch(`/listings/${id}/status`, { status: nextStatus });
      setListing(res.data.listing);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this listing? This cannot be undone.")) return;
    setBusy(true);
    try {
      await api.delete(`/listings/${id}`);
      // Redirect back to main browse timeline if admin, otherwise to user's listings history page
      if (user && user.role === "admin" && !isOwner) {
        navigate("/");
      } else {
        navigate("/my-listings");
      }
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  async function handleInterested() {
    if (!user) {
      navigate("/login", { state: { from: `/listings/${id}` } });
      return;
    }
    setMessaging(true);
    setError("");
    try {
      const res = await api.post("/conversations", { listingId: id });
      navigate(`/messages/${res.data.conversation._id}`);
    } catch (err) {
      setError(err.message);
      setMessaging(false);
    }
  }

  if (loading) return <p className="p-10 text-center text-ink/60">Loading…</p>;
  if (error && !listing) return <p className="p-10 text-center text-clay">{error}</p>;
  if (!listing) return null;

  const photos = listing.photos || [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link to="/" className="text-sm font-medium text-forest hover:underline">
        ← Back to browsing
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-md border border-line bg-line">
            {photos.length > 0 ? (
              <img
                src={`${ASSET_BASE_URL}${photos[activePhoto].url}`}
                alt={listing.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink/40">
                No photo provided
              </div>
            )}
          </div>

          {photos.length > 1 && (
            <div className="mt-3 flex gap-2">
              {photos.map((p, i) => (
                <button
                  key={p.filename}
                  type="button"
                  onClick={() => setActivePhoto(i)}
                  className={`h-16 w-16 overflow-hidden rounded-md border-2 ${
                    i === activePhoto ? "border-forest" : "border-transparent"
                  }`}
                >
                  <img src={`${ASSET_BASE_URL}${p.url}`} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-3xl font-semibold">{listing.title}</h1>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                listing.status === "sold" ? "bg-clay text-paper" : "bg-forest-light text-paper"
              }`}
            >
              {listing.status === "sold" ? "Sold" : "Available"}
            </span>
          </div>

          <p className="mt-2 font-display text-2xl font-semibold text-forest">
            ₹{listing.price.toLocaleString("en-IN")}
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-ink/50">Category</dt>
            <dd className="capitalize">{listing.category}</dd>
            <dt className="text-ink/50">Condition</dt>
            <dd className="capitalize">{listing.condition}</dd>
            <dt className="text-ink/50">Quantity available</dt>
            <dd>{listing.quantity ?? 1}</dd>
            <dt className="text-ink/50">Seller</dt>
            <dd>{listing.seller?.name}</dd>
          </dl>

          <p className="mt-6 whitespace-pre-wrap text-ink/80">{listing.description}</p>

          {error && <p className="mt-4 text-sm text-clay">{error}</p>}

          {!isOwner && listing.status === "available" && (
            <div className="mt-8 border-t border-dashed border-line pt-6">
              <button
                type="button"
                disabled={messaging}
                onClick={handleInterested}
                className="rounded-md bg-mustard px-5 py-2.5 text-sm font-semibold text-ink hover:bg-mustard-dark disabled:opacity-60"
              >
                {messaging ? "Starting chat…" : "I'm interested"}
              </button>
              <p className="mt-2 text-xs text-ink/50">
                Opens a private message thread with the seller inside the app. No contact
                details are shared.
              </p>
            </div>
          )}

          {/* UPGRADED CONTROL BLOCK ALLOWING ADMIN ACCESS */}
          {canModerate && (
            <div className="mt-8 flex flex-wrap gap-3 border-t border-dashed border-line pt-6">
              <button
                type="button"
                disabled={busy}
                onClick={toggleStatus}
                className="rounded-md bg-forest px-4 py-2 text-sm font-semibold text-paper hover:bg-forest-light disabled:opacity-60"
              >
                Mark as {listing.status === "available" ? "sold" : "available"}
              </button>
              <Link
                to={`/listings/${id}/edit`}
                className="rounded-md border border-line px-4 py-2 text-sm font-semibold hover:bg-line/40"
              >
                Edit
              </Link>
              <button
                type="button"
                disabled={busy}
                onClick={handleDelete}
                className="rounded-md border border-clay px-4 py-2 text-sm font-semibold text-clay hover:bg-clay/10 disabled:opacity-60"
              >
                Delete
              </button>
              {isOwner && (
                <Link
                  to="/messages"
                  className="rounded-md border border-line px-4 py-2 text-sm font-semibold hover:bg-line/40"
                >
                  View messages
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
