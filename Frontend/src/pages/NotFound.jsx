import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#12100f] px-4 text-center">
      <span
        className="text-7xl sm:text-8xl text-[#c9a26d] mb-2"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        404
      </span>
      <h1 className="text-2xl text-[#ede9e3] mb-3" style={{ fontFamily: "'Fraunces', serif" }}>
        Page not found
      </h1>
      <p className="text-[#948b80] text-sm mb-8 max-w-sm">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-lg bg-[#c9a26d] text-[#12100f] font-medium hover:bg-[#d9b481] transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;