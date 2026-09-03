import { Link } from "react-router-dom";

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-[#66605a] mb-6 flex-wrap">
      <Link to="/" className="hover:text-[#c9a26d] transition">
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="text-[#33302c]">/</span>
          {item.to ? (
            <Link to={item.to} className="hover:text-[#c9a26d] transition">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#948b80]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;