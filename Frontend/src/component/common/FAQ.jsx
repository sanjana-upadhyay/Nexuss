import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "How does booking work?",
    a: "Pick a workspace, choose your date, time, and number of seats, and confirm — your booking is instant, no approval needed from the owner.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes, go to My Bookings and click Cancel on any confirmed booking. Cancellation policies may vary by workspace.",
  },
  {
    q: "How do I list my own workspace?",
    a: "Sign up as an Owner, go to your Dashboard, and click '+ Add workspace'. You can add photos, pricing, and amenities — even generate a description with AI.",
  },
  {
    q: "Is payment required to book?",
    a: "Right now bookings are confirmed instantly without upfront payment. Payment integration is coming soon.",
  },
  {
    q: "What cities is WorkSphere AI available in?",
    a: "We currently list verified workspaces across major Indian cities including Indore, Bangalore, Delhi, Mumbai, Pune, and Hyderabad — with more being added.",
  },
];

const FAQItem = ({ item, isOpen, onClick }) => (
  <div className="border-b border-[#33302c]">
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-4 text-left"
    >
      <span className="text-[#ede9e3] text-sm sm:text-base pr-4">{item.q}</span>
      <motion.span
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
        className="text-[#c9a26d] text-xl shrink-0"
      >
        +
      </motion.span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <p className="text-[#948b80] text-sm pb-4 leading-relaxed">{item.a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="px-6 sm:px-8 pb-24 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4 text-xs text-[#948b80] uppercase tracking-widest">
        <span className="w-6 h-px bg-[#4c7a73]" />
        FAQ
      </div>
      <h2
        className="text-3xl sm:text-4xl text-[#ede9e3] mb-8"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        Common questions
      </h2>

      <div>
        {faqs.map((item, i) => (
          <FAQItem
            key={i}
            item={item}
            isOpen={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  );
};

export default FAQ;