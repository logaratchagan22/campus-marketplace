// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../api/client";

// export default function ForgotPassword() {
//   const navigate = useNavigate();
  
//   // Wizards steps tracker: 1 = Email Input, 2 = Verify OTP, 3 = Reset Password
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
  
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   // STEP 1: Request OTP generation endpoint
//   async function handleRequestOtp(e) {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     setSubmitting(true);
//     try {
//       const res = await api.post("/auth/forgot-password", { email });
//       setMessage("A 6-digit OTP code has been generated. Please check backend server dashboard logs to copy it!");
//       setStep(2);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   // STEP 2: Validate OTP endpoint
//   async function handleVerifyOtp(e) {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     setSubmitting(true);
//     try {
//       await api.post("/auth/verify-otp", { email, otp });
//       setMessage("Verification code confirmed successfully. Set your new security credentials below.");
//       setStep(3);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   // STEP 3: Override profile with matching new passwords strings
//   async function handleResetPassword(e) {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     setSubmitting(true);
//     try {
//       await api.post("/auth/reset-password", { email, otp, newPassword, confirmPassword });
//       alert("Password updated successfully! Redirecting back to authentication screen.");
//       navigate("/login");
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <div className="mx-auto max-w-md px-6 py-16">
//       <h1 className="font-display text-3xl font-semibold">Account Recovery</h1>
//       <p className="mt-1 text-ink/60">Recover access to your marketplace profile.</p>

//       {message && <p className="mt-4 rounded bg-forest/10 p-3 text-sm font-medium text-forest border border-forest/20">{message}</p>}
//       {error && <p className="mt-4 rounded bg-clay/10 p-3 text-sm font-medium text-clay border border-clay/20">{error}</p>}

//       {/* STAGE 1: SUBMIT EMAIL FOR CODE */}
//       {step === 1 && (
//         <form onSubmit={handleRequestOtp} className="mt-6 flex flex-col gap-4">
//           <label className="flex flex-col gap-1 text-sm font-medium">
//             Enter your account email address
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="rounded-md border border-line px-3 py-2 font-normal focus:outline-forest"
//               placeholder="e.g. student@college.edu"
//             />
//           </label>
//           <button
//             type="submit"
//             disabled={submitting}
//             className="rounded-md bg-forest px-4 py-2 font-semibold text-paper hover:bg-forest-light disabled:opacity-60"
//           >
//             {submitting ? "Processing request…" : "Send OTP Verification Code"}
//           </button>
//         </form>
//       )}

//       {/* STAGE 2: CONFIRM THE GENERATED CODE */}
//       {step === 2 && (
//         <form onSubmit={handleVerifyOtp} className="mt-6 flex flex-col gap-4">
//           <p className="text-xs text-ink/50 bg-line/20 p-2 rounded">
//             💡 Dev Tip: Open your <b>Render dashboard panel terminal</b> and scroll down inside your <b>Live Web Service logs</b> stream to find the printed 6-digit number!
//           </p>
//           <label className="flex flex-col gap-1 text-sm font-medium">
//             Enter the 6-Digit OTP Code
//             <input
//               type="text"
//               required
//               maxLength={6}
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="rounded-md border border-line px-3 py-2 text-center text-xl font-bold tracking-widest focus:outline-forest"
//               placeholder="000000"
//             />
//           </label>
//           <button
//             type="submit"
//             disabled={submitting}
//             className="rounded-md bg-forest px-4 py-2 font-semibold text-paper hover:bg-forest-light disabled:opacity-60"
//           >
//             {submitting ? "Verifying code…" : "Verify OTP Code"}
//           </button>
//           <button type="button" onClick={() => setStep(1)} className="text-sm text-ink/60 underline self-center">
//             Go back
//           </button>
//         </form>
//       )}

//       {/* STAGE 3: INPUT FRESH PASSWORDS */}
//       {step === 3 && (
//         <form onSubmit={handleResetPassword} className="mt-6 flex flex-col gap-4">
//           <label className="flex flex-col gap-1 text-sm font-medium">
//             New Password
//             <input
//               type="password"
//               required
//               minLength={6}
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               className="rounded-md border border-line px-3 py-2 font-normal focus:outline-forest"
//             />
//           </label>
//           <label className="flex flex-col gap-1 text-sm font-medium">
//             Confirm New Password
//             <input
//               type="password"
//               required
//               minLength={6}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className="rounded-md border border-line px-3 py-2 font-normal focus:outline-forest"
//             />
//           </label>
//           <button
//             type="submit"
//             disabled={submitting}
//             className="rounded-md bg-forest px-4 py-2 font-semibold text-paper hover:bg-forest-light disabled:opacity-60"
//           >
//             {submitting ? "Updating security password…" : "Save New Password"}
//           </button>
//         </form>
//       )}

//       <p className="mt-6 text-sm text-ink/60 text-center">
//         Remembered it?{" "}
//         <Link to="/login" className="font-semibold text-forest underline">
//           Back to login
//         </Link>
//       </p>
//     </div>
//   );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  // Wizards steps tracker: 1 = Email Input, 2 = Verify OTP, 3 = Reset Password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // STEP 1: Request OTP generation endpoint
  async function handleRequestOtp(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email });
      // FIXED SUCCESS MESSAGE FOR REAL USERS
      setMessage("A secure 6-digit OTP code has been sent directly to your registered email inbox account!");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // STEP 2: Validate OTP endpoint
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      setMessage("Verification code confirmed successfully. Set your new security credentials below.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // STEP 3: Override profile with matching new passwords strings
  async function handleResetPassword(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", { email, otp, newPassword, confirmPassword });
      alert("Password updated successfully! Redirecting back to authentication screen.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl font-semibold">Account Recovery</h1>
      <p className="mt-1 text-ink/60">Recover access to your marketplace profile.</p>

      {message && <p className="mt-4 rounded bg-forest/10 p-3 text-sm font-medium text-forest border border-forest/20">{message}</p>}
      {error && <p className="mt-4 rounded bg-clay/10 p-3 text-sm font-medium text-clay border border-clay/20">{error}</p>}

      {/* STAGE 1: SUBMIT EMAIL FOR CODE */}
      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Enter your account email address
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-line px-3 py-2 font-normal focus:outline-forest"
              placeholder="e.g. student@college.edu"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-forest px-4 py-2 font-semibold text-paper hover:bg-forest-light disabled:opacity-60"
          >
            {submitting ? "Processing request…" : "Send OTP Verification Code"}
          </button>
        </form>
      )}

      {/* STAGE 2: CONFIRM THE GENERATED CODE */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Enter the 6-Digit OTP Code
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="rounded-md border border-line px-3 py-2 text-center text-xl font-bold tracking-widest focus:outline-forest"
              placeholder="000000"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-forest px-4 py-2 font-semibold text-paper hover:bg-forest-light disabled:opacity-60"
          >
            {submitting ? "Verifying code…" : "Verify OTP Code"}
          </button>
          <button type="button" onClick={() => setStep(1)} className="text-sm text-ink/60 underline self-center">
            Go back
          </button>
        </form>
      )}

      {/* STAGE 3: INPUT FRESH PASSWORDS */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            New Password
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-md border border-line px-3 py-2 font-normal focus:outline-forest"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Confirm New Password
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-md border border-line px-3 py-2 font-normal focus:outline-forest"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-forest px-4 py-2 font-semibold text-paper hover:bg-forest-light disabled:opacity-60"
          >
            {submitting ? "Updating security password…" : "Save New Password"}
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-ink/60 text-center">
        Remembered it?{" "}
        <Link to="/login" className="font-semibold text-forest underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
