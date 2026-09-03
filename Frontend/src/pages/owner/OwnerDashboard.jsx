import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getWorkspaces, deleteWorkspace } from "../../services/workspaceService";
import { getOwnerAnalytics } from "../../services/bookingService";
import { useAuth } from "../../context/useAuth";

const StatCard = ({ label, value, mono = true }) => (
  <div className="bg-[#1c1917] border border-[#33302c] rounded-2xl p-5">
    <div
      className="text-2xl text-[#c9a26d]"
      style={mono ? { fontFamily: "'IBM Plex Mono', monospace" } : {}}
    >
      {value}
    </div>
    <div className="text-xs text-[#948b80] uppercase tracking-wide mt-1">
      {label}
    </div>
  </div>
);

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const fetchMyWorkspaces = async () => {
    setLoading(true);
    try {
      const all = await getWorkspaces();
      const mine =
        user.role === "admin"
          ? all
          : all.filter((w) => w.owner?._id === user._id || w.owner === user._id);
      setWorkspaces(mine);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const data = await getOwnerAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchMyWorkspaces();
      fetchAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this workspace?")) return;

    try {
      await deleteWorkspace(id);
      setWorkspaces((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete workspace");
    }
  };

  return (
    <div className="min-h-screen bg-[#12100f] px-6 sm:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-start justify-between mb-8 gap-4 flex-wrap"
        >
          <div>
            <div className="flex items-center gap-2 mb-4 text-xs text-[#948b80] uppercase tracking-widest">
              <span className="w-6 h-px bg-[#c9a26d]" />
              {user?.role === "admin" ? "Admin" : "Owner"}
            </div>
            <h1
              className="text-3xl text-[#ede9e3]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {user?.role === "admin" ? "All listings" : "Your listings"}
            </h1>
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/owner/workspaces/new"
              className="px-5 py-2.5 rounded-full bg-[#c9a26d] text-[#12100f] font-medium hover:bg-[#d9b481] transition h-fit inline-block"
            >
              + Add workspace
            </Link>
          </motion.div>
        </motion.div>

        {/* Analytics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {analyticsLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-[#1c1917] border border-[#33302c] animate-pulse" />
            ))
          ) : (
            <>
              <StatCard label="Total Revenue" value={`₹${analytics?.totalRevenue || 0}`} />
              <StatCard label="Total Bookings" value={analytics?.totalBookings || 0} />
              <StatCard label="This Month" value={`₹${analytics?.thisMonthRevenue || 0}`} />
              <StatCard label="Listed Spaces" value={analytics?.totalWorkspaces || 0} />
            </>
          )}
        </div>

        {loading && (
          <div className="space-y-3 animate-pulse">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-[#1c1917] border border-[#33302c]" />
            ))}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm mb-4 border border-red-500/20">
            {error}
          </div>
        )}

        {!loading && workspaces.length === 0 && !error && (
          <p className="text-[#948b80]">
            {user?.role === "admin"
              ? "No workspaces listed yet."
              : "You haven't listed any workspace yet."}
          </p>
        )}

        <div className="space-y-3">
          <AnimatePresence>
            {workspaces.map((ws) => (
              <motion.div
                key={ws._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="bg-[#1c1917] border border-[#33302c] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <h3
                    className="text-lg text-[#ede9e3]"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {ws.name}
                  </h3>
                  <p className="text-[#948b80] text-sm">{ws.city}</p>
                  {user?.role === "admin" && ws.owner?.name && (
                    <p className="text-[#66605a] text-xs mt-0.5">
                      Owner: {ws.owner.name}
                    </p>
                  )}
                  <p
                    className="text-[#c9a26d] text-sm mt-1"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    ₹{ws.price} / seat
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/owner/workspaces/${ws._id}/edit`}
                    className="px-4 py-2 rounded-full border border-[#33302c] text-[#948b80] hover:text-[#ede9e3] hover:border-[#4c7a73]/40 transition text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(ws._id)}
                    className="px-4 py-2 rounded-full border border-[#33302c] text-[#948b80] hover:text-red-400 hover:border-red-500/40 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;