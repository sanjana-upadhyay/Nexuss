import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/useAuth";

const NavLink = ({ to, isActive, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`relative px-3 py-2 text-sm transition ${
      isActive ? "text-[#ede9e3]" : "text-[#948b80] hover:text-[#ede9e3]"
    }`}
  >
    {children}
    {isActive && (
      <motion.span
        layoutId="nav-underline"
        className="absolute left-3 right-3 -bottom-0.5 h-px bg-[#c9a26d] hidden sm:block"
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    )}
  </Link>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-[#12100f]/90 backdrop-blur-md border-b border-[#33302c]"
    >
      <div className="flex items-center justify-between px-6 sm:px-8 py-4">
        <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
          <motion.span
            className="w-2 h-2 rounded-full bg-[#c9a26d]"
            whileHover={{ scale: 1.4 }}
            transition={{ type: "spring", stiffness: 400 }}
          />
          <span className="text-lg font-semibold text-[#ede9e3]" style={{ fontFamily: "'Fraunces', serif" }}>
  Nex<span className="text-[#c9a26d]">uss</span>
</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1 sm:gap-2">
          <NavLink to="/workspaces" isActive={location.pathname === "/workspaces"}>
            Workspaces
          </NavLink>

          {user ? (
            <>
              {(user.role === "owner" || user.role === "admin") && (
                <NavLink to="/owner/dashboard" isActive={location.pathname === "/owner/dashboard"}>
                  Dashboard
                </NavLink>
              )}
              <NavLink to="/my-bookings" isActive={location.pathname === "/my-bookings"}>
                My Bookings
              </NavLink>

              <div className="flex items-center gap-3 ml-2 pl-3 border-l border-[#33302c]">
                <Link
                  to="/profile"
                  className="text-sm text-[#948b80] hover:text-[#c9a26d] transition"
                >
                  {user.name}
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-full text-sm text-[#948b80] border border-[#33302c] hover:border-[#c9a26d]/40 hover:text-[#c9a26d] transition"
                >
                  Logout
                </motion.button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" isActive={location.pathname === "/login"}>
                Login
              </NavLink>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signup"
                  className="ml-2 px-4 py-2 rounded-full text-sm font-medium bg-[#c9a26d] text-[#12100f] hover:bg-[#d9b481] transition inline-block"
                >
                  Sign Up
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen((p) => !p)}
          className="sm:hidden flex flex-col gap-1.5 w-6 h-6 items-center justify-center"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-[#ede9e3] block"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-6 h-0.5 bg-[#ede9e3] block"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-[#ede9e3] block"
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden overflow-hidden border-t border-[#33302c]"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              <Link
                to="/workspaces"
                onClick={closeMenu}
                className="py-2.5 text-[#ede9e3] text-sm border-b border-[#1c1917]"
              >
                Workspaces
              </Link>

              {user ? (
                <>
                  {(user.role === "owner" || user.role === "admin") && (
                    <Link
                      to="/owner/dashboard"
                      onClick={closeMenu}
                      className="py-2.5 text-[#ede9e3] text-sm border-b border-[#1c1917]"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to="/my-bookings"
                    onClick={closeMenu}
                    className="py-2.5 text-[#ede9e3] text-sm border-b border-[#1c1917]"
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="py-2.5 text-[#ede9e3] text-sm border-b border-[#1c1917]"
                  >
                    {user.name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="py-2.5 text-left text-red-400 text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="py-2.5 text-[#ede9e3] text-sm border-b border-[#1c1917]"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="py-2.5 text-[#c9a26d] text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;