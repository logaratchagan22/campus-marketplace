// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../api/client";

// export default function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     setLoading(true);
//     api
//       .get("/auth/users")
//       .then((res) => setUsers(res.data.users))
//       .catch((err) => setError(err.response?.data?.message || err.message))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <p className="p-10 text-center text-ink/60">Loading Dashboard Data…</p>;
//   if (error) return <p className="p-10 text-center text-clay">{error}</p>;

//   return (
//     <div className="mx-auto max-w-4xl px-6 py-10">
//       <div className="flex items-center justify-between border-b border-line pb-4">
//         <div>
//           <h1 className="font-display text-3xl font-semibold">Admin Panel</h1>
//           <p className="mt-1 text-sm text-ink/60">Manage registered system profiles and security auditing traces.</p>
//         </div>
//         <Link to="/" className="text-sm font-medium text-forest hover:underline">
//           ← Back to browsing
//         </Link>
//       </div>

//       <div className="mt-8 overflow-hidden rounded-lg border border-line bg-paper shadow-sm">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="border-b border-line bg-line/20 text-xs font-semibold uppercase tracking-wider text-ink/60">
//               <th className="px-6 py-3">Full Name</th>
//               <th className="px-6 py-3">Email ID</th>
//               <th className="px-6 py-3">System Role</th>
//               <th className="px-6 py-3">Joined Date</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-line text-sm text-ink/80">
//             {users.map((u) => (
//               <tr key={u.id} className="hover:bg-line/10 transition-colors">
//                 <td className="px-6 py-4 font-medium text-ink">{u.name}</td>
//                 <td className="px-6 py-4 font-mono text-xs">{u.email}</td>
//                 <td className="px-6 py-4">
//                   <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${u.role === 'admin' ? 'bg-mustard text-ink' : 'bg-line/60 text-ink/70'}`}>
//                     {u.role}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-xs text-ink/60">
//                   {new Date(u.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/auth/users");
      setUsers(res.data.users || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not load users."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleDelete(user) {
    const confirmed = window.confirm(
      `Permanently delete ${user.name} (${user.email})?\n\nTheir listings and related conversations will also be deleted. This cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");
    setDeletingId(user.id);

    try {
      const res = await api.delete(`/auth/users/${user.id}`);

      setUsers((current) =>
        current.filter((item) => item.id !== user.id)
      );

      setNotice(
        res.data.message || "User deleted successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not delete this user."
      );
    } finally {
      setDeletingId("");
    }
  }

  if (loading) {
    return (
      <p className="p-10 text-center text-ink/60">
        Loading Dashboard Data…
      </p>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="p-10 text-center">
        <p role="alert" className="text-clay">
          {error}
        </p>
        <button
          type="button"
          onClick={loadUsers}
          className="mt-4 rounded-md bg-forest px-4 py-2 font-semibold text-paper"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            Manage registered users and their account status.
          </p>
        </div>

        <Link
          to="/"
          className="text-sm font-medium text-forest hover:underline"
        >
          ← Back to browsing
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-clay">
          {error}
        </p>
      )}

      {notice && (
        <p role="status" className="mt-4 text-sm text-forest">
          {notice}
        </p>
      )}

      <div className="mt-8 overflow-x-auto rounded-lg border border-line bg-paper shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-line/20 text-xs font-semibold uppercase tracking-wider text-ink/60">
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Email ID</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Email Status</th>
              <th className="px-4 py-3">Joined Date</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-line text-sm text-ink/80">
            {users.map((user) => (
              <tr
                key={user.id}
                className="transition-colors hover:bg-line/10"
              >
                <td className="px-4 py-4 font-medium text-ink">
                  {user.name}
                </td>

                <td className="px-4 py-4 font-mono text-xs">
                  {user.email}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${
                      user.role === "admin"
                        ? "bg-mustard text-ink"
                        : "bg-line/60 text-ink/70"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-4 py-4">
                  {user.isEmailVerified ? (
                    <span className="text-xs font-semibold text-forest">
                      Verified
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-clay">
                      Unverified
                    </span>
                  )}
                </td>

                <td className="px-4 py-4 text-xs text-ink/60">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "—"}
                </td>

                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => handleDelete(user)}
                    disabled={deletingId === user.id}
                    className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === user.id
                      ? "Deleting…"
                      : "Delete"}
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-ink/60"
                >
                  No registered users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
