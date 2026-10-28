import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/auth/users")
      .then((res) => setUsers(res.data.users))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-10 text-center text-ink/60">Loading Dashboard Data…</p>;
  if (error) return <p className="p-10 text-center text-clay">{error}</p>;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Admin Panel</h1>
          <p className="mt-1 text-sm text-ink/60">Manage registered system profiles and security auditing traces.</p>
        </div>
        <Link to="/" className="text-sm font-medium text-forest hover:underline">
          ← Back to browsing
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-line bg-paper shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-line bg-line/20 text-xs font-semibold uppercase tracking-wider text-ink/60">
              <th className="px-6 py-3">Full Name</th>
              <th className="px-6 py-3">Email ID</th>
              <th className="px-6 py-3">System Role</th>
              <th className="px-6 py-3">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-sm text-ink/80">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-line/10 transition-colors">
                <td className="px-6 py-4 font-medium text-ink">{u.name}</td>
                <td className="px-6 py-4 font-mono text-xs">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${u.role === 'admin' ? 'bg-mustard text-ink' : 'bg-line/60 text-ink/70'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-ink/60">
                  {new Date(u.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
