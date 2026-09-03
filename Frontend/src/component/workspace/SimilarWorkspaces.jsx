import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getWorkspaces } from "../../services/workspaceService";
import WorkspaceCard from "./WorkspaceCard";

const SimilarWorkspaces = ({ currentId, city, type }) => {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      setLoading(true);
      try {
        const data = await getWorkspaces({ city, type });
        setSimilar(data.filter((w) => w._id !== currentId).slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSimilar();
  }, [currentId, city, type]);

  if (loading || similar.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 pb-16">
      <div className="flex items-center gap-2 mb-6 text-xs text-[#948b80] uppercase tracking-widest">
        <span className="w-6 h-px bg-[#c9a26d]" />
        You may also like
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {similar.map((ws, i) => (
          <motion.div
            key={ws._id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <WorkspaceCard workspace={ws} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SimilarWorkspaces;