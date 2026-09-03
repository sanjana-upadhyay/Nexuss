const BookingCard = ({ booking, onCancel }) => {
  const statusStyles = {
    confirmed: "bg-[#4c7a73]/10 text-[#4c7a73] border-[#4c7a73]/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    pending: "bg-[#c9a26d]/10 text-[#c9a26d] border-[#c9a26d]/20",
    completed: "bg-[#33302c] text-[#948b80] border-[#33302c]",
  };

  const formattedDate = new Date(booking.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const bookingDateTime = new Date(booking.date);
  const [h, m] = booking.startTime.split(":").map(Number);
  bookingDateTime.setHours(h, m, 0, 0);
  const hoursLeft = (bookingDateTime - new Date()) / (1000 * 60 * 60);
  const isFreeCancellation = hoursLeft >= 24;

  return (
    <div className="bg-[#1c1917] border border-[#33302c] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h3
          className="text-lg text-[#ede9e3]"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {booking.workspace?.name || "Workspace"}
        </h3>
        <p className="text-[#948b80] text-sm">{booking.workspace?.city}</p>

        <div
          className="flex flex-wrap gap-3 mt-2 text-sm text-[#948b80]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          <span>{formattedDate}</span>
          {booking.numberOfDays > 1 && (
            <span className="text-[#c9a26d]">{booking.numberOfDays} days</span>
          )}
          <span>{booking.startTime}–{booking.endTime}</span>
          <span>{booking.seatsBooked} seat{booking.seatsBooked > 1 ? "s" : ""}</span>
        </div>

        <p
          className="text-[#c9a26d] mt-2"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          ₹{booking.totalPrice}
        </p>
      </div>

      <div className="flex flex-col items-start sm:items-end gap-2">
        <span
          className={`text-xs px-3 py-1 rounded-full capitalize border ${
            statusStyles[booking.status] || "bg-[#33302c] text-[#948b80] border-[#33302c]"
          }`}
        >
          {booking.status}
        </span>

        {booking.status === "confirmed" && (
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={() => onCancel(booking._id)}
              className="text-sm px-4 py-1.5 rounded-full border border-[#33302c] text-[#948b80] hover:border-red-500/40 hover:text-red-400 transition"
            >
              Cancel
            </button>
            {!isFreeCancellation && hoursLeft > 0 && (
              <span className="text-[10px] text-[#c9a26d]">Fee may apply (within 24hrs)</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;