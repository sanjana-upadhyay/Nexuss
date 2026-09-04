import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getMyBookings, cancelBooking } from "../services/bookingService";
import BookingCard from "../component/Booking/BookingCard";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
  try {
    const result = await cancelBooking(id);
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
    );
    toast.success(result.message, { duration: 5000 });
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to cancel booking");
  }
};

  return (
    <div className="min-h-screen bg-[#12100f] px-6 sm:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4 text-xs text-[#948b80] uppercase tracking-widest">
            <span className="w-6 h-px bg-[#c9a26d]" />
            Your schedule
          </div>

          <h1
            className="text-3xl text-[#ede9e3] mb-8"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            My Bookings
          </h1>
        </motion.div>

        {loading && (
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-[#1c1917] border border-[#33302c]" />
            ))}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm mb-4 border border-red-500/20">
            {error}
          </div>
        )}

        {!loading && bookings.length === 0 && !error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#948b80]"
          >
            You have no bookings yet.
          </motion.p>
        )}

        <div className="space-y-4">
          <AnimatePresence>
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleCancel}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;