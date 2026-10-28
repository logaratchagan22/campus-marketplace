// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ListingDetail from "./pages/ListingDetail";
// import ListingForm from "./pages/ListingForm";
// import MyListings from "./pages/MyListings";
// import Messages from "./pages/Messages";
// import Conversation from "./pages/Conversation";

// function NotFound() {
//   return (
//     <div className="mx-auto max-w-xl px-6 py-24 text-center">
//       <h1 className="font-display text-3xl font-semibold">Page not found</h1>
//       <p className="mt-2 text-ink/60">That listing or page doesn't exist anymore.</p>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <div className="min-h-screen bg-paper">
//           <Navbar />
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/listings/:id" element={<ListingDetail />} />
//             <Route
//               path="/new"
//               element={
//                 <ProtectedRoute>
//                   <ListingForm />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/listings/:id/edit"
//               element={
//                 <ProtectedRoute>
//                   <ListingForm />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/my-listings"
//               element={
//                 <ProtectedRoute>
//                   <MyListings />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/messages"
//               element={
//                 <ProtectedRoute>
//                   <Messages />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/messages/:id"
//               element={
//                 <ProtectedRoute>
//                   <Conversation />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </div>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ListingDetail from "./pages/ListingDetail";
import ListingForm from "./pages/ListingForm";
import MyListings from "./pages/MyListings";
import Messages from "./pages/Messages";
import Conversation from "./pages/Conversation";
import ForgotPassword from "./pages/ForgotPassword"; // Imported your new recovery wizard screen!

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 text-ink/60">That listing or page doesn't exist anymore.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-paper">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            {/* PUBLIC ACCESS OTP ACCOUNT RECOVERY INTERFACE ROUTE */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route
              path="/new"
              element={
                <ProtectedRoute>
                  <ListingForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/listings/:id/edit"
              element={
                <ProtectedRoute>
                  <ListingForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-listings"
              element={
                <ProtectedRoute>
                  <MyListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages/:id"
              element={
                <ProtectedRoute>
                  <Conversation />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
