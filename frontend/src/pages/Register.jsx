// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Register() {
//   const { register } = useAuth();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ name: "", email: "", password: "", campus: "" });
//   const [error, setError] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   function update(field) {
//     return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setSubmitting(true);
//     try {
//       await register(form.name, form.email, form.password, form.campus);
//       navigate("/");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <div className="mx-auto max-w-md px-6 py-16">
//       <h1 className="font-display text-3xl font-semibold">Create an account</h1>
//       <p className="mt-1 text-ink/60">List your first item in a couple of minutes.</p>

//       <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
//         <label className="flex flex-col gap-1 text-sm font-medium">
//           Full name
//           <input
//             type="text"
//             required
//             value={form.name}
//             onChange={update("name")}
//             className="rounded-md border border-line px-3 py-2 font-normal"
//           />
//         </label>

//         <label className="flex flex-col gap-1 text-sm font-medium">
//           Email
//           <input
//             type="email"
//             required
//             value={form.email}
//             onChange={update("email")}
//             className="rounded-md border border-line px-3 py-2 font-normal"
//           />
//         </label>

//         <label className="flex flex-col gap-1 text-sm font-medium">
//           Campus
//           <input
//             type="text"
//             placeholder="e.g. North Campus"
//             value={form.campus}
//             onChange={update("campus")}
//             className="rounded-md border border-line px-3 py-2 font-normal"
//           />
//         </label>

//         <label className="flex flex-col gap-1 text-sm font-medium">
//           Password
//           <input
//             type="password"
//             required
//             minLength={6}
//             value={form.password}
//             onChange={update("password")}
//             className="rounded-md border border-line px-3 py-2 font-normal"
//           />
//         </label>

//         {error && <p className="text-sm text-clay">{error}</p>}

//         <button
//           type="submit"
//           disabled={submitting}
//           className="rounded-md bg-forest px-4 py-2 font-semibold text-paper hover:bg-forest-light disabled:opacity-60"
//         >
//           {submitting ? "Creating account…" : "Sign up"}
//         </button>
//       </form>

//       <p className="mt-6 text-sm text-ink/60">
//         Already have an account?{" "}
//         <Link to="/login" className="font-semibold text-forest underline">
//           Log in
//         </Link>
//       </p>
//     </div>
//   );
// }
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  // Removed campus from initial state hook values
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      // Removed form.campus from the registration payload parameters
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl font-semibold">Create an account</h1>
      <p className="mt-1 text-ink/60">List your first item in a couple of minutes.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Full name
          <input
            type="text"
            required
            value={form.name}
            onChange={update("name")}
            className="rounded-md border border-line px-3 py-2 font-normal"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            className="rounded-md border border-line px-3 py-2 font-normal"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Password
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={update("password")}
            className="rounded-md border border-line px-3 py-2 font-normal"
          />
        </label>

        {error && <p className="text-sm text-clay">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-forest px-4 py-2 font-semibold text-paper hover:bg-forest-light disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-forest underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
