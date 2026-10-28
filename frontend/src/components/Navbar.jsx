// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   function handleLogout() {
//     logout();
//     navigate("/");
//   }

//   return (
//     <header className="border-b-2 border-ink bg-forest text-paper">
//       <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
//         <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
//           Campus Marketplace
//         </Link>

//         <nav className="flex items-center gap-5 text-sm font-medium">
//           <Link to="/" className="hover:text-mustard">
//             Browse
//           </Link>

//           {user ? (
//             <>
//               <Link to="/new" className="hover:text-mustard">
//                 Sell an item
//               </Link>
//               <Link to="/my-listings" className="hover:text-mustard">
//                 My listings
//               </Link>
//               <Link to="/messages" className="hover:text-mustard">
//                 Messages
//               </Link>
//               <span className="hidden text-forest-light sm:inline">
//                 Hi, {user.name.split(" ")[0]}
//               </span>
//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="rounded-md bg-mustard px-3 py-1.5 font-semibold text-ink hover:bg-mustard-dark"
//               >
//                 Log out
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="hover:text-mustard">
//                 Log in
//               </Link>
//               <Link
//                 to="/register"
//                 className="rounded-md bg-mustard px-3 py-1.5 font-semibold text-ink hover:bg-mustard-dark"
//               >
//                 Sign up
//               </Link>
//             </>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// }
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   function handleLogout() {
//     logout();
//     navigate("/");
//   }

//   return (
//     <header className="border-b-2 border-ink bg-forest text-paper">
//       <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
//         <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
//           Campus Marketplace
//         </Link>

//         <nav className="flex items-center gap-5 text-sm font-medium">
//           <Link to="/" className="hover:text-mustard">
//             Browse
//           </Link>

//           {user ? (
//             <>
//               <Link to="/new" className="hover:text-mustard">
//                 Sell an item
//               </Link>
//               <Link to="/my-listings" className="hover:text-mustard">
//                 My listings
//               </Link>
//               <Link to="/messages" className="hover:text-mustard">
//                 Messages
//               </Link>
//               <span className="hidden text-forest-light sm:inline-flex items-center gap-1.5">
//                 Hi, {user.name.split(" ")[0]}
//                 {/* VISUAL IDENTIFICATION MARK FOR ADMIN */}
//                 {user.role === "admin" && (
//                   <span className="rounded bg-mustard px-1.5 py-0.5 text-[10px] font-bold text-ink uppercase tracking-wide">
//                     Admin
//                   </span>
//                 )}
//               </span>
//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="rounded-md bg-mustard px-3 py-1.5 font-semibold text-ink hover:bg-mustard-dark"
//               >
//                 Log out
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="hover:text-mustard">
//                 Log in
//               </Link>
//               <Link
//                 to="/register"
//                 className="rounded-md bg-mustard px-3 py-1.5 font-semibold text-ink hover:bg-mustard-dark"
//               >
//                 Sign up
//               </Link>
//             </>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// }

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="border-b-2 border-ink bg-forest text-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
          Campus Marketplace
        </Link>

        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link to="/" className="hover:text-mustard">
            Browse
          </Link>

          {user ? (
            <>
              {/* DYNAMIC NAVIGATION LINK VISIBLE EXCLUSIVELY TO ADMINS */}
              {user.role === "admin" && (
                <Link to="/admin" className="text-mustard font-semibold hover:underline">
                  Admin Panel
                </Link>
              )}

              <Link to="/new" className="hover:text-mustard">
                Sell an item
              </Link>
              <Link to="/my-listings" className="hover:text-mustard">
                My listings
              </Link>
              <Link to="/messages" className="hover:text-mustard">
                Messages
              </Link>
              <span className="hidden text-forest-light sm:inline-flex items-center gap-1.5">
                Hi, {user.name.split(" ")[0]}
                {/* VISUAL IDENTIFICATION MARK FOR ADMIN */}
                {user.role === "admin" && (
                  <span className="rounded bg-mustard px-1.5 py-0.5 text-[10px] font-bold text-ink uppercase tracking-wide">
                    Admin
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-mustard px-3 py-1.5 font-semibold text-ink hover:bg-mustard-dark"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-mustard">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-mustard px-3 py-1.5 font-semibold text-ink hover:bg-mustard-dark"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
