import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getTypeInfo } from "../../utils/workspaceTypes";

const WorkspaceCard = ({ workspace }) => {
  const typeInfo = getTypeInfo(workspace.type);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link
        to={`/workspaces/${workspace._id}`}
        className="block bg-[#1c1917] border border-[#33302c] rounded-2xl overflow-hidden hover:border-[#c9a26d]/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all group"
      >
        <div className="h-44 bg-[#262220] flex items-center justify-center relative overflow-hidden">
          {workspace.images && workspace.images.length > 0 ? (
            <img
              src={workspace.images[0]}
              alt={workspace.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            />
          ) : (
            <span className="text-[#948b80] text-sm">No image</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#12100f]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#4c7a73]/90 backdrop-blur text-[10px] text-white font-medium uppercase tracking-wide w-fit">
              ✓ Verified
            </span>
            <span className="px-2 py-1 rounded-full bg-[#12100f]/80 backdrop-blur text-[10px] text-[#c9a26d] font-medium w-fit">
              {typeInfo.icon} {typeInfo.label}
            </span>
          </div>

          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-[#12100f]/80 backdrop-blur text-xs text-[#c9a26d] font-medium" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            ⭐ {workspace.rating || "New"}
            {workspace.numReviews > 0 && (
              <span className="text-[#948b80]"> ({workspace.numReviews})</span>
            )}
          </div>
        </div>

        <div className="p-4">
          <h3
            className="text-lg text-[#ede9e3] group-hover:text-[#c9a26d] transition-colors line-clamp-1"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {workspace.name}
          </h3>
          <p className="text-[#948b80] text-sm mt-0.5 flex items-center gap-1">
            📍 {workspace.city}
          </p>

          <div className="flex items-end justify-between mt-3">
            <div>
              <span className="text-[#66605a] text-[11px] block">Starting from</span>
              <span
                className="text-[#c9a26d] font-medium text-lg"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                ₹{workspace.price}
                <span className="text-[#948b80] text-xs font-normal"> /day</span>
              </span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#c9a26d]/10 text-[#c9a26d]">
              {workspace.seatsAvailable} seats left
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#33302c]">
            {workspace.amenities?.wifi && (
              <span className="text-xs px-2 py-1 rounded-full bg-[#4c7a73]/10 text-[#4c7a73]">
                Wifi
              </span>
            )}
            {workspace.amenities?.parking && (
              <span className="text-xs px-2 py-1 rounded-full bg-[#4c7a73]/10 text-[#4c7a73]">
                Parking
              </span>
            )}
            {workspace.amenities?.ac && (
              <span className="text-xs px-2 py-1 rounded-full bg-[#4c7a73]/10 text-[#4c7a73]">
                AC
              </span>
            )}
            {workspace.amenities?.meetingRoom && (
              <span className="text-xs px-2 py-1 rounded-full bg-[#4c7a73]/10 text-[#4c7a73]">
                Meeting Room
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default WorkspaceCard;