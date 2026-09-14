import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";

const CATEGORIES = ["books", "electronics", "cycles", "furniture", "other"];
const CONDITIONS = ["new", "like-new", "good", "fair", "worn"];

export default function ListingForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    quantity: 1,
    category: "books",
    condition: "good",
  });
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return;
    api
      .get(`/listings/${id}`)
      .then((res) => {
        const l = res.data.listing;
        setForm({
          title: l.title,
          description: l.description,
          price: l.price,
          quantity: l.quantity ?? 1,
          category: l.category,
          condition: l.condition,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      Array.from(photos).forEach((file) => data.append("photos", file));

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (isEditing) {
        await api.put(`/listings/${id}`, data, config);
        navigate(`/listings/${id}`);
      } else {
        const res = await api.post("/listings", data, config);
        navigate(`/listings/${res.data.listing._id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="p-10 text-center text-ink/60">Loading…</p>;

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold">
        {isEditing ? "Edit listing" : "List an item for sale"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Title
          <input
            type="text"
            required
            maxLength={100}
            value={form.title}
            onChange={update("title")}
            placeholder="e.g. Used Data Structures textbook, 4th edition"
            className="rounded-md border border-line px-3 py-2 font-normal"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Description
          <textarea
            required
            rows={5}
            maxLength={2000}
            value={form.description}
            onChange={update("description")}
            placeholder="Condition, why you're selling, pickup details…"
            className="rounded-md border border-line px-3 py-2 font-normal"
          />
        </label>

        <div className="grid grid-cols-3 gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Price (₹)
            <input
              type="number"
              required
              min="0"
              value={form.price}
              onChange={update("price")}
              className="rounded-md border border-line px-3 py-2 font-normal"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Quantity
            <input
              type="number"
              required
              min={isEditing ? 0 : 1}
              value={form.quantity}
              onChange={update("quantity")}
              className="rounded-md border border-line px-3 py-2 font-normal"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Category
            <select
              value={form.category}
              onChange={update("category")}
              className="rounded-md border border-line px-3 py-2 font-normal capitalize"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="-mt-2 text-xs text-ink/50">
          {isEditing
            ? "Setting quantity to 0 will automatically mark this listing as sold."
            : "How many identical units are you selling (e.g. 3 copies of this book)."}
        </p>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Condition
          <select
            value={form.condition}
            onChange={update("condition")}
            className="rounded-md border border-line px-3 py-2 font-normal capitalize"
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          {isEditing ? "Add more photos (optional)" : "Photos (up to 5)"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setPhotos(e.target.files)}
            className="rounded-md border border-line px-3 py-2 font-normal"
          />
        </label>

        {error && <p className="text-sm text-clay">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-forest px-4 py-2 font-semibold text-paper hover:bg-forest-light disabled:opacity-60"
        >
          {submitting ? "Saving…" : isEditing ? "Save changes" : "Publish listing"}
        </button>
      </form>
    </div>
  );
}
