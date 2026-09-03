import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getWorkspaceById } from "../services/workspaceService";
import { createBooking, checkAvailability } from "../services/bookingService";
import { useAuth } from "../context/useAuth";
import ReviewSection from "../component/workspace/ReviewSection";
import ReviewSummary from "../component/workspace/ReviewSummary";
import WishlistButton from "../component/workspace/WishlistButton";
import ImageGallery from "../component/workspace/ImageGallery";
import SimilarWorkspaces from "../component/workspace/SimilarWorkspaces";
import Breadcrumbs from "../component/common/Breadcrumbs";
import { getTypeInfo } from "../utils/workspaceTypes";

const amenityList = [
  { key: "wifi", label: "Wifi", icon: "📶" },
  { key: "parking", label: "Parking", icon: "🅿️" },
  { key: "ac", label: "Air Conditioning", icon: "❄️" },
  { key: "meetingRoom", label: "Meeting Room", icon: "🗓️" },
  { key: "cafeteria", label: "Cafeteria", icon: "☕" },
  { key: "powerBackup", label: "Power Backup", icon: "🔋" },
  { key: "cctv", label: "CCTV Surveillance", icon: "📹" },
  { key: "reception", label: "Reception", icon: "🛎️" },
  { key: "printer", label: "Printer", icon: "🖨️" },
  { key: "housekeeping", label: "Housekeeping", icon: "🧹" },
];

const leaseTermLabel = { hourly: "/ hour", daily: "/ day", monthly: "/ month" };

const WorkspaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookingMode, setBookingMode] = useState("single");
  const [bookingData, setBookingData] = useState({
    date: "",
    endDate: "",
    startTime: "",
    endTime: "",
    seatsBooked: 1,
  });
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const [availableSeats, setAvailableSeats] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    const fetchWorkspace = async () => {
      setLoading(true);
      try {
        const data = await getWorkspaceById(id);
        setWorkspace(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load workspace");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspace();
  }, [id]);

  const checkSlotAvailability = async (data) => {
    if (!data.date || !data.startTime || !data.endTime) {
      setAvailableSeats(null);
      return;
    }
    if (data.startTime >= data.endTime) return;

    setCheckingAvailability(true);
    try {
      const result = await checkAvailability(id, data.date, data.startTime, data.endTime);
      setAvailableSeats(result.availableSeats);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleBookingChange = (e) => {
    const updated = { ...bookingData, [e.target.name]: e.target.value };
    setBookingData(updated);
    if (bookingMode === "single" && ["date", "startTime", "endTime"].includes(e.target.name)) {
      checkSlotAvailability(updated);
    }
  };

  const handleModeSwitch = (mode) => {
    setBookingMode(mode);
    setAvailableSeats(null);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError("");
    setBookingSuccess("");

    if (!user) {
      navigate("/login");
      return;
    }

    setBookingLoading(true);
    try {
      const result = await createBooking({
        workspaceId: id,
        ...bookingData,
        endDate: bookingMode === "multi" ? bookingData.endDate : undefined,
        seatsBooked: Number(bookingData.seatsBooked),
      });
      const days = result.numberOfDays > 1 ? ` for ${result.numberOfDays} days` : "";
      setBookingSuccess(`Booking confirmed${days}.`);
      toast.success("Booking confirmed! Check My Bookings.");
      setBookingData({ date: "", endDate: "", startTime: "", endTime: "", seatsBooked: 1 });
      setAvailableSeats(null);
    } catch (err) {
      const message = err.response?.data?.message || "Booking failed";
      setBookingError(message);
      toast.error(message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleEnquire = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    toast.success("Enquiry sent! The workspace owner will get back to you soon.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#12100f] px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto animate-pulse">
          <div className="lg:col-span-2">
            <div className="h-64 rounded-2xl bg-[#1c1917] border border-[#33302c] mb-6" />
            <div className="h-8 w-2/3 rounded bg-[#1c1917] mb-3" />
            <div className="h-4 w-1/3 rounded bg-[#1c1917]" />
          </div>
          <div className="h-80 rounded-2xl bg-[#1c1917] border border-[#33302c]" />
        </div>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="min-h-screen bg-[#12100f] flex items-center justify-center">
        <p className="text-red-400">{error || "Workspace not found"}</p>
      </div>
    );
  }

  const typeInfo = getTypeInfo(workspace.type);
  const availableAmenities = amenityList.filter((a) => workspace.amenities?.[a.key]);

  const specs = [
    workspace.areaSqft > 0 && { label: "Area", value: `${workspace.areaSqft} sq.ft` },
    workspace.floor && { label: "Floor", value: workspace.floor },
    { label: "Capacity", value: `${workspace.seatsAvailable} seats` },
    { label: "Type", value: typeInfo.label },
  ].filter(Boolean);

  const seatsMax =
    bookingMode === "single" && availableSeats !== null
      ? availableSeats
      : workspace.seatsAvailable;

  return (
    <div className="min-h-screen bg-[#12100f] px-6 sm:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Workspaces", to: "/workspaces" },
            { label: workspace.name },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {/* Left: Workspace Info */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <ImageGallery images={workspace.images} />
          </div>

          <div className="flex items-start justify-between gap-4 mb-1">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#c9a26d]/10 text-[#c9a26d] text-xs font-medium mb-2">
                {typeInfo.icon} {typeInfo.label}
              </span>
              <h1
                className="text-3xl text-[#ede9e3]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {workspace.name}
              </h1>
            </div>
            <WishlistButton workspaceId={id} />
          </div>

          <p className="text-[#948b80] mb-6 flex items-center gap-1">
            📍 {workspace.locality ? `${workspace.locality}, ` : ""}{workspace.address}, {workspace.city}
          </p>

          {/* Specs strip */}
          {specs.length > 0 && (
            <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-[#33302c]">
              {specs.map((s) => (
                <div key={s.label}>
                  <div className="text-[#66605a] text-[11px] uppercase tracking-wide">
                    {s.label}
                  </div>
                  <div
                    className="text-[#ede9e3] text-sm mt-0.5"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-[#ede9e3]/80 leading-relaxed mb-6">
            {workspace.description}
          </p>

          {/* Full amenities grid */}
          {availableAmenities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm text-[#948b80] uppercase tracking-wide mb-3">
                Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableAmenities.map((a) => (
                  <div
                    key={a.key}
                    className="flex items-center gap-2 text-sm text-[#ede9e3]/80 px-3 py-2 rounded-lg bg-[#1c1917] border border-[#33302c]"
                  >
                    <span>{a.icon}</span> {a.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            className="flex items-center gap-5 text-[#948b80] text-sm pb-8 border-b border-[#33302c]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <span>★ {workspace.rating || "New"} ({workspace.numReviews || 0})</span>
            {workspace.owner?.name && <span>Listed by {workspace.owner.name}</span>}
          </div>

          <div className="mt-8">
            <ReviewSummary
              workspaceId={id}
              reviewCount={workspace.numReviews || 0}
            />
            <ReviewSection
              workspaceId={id}
              workspaceOwnerId={workspace.owner?._id || workspace.owner}
            />
          </div>
        </div>

        {/* Right: Booking + Enquire */}
        <div className="space-y-4 h-fit sticky top-24">
          <div className="bg-[#1c1917] border border-[#33302c] rounded-2xl p-6">
            <div className="flex items-baseline justify-between mb-5 pb-5 border-b border-[#33302c]">
              <span
                className="text-2xl text-[#c9a26d]"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                ₹{workspace.price}
              </span>
              <span className="text-[#948b80] text-sm">
                {leaseTermLabel[workspace.leaseTerm] || "/ day"}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {bookingSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-3 rounded-lg bg-[#4c7a73]/10 text-[#4c7a73] text-sm border border-[#4c7a73]/20"
                >
                  {bookingSuccess}
                </motion.div>
              )}

              {bookingError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20"
                >
                  {bookingError}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="flex gap-2 p-1 rounded-lg bg-[#12100f] border border-[#33302c]">
                <button
                  type="button"
                  onClick={() => handleModeSwitch("single")}
                  className={`flex-1 py-1.5 rounded-md text-sm transition ${
                    bookingMode === "single"
                      ? "bg-[#c9a26d] text-[#12100f] font-medium"
                      : "text-[#948b80]"
                  }`}
                >
                  Single day
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSwitch("multi")}
                  className={`flex-1 py-1.5 rounded-md text-sm transition ${
                    bookingMode === "multi"
                      ? "bg-[#c9a26d] text-[#12100f] font-medium"
                      : "text-[#948b80]"
                  }`}
                >
                  Multiple days
                </button>
              </div>

              <div className={bookingMode === "multi" ? "grid grid-cols-2 gap-3" : ""}>
                <div>
                  <label className="block text-sm text-[#948b80] mb-1">
                    {bookingMode === "multi" ? "Start date" : "Date"}
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleBookingChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
                  />
                </div>
                {bookingMode === "multi" && (
                  <div>
                    <label className="block text-sm text-[#948b80] mb-1">End date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={bookingData.endDate}
                      onChange={handleBookingChange}
                      min={bookingData.date}
                      required
                      className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#948b80] mb-1">Start time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={bookingData.startTime}
                    onChange={handleBookingChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#948b80] mb-1">End time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={bookingData.endTime}
                    onChange={handleBookingChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#948b80] mb-1">Seats</label>
                <input
                  type="number"
                  name="seatsBooked"
                  min="1"
                  max={seatsMax}
                  value={bookingData.seatsBooked}
                  onChange={handleBookingChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
                />
                {bookingMode === "single" && checkingAvailability && (
                  <p className="text-[#66605a] text-xs mt-1">Checking availability...</p>
                )}
                {bookingMode === "single" && !checkingAvailability && availableSeats !== null && (
                  <p
                    className={`text-xs mt-1 ${
                      availableSeats === 0 ? "text-red-400" : "text-[#4c7a73]"
                    }`}
                  >
                    {availableSeats === 0
                      ? "Fully booked for this time slot"
                      : `${availableSeats} seat(s) available for this slot`}
                  </p>
                )}
                {bookingMode === "multi" && (
                  <p className="text-[#66605a] text-xs mt-1">
                    Availability is checked for every day in the range on submit.
                  </p>
                )}
              </div>
              {bookingData.date && bookingData.startTime && bookingData.endTime && (
  <div className="p-3 rounded-lg bg-[#12100f] border border-[#33302c] text-sm space-y-1">
    <div className="flex justify-between text-[#948b80]">
      <span>Dates</span>
      <span className="text-[#ede9e3]">
        {new Date(bookingData.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        {bookingMode === "multi" && bookingData.endDate && (
          <> → {new Date(bookingData.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</>
        )}
      </span>
    </div>
    <div className="flex justify-between text-[#948b80]">
      <span>Time</span>
      <span className="text-[#ede9e3]">{bookingData.startTime} – {bookingData.endTime}</span>
    </div>
    {bookingMode === "multi" && bookingData.date && bookingData.endDate && (
      <div className="flex justify-between text-[#948b80]">
        <span>Total days</span>
        <span className="text-[#ede9e3]">
          {Math.round((new Date(bookingData.endDate) - new Date(bookingData.date)) / 86400000) + 1} days
        </span>
      </div>
    )}
    <div className="flex justify-between text-[#948b80] pt-1 border-t border-[#33302c] mt-1">
      <span>Estimated total</span>
      <span
        className="text-[#c9a26d] font-medium"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        ₹
        {workspace.price *
          Number(bookingData.seatsBooked || 1) *
          (bookingMode === "multi" && bookingData.date && bookingData.endDate
            ? Math.round((new Date(bookingData.endDate) - new Date(bookingData.date)) / 86400000) + 1
            : 1)}
      </span>
    </div>
  </div>
)}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={
                  bookingLoading || (bookingMode === "single" && availableSeats === 0)
                }
                className="w-full py-2.5 rounded-lg bg-[#c9a26d] text-[#12100f] font-medium hover:bg-[#d9b481] transition disabled:opacity-50"
              >
                {bookingLoading
                  ? "Booking..."
                  : user
                  ? "Book now"
                  : "Log in to book"}
              </motion.button>
            </form>
          </div>

          <button
            onClick={handleEnquire}
            className="w-full py-2.5 rounded-lg border border-[#4c7a73]/40 text-[#4c7a73] font-medium hover:bg-[#4c7a73]/10 transition"
          >
            💬 Enquire about this space
          </button>
        </div>
      </div>

      <SimilarWorkspaces
        currentId={id}
        city={workspace.city}
        type={workspace.type}
      />
    </div>
  );
};

export default WorkspaceDetails;