import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#161311] border-t border-[#33302c] mt-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14 grid grid-cols-2 sm:grid-cols-4 gap-10">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#c9a26d]" />
            <span
              className="text-lg text-[#ede9e3]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Nexuss
            </span>
          </div>
          <p className="text-[#948b80] text-sm leading-relaxed">
            Coworking spaces, private offices, and meeting rooms — booked in minutes.
          </p>
        </div>

        <div>
          <h4 className="text-[#ede9e3] text-sm font-medium mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-[#948b80]">
            <li><Link to="/workspaces" className="hover:text-[#c9a26d] transition">All workspaces</Link></li>
            <li><Link to="/workspaces?type=meeting" className="hover:text-[#c9a26d] transition">Meeting rooms</Link></li>
            <li><Link to="/workspaces?type=office" className="hover:text-[#c9a26d] transition">Private offices</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#ede9e3] text-sm font-medium mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-[#948b80]">
            <li><Link to="/" className="hover:text-[#c9a26d] transition">About</Link></li>
            <li><Link to="/signup" className="hover:text-[#c9a26d] transition">List your space</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#ede9e3] text-sm font-medium mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-[#948b80]">
            <li><span className="hover:text-[#c9a26d] transition cursor-pointer">Help center</span></li>
            <li><span className="hover:text-[#c9a26d] transition cursor-pointer">Contact us</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#33302c]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#948b80]">
          <span>© {new Date().getFullYear()} Nexuss. All rights reserved.</span>
          <span
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            className="text-[#4c7a73]"
          >
            Built with the MERN stack
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;