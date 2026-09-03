import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FAQ from "../component/common/FAQ";
import { motion } from "framer-motion";
import { useAuth } from "../context/useAuth";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const popularCities = ["Indore", "Bangalore", "Delhi", "Mumbai", "Pune", "Hyderabad"];

const categories = [
  {
    name: "Hot Desks",
    desc: "Flexible seating, pay by the day",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    type: "hotdesk",
  },
  {
    name: "Dedicated Desks",
    desc: "Your own fixed desk, every day",
    img: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&q=80",
    type: "dedicated",
  },
  {
    name: "Private Cabins",
    desc: "Enclosed space for you or your team",
    img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
    type: "cabin",
  },
  {
    name: "Meeting Rooms",
    desc: "Book by the hour for your next call",
    img: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80",
    type: "meeting",
  },
  {
    name: "Managed Offices",
    desc: "Fully managed space for larger teams",
    img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
    type: "managed",
  },
];

const testimonials = [
  {
    quote:
      "Booked a meeting room in Indore in under two minutes — no calls, no back and forth. Exactly what a freelancer needs.",
    name: "Ritika Sharma",
    role: "Freelance Designer",
  },
  {
    quote:
      "We moved our 6-person team into a private cabin we found here. The AI search actually understood what we meant.",
    name: "Arjun Mehta",
    role: "Founder, Loopwork",
  },
  {
    quote:
      "As an owner, listing my space took ten minutes and I had my first booking the same week.",
    name: "Priya Nair",
    role: "Workspace Owner",
  },
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState("");

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.set("city", searchCity);
    navigate(`/workspaces${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="bg-[#12100f]">
      {/* Hero with image + search bar overlay */}
      <section className="relative">
        <div className="relative h-[520px] sm:h-[560px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&q=80"
            alt="Modern coworking space"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12100f] via-[#12100f]/70 to-[#12100f]/30" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="max-w-2xl w-full"
            >
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center gap-2 mb-5 text-xs text-[#c9a26d] uppercase tracking-widest"
              >
                <span className="w-6 h-px bg-[#c9a26d]" />
                500+ verified spaces · 15+ cities
                <span className="w-6 h-px bg-[#c9a26d]" />
              </motion.div>

              <motion.h1
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl font-semibold text-[#ede9e3] leading-tight mb-8"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {user
                  ? `Welcome back, ${user.name}`
                  : "Book verified workspaces near you"}
              </motion.h1>

              {/* Search bar */}
              <motion.form
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                onSubmit={handleHeroSearch}
                className="bg-[#1c1917]/95 backdrop-blur border border-[#33302c] rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl"
              >
                <div className="flex-1 flex items-center gap-2 px-4 py-3">
                  <span className="text-[#c9a26d]">📍</span>
                  <input
                    type="text"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    placeholder="Search by city — e.g. Indore"
                    className="w-full bg-transparent text-[#ede9e3] placeholder:text-[#948b80] focus:outline-none text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-[#c9a26d] text-[#12100f] font-medium hover:bg-[#d9b481] transition whitespace-nowrap"
                >
                  Search
                </button>
              </motion.form>

              {/* Popular city chips */}
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-2 mt-5"
              >
                <span className="text-xs text-[#948b80] mr-1">Popular:</span>
                {popularCities.map((c) => (
                  <Link
                    key={c}
                    to={`/workspaces?city=${c}`}
                    className="px-3 py-1.5 rounded-full text-xs text-[#ede9e3]/80 border border-[#33302c] hover:border-[#c9a26d]/50 hover:text-[#c9a26d] transition bg-[#1c1917]/60"
                  >
                    {c}
                  </Link>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="border-b border-[#33302c] bg-[#161311]"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 grid grid-cols-3 gap-4">
          {[
            { n: "500+", l: "Workspaces" },
            { n: "15+", l: "Cities" },
            { n: "10k+", l: "Bookings made" },
          ].map((s) => (
            <div key={s.l} className="text-center sm:text-left">
              <div
                className="text-2xl sm:text-3xl text-[#c9a26d]"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {s.n}
              </div>
              <div className="text-xs text-[#948b80] uppercase tracking-wider mt-1">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Categories */}
      <section className="px-6 sm:px-8 py-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4 text-xs text-[#948b80] uppercase tracking-widest">
            <span className="w-6 h-px bg-[#4c7a73]" />
            What are you looking for
          </div>
          <h2
            className="text-3xl sm:text-4xl text-[#ede9e3]"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Every kind of space
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((cat) => (
            <motion.div key={cat.name} variants={fadeUp} transition={{ duration: 0.5 }}>
              <Link
                to={`/workspaces?type=${cat.type}`}
                className="group block rounded-2xl overflow-hidden border border-[#33302c] hover:border-[#c9a26d]/40 transition-colors"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3
                    className="text-lg text-[#ede9e3] group-hover:text-[#c9a26d] transition-colors"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-sm text-[#948b80] mt-1">{cat.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* AI callout */}
      <section className="px-6 sm:px-8 pb-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-[#4c7a73]/25 bg-[#4c7a73]/[0.06] p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <div className="text-xs text-[#4c7a73] uppercase tracking-widest mb-3">
              ✨ AI-powered
            </div>
            <h3
              className="text-2xl text-[#ede9e3] mb-2"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Just describe what you need
            </h3>
            <p className="text-[#948b80] text-sm max-w-md">
              "Quiet workspace in Indore under ₹500" — our AI reads it like a person would and finds the closest match.
            </p>
          </div>
          <Link
            to="/workspaces"
            className="px-6 py-3 rounded-full bg-[#4c7a73] text-[#ede9e3] font-medium hover:bg-[#5a8f87] transition whitespace-nowrap"
          >
            Try AI Search
          </Link>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="px-6 sm:px-8 pb-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4 text-xs text-[#948b80] uppercase tracking-widest">
            <span className="w-6 h-px bg-[#c9a26d]" />
            Trusted by teams and freelancers
          </div>
          <h2
            className="text-3xl sm:text-4xl text-[#ede9e3]"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            What people say
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl border border-[#33302c] bg-[#1c1917]"
            >
              <p className="text-[#ede9e3]/80 text-sm leading-relaxed mb-4">
                "{t.quote}"
              </p>
              <div>
                <div className="text-[#ede9e3] text-sm font-medium">{t.name}</div>
                <div className="text-[#948b80] text-xs">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <FAQ />

     
      {/* Final CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="px-6 sm:px-8 pb-24 max-w-6xl mx-auto text-center"
      >
        <h2
          className="text-3xl sm:text-4xl text-[#ede9e3] mb-4"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Ready to find your desk?
        </h2>
        <p className="text-[#948b80] mb-8">
          Join thousands finding their next workspace on WorkSphere AI.
        </p>
        <Link
          to="/workspaces"
          className="inline-block px-8 py-3.5 rounded-full bg-[#c9a26d] text-[#12100f] font-medium hover:scale-[1.03] active:scale-[0.98] transition-transform"
        >
          Browse Workspaces →
        </Link>
      </motion.section>
    </div>
  );
};

export default Home;