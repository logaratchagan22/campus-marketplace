import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const POLL_INTERVAL_MS = 4000;

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDateLabel(iso) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
}

export default function Conversation() {
  const { id } = useParams();
  const { user } = useAuth();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  function loadThread(showSpinner = false) {
    if (showSpinner) setLoading(true);
    return api
      .get(`/conversations/${id}/messages`)
      .then((res) => {
        setConversation(res.data.conversation);
        setMessages(res.data.messages);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => showSpinner && setLoading(false));
  }

  useEffect(() => {
    loadThread(true);
    // Poll for new messages while this thread is open. If the listing gets marked
    // sold mid-chat, the next poll will 404 and we show the "closed" state below.
    const interval = setInterval(() => loadThread(false), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await api.post(`/conversations/${id}/messages`, { text });
      setText("");
      await loadThread(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (loading) return <p className="p-10 text-center text-ink/60">Loading…</p>;

  if (error && !conversation) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Conversation unavailable</h1>
        <p className="mt-2 text-ink/60">
          This chat is no longer available. Once an item is marked sold, the thread between
          buyer and seller is permanently closed for privacy.
        </p>
        <Link to="/messages" className="mt-6 inline-block text-forest underline">
          Back to messages
        </Link>
      </div>
    );
  }

  const otherParty =
    String(conversation.buyer._id) === String(user.id) ? conversation.seller : conversation.buyer;

  return (
    <div className="mx-auto flex h-[calc(100vh-72px)] max-w-2xl flex-col px-6 py-6">
      <div className="border-b border-line pb-4">
        <Link to="/messages" className="text-sm font-medium text-forest hover:underline">
          ← All messages
        </Link>
        <h1 className="mt-1 font-display text-xl font-semibold">
          {conversation.listing?.title || "Listing"}
        </h1>
        <p className="text-sm text-ink/60">Chatting with {otherParty?.name}</p>
        <p className="text-xs text-ink/40">
          Interest expressed on {formatDateLabel(conversation.createdAt)} at{" "}
          {formatTime(conversation.createdAt)}
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-ink/50">Say hello to get the conversation started.</p>
        )}
        {messages.map((m, i) => {
          const mine = String(m.sender) === String(user.id);
          const prev = messages[i - 1];
          const showDateSeparator =
            !prev || new Date(prev.createdAt).toDateString() !== new Date(m.createdAt).toDateString();

          return (
            <div key={m._id}>
              {showDateSeparator && (
                <p className="my-3 text-center text-xs font-medium text-ink/40">
                  {formatDateLabel(m.createdAt)}
                </p>
              )}
              <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-md px-3 py-2 text-sm ${
                    mine ? "bg-forest text-paper" : "bg-white border border-line"
                  }`}
                >
                  <p>{m.text}</p>
                  <p className={`mt-1 text-[10px] ${mine ? "text-paper/70" : "text-ink/40"}`}>
                    {formatTime(m.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error && <p className="text-sm text-clay">{error}</p>}

      <form onSubmit={handleSend} className="flex gap-2 border-t border-line pt-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          maxLength={2000}
          className="flex-1 rounded-md border border-line px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="rounded-md bg-forest px-4 py-2 text-sm font-semibold text-paper hover:bg-forest-light disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </div>
  );
}
