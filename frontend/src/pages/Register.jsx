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
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Register() {
//   const { register } = useAuth();
//   const navigate = useNavigate();
//   // Removed campus from initial state hook values
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
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
//       // Removed form.campus from the registration payload parameters
//       await register(form.name, form.email, form.password);
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
  const { register, verifySignup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [verificationStep, setVerificationStep] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => {
      setForm((current) => ({
        ...current,
        [field]: e.target.value,
      }));
    };
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const result = await register(
        form.name,
        form.email,
        form.password
      );

      setVerificationStep(true);
      setMessage(
        result.message ||
          "Verification code sent. Check your email."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not start registration."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      await verifySignup(form.email, otp);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not verify your email."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const result = await register(
        form.name,
        form.email,
        form.password
      );

      setOtp("");
      setMessage(
        result.message || "A new verification code was sent."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not resend the code."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl font-semibold">
        {verificationStep
          ? "Verify your email"
          : "Create an account"}
      </h1>

      <p className="mt-1 text-ink/60">
        {verificationStep
          ? `Enter the six-digit code sent to ${form.email}.`
          : "List your first item in a couple of minutes."}
      </p>

      {!verificationStep ? (
        <form
          onSubmit={handleRegister}
          className="mt-8 flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1 text-sm font-medium">
            Full name
            <input
              type="text"
              required
              maxLength={60}
              autoComplete="name"
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
              autoComplete="email"
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
              autoComplete="new-password"
              value={form.password}
              onChange={update("password")}
              className="rounded-md border border-line px-3 py-2 font-normal"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-clay">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="text-sm text-forest">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-forest px-4 py-2 font-semibold text-paper hover:bg-forest-light disabled:opacity-60"
          >
            {submitting ? "Sending code…" : "Continue"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleVerify}
          className="mt-8 flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1 text-sm font-medium">
            Six-digit verification code
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              minLength={6}
              maxLength={6}
              required
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="123456"
              className="rounded-md border border-line px-3 py-2 text-center font-mono text-xl tracking-widest"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-clay">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="text-sm text-forest">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || otp.length !== 6}
            className="rounded-md bg-forest px-4 py-2 font-semibold text-paper hover:bg-forest-light disabled:opacity-60"
          >
            {submitting ? "Verifying…" : "Verify email"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={submitting}
            className="text-sm font-semibold text-forest underline disabled:opacity-60"
          >
            Resend verification code
          </button>

          <button
            type="button"
            onClick={() => {
              setVerificationStep(false);
              setOtp("");
              setError("");
              setMessage("");
            }}
            disabled={submitting}
            className="text-sm text-ink/60 underline"
          >
            Back to signup
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-ink/60">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-forest underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
