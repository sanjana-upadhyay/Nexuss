import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getWorkspaceReviews, createReview, replyToReview } from "../../services/reviewService";
import { useAuth } from "../../context/useAuth";

const ReviewSection = ({ workspaceId, workspaceOwnerId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  const canReply =
    user && (user.role === "admin" || user._id === workspaceOwnerId);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getWorkspaceReviews(workspaceId);
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await createReview({ workspaceId, ...formData });
      setFormData({ rating: 5, comment: "" });
      toast.success("Review submitted");
      fetchReviews();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to submit review";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (reviewId) => {
    if (!replyText.trim()) return;
    setReplySubmitting(true);
    try {
      await replyToReview(reviewId, replyText);
      toast.success("Reply posted");
      setReplyingTo(null);
      setReplyText("");
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post reply");
    } finally {
      setReplySubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6 text-xs text-[#948b80] uppercase tracking-widest">
        <span className="w-6 h-px bg-[#4c7a73]" />
        {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
      </div>

      {user && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#1c1917] border border-[#33302c] rounded-2xl p-5 mb-6"
        >
          {error && (
            <div className="mb-3 p-2 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            <label className="text-[#948b80] text-sm">Rating</label>
            <select
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: Number(e.target.value) })
              }
              className="px-3 py-1.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] text-sm focus:outline-none focus:border-[#c9a26d]"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} ★
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            required
            rows={3}
            placeholder="Share your experience..."
            className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] text-sm focus:outline-none focus:border-[#c9a26d] mb-3 transition"
          />

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-full bg-[#c9a26d] text-[#12100f] text-sm font-medium hover:bg-[#d9b481] transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit review"}
          </button>
        </form>
      )}

      {loading && <p className="text-[#948b80] text-sm">Loading reviews...</p>}

      {!loading && reviews.length === 0 && (
        <p className="text-[#948b80] text-sm">No reviews yet — be the first.</p>
      )}

      <div className="space-y-3">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-[#1c1917] border border-[#33302c] rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#ede9e3] font-medium text-sm">
                {review.user?.name || "Anonymous"}
              </span>
              <span
                className="text-[#c9a26d] text-sm"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {"★".repeat(review.rating)}
                <span className="text-[#33302c]">
                  {"★".repeat(5 - review.rating)}
                </span>
              </span>
            </div>
            <p className="text-[#948b80] text-sm">{review.comment}</p>

            {/* Owner reply, if exists */}
            {review.ownerReply?.text && (
              <div className="mt-3 ml-4 pl-4 border-l-2 border-[#c9a26d]/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#c9a26d] font-medium">
                    Response from owner
                  </span>
                </div>
                <p className="text-[#ede9e3]/70 text-sm">{review.ownerReply.text}</p>
              </div>
            )}

            {/* Reply button/form for owner */}
            {canReply && !review.ownerReply?.text && (
              <div className="mt-3">
                {replyingTo === review._id ? (
                  <div className="ml-4 pl-4 border-l-2 border-[#33302c]">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                      placeholder="Write a reply..."
                      className="w-full px-3 py-2 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] text-sm focus:outline-none focus:border-[#c9a26d] transition mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReplySubmit(review._id)}
                        disabled={replySubmitting}
                        className="px-4 py-1.5 rounded-full bg-[#c9a26d] text-[#12100f] text-xs font-medium hover:bg-[#d9b481] transition disabled:opacity-50"
                      >
                        {replySubmitting ? "Posting..." : "Post reply"}
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
                        className="px-4 py-1.5 rounded-full border border-[#33302c] text-[#948b80] text-xs hover:text-[#ede9e3] transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyingTo(review._id)}
                    className="text-xs text-[#4c7a73] hover:underline"
                  >
                    Reply as owner
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;