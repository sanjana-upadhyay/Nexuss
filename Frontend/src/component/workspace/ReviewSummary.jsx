import { useState, useEffect } from "react";
import { getReviewSummary } from "../../services/aiService";

const ReviewSummary = ({ workspaceId, reviewCount }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(reviewCount > 0);

  useEffect(() => {
    if (reviewCount === 0) return;

    const fetchSummary = async () => {
      try {
        const data = await getReviewSummary(workspaceId);
        setSummary(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSummary();
   
  }, [workspaceId, reviewCount]);

  if (reviewCount === 0) return null;
  if (loading) return null;
  if (!summary) return null;

  return (
    <div className="bg-[#4c7a73]/5 border border-[#4c7a73]/20 rounded-2xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-1.5 text-xs text-[#4c7a73] uppercase tracking-widest">
        ✨ AI summary
      </div>
      <p className="text-[#ede9e3]/80 text-sm leading-relaxed">{summary}</p>
    </div>
  );
};

export default ReviewSummary;