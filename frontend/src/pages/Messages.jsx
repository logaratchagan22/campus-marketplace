import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { ASSET_BASE_URL } from "../api/client";
import { useAuth } from "../context/AuthContext";

function formatRelativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString([], { day: "numeric", month: "short" });
}

const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/conversations")
      .then((res) => setConversations(res.data.conversations))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // For listings where I'm the seller and more than one buyer is interested,
  // work out who reached out first so I can decide who to sell to.
  const interestRank = {};
  const myListingThreads = conversations.filter((c) => String(c.seller._id) === String(user.id));
  const groupedByListing = myListingThreads.reduce((groups, c) => {
    const key = c.listing?._id;
    (groups[key] = groups[key] || []).push(c);
    return groups;
  }, {});
  Object.values(groupedByListing).forEach((group) => {
    if (group.length < 2) return;
    [...group]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .forEach((c, i) => {
        interestRank[c._id] = i + 1;
      });
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 border-b-2 border-dashed border-line pb-8">
        <h1 className="font-display text-3xl font-semibold">Messages</h1>
        <p className="mt-1 text-ink/60">
          Conversations you've started as a buyer, and requests from buyers on your own listings.
        </p>
      </div>

      {loading ? (
        <p className="text-ink/60">Loading…</p>
      ) : error ? (
        <p className="text-clay">{error}</p>
      ) : conversations.length === 0 ? (
        <p className="text-ink/60">
          No conversations yet. Click "I'm interested" on a listing to start one.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {conversations.map((c) => {
            const iAmBuyer = String(c.buyer._id) === String(user.id);
            const otherParty = iAmBuyer ? c.seller : c.buyer;
            const photo = c.listing?.photos?.[0];
            const rank = interestRank[c._id];

            return (
              <li key={c._id}>
                <Link
                  to={`/messages/${c._id}`}
                  className="flex items-center gap-4 rounded-md border border-line bg-white p-4 hover:bg-line/20"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-line">
                    {photo && (
                      <img
                        src={`${ASSET_BASE_URL}${photo.url}`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display font-semibold">{c.listing?.title}</p>
                    <p className="text-sm text-ink/60">
                      {iAmBuyer ? "Chatting with seller" : "Buyer"}: {otherParty?.name}
                    </p>
                    <p className="text-xs text-ink/40">
                      {iAmBuyer ? "You showed interest" : "Interested"} {formatRelativeTime(c.createdAt)}
                    </p>
                  </div>
                  {!iAmBuyer && rank && (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        rank === 1 ? "bg-forest text-paper" : "bg-line text-ink/60"
                      }`}
                      title="Order this buyer showed interest, among everyone interested in this listing"
                    >
                      {ORDINALS[rank - 1] || `${rank}th`} interested
                    </span>
                  )}
                  {c.listing?.status === "sold" && (
                    <span className="shrink-0 rounded-full bg-clay px-2 py-0.5 text-xs font-semibold text-paper">
                      Sold
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
