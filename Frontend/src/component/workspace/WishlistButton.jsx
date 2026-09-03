import { useState, useEffect } from "react";
import {
  addToWishlist,
  removeFromWishlist,
  getMyWishlist,
} from "../../services/wishlistService";
import { useAuth } from "../../context/useAuth";

const WishlistButton = ({ workspaceId }) => {
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkWishlist = async () => {
    try {
      const wishlist = await getMyWishlist();
      const exists = wishlist.some(
        (item) => item.workspace?._id === workspaceId
      );
      setIsWishlisted(exists);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
      checkWishlist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, workspaceId]);

  const handleToggle = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(workspaceId);
        setIsWishlisted(false);
      } else {
        await addToWishlist(workspaceId);
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 py-2 rounded-full border text-sm transition ${
        isWishlisted
          ? "bg-[#c9a26d]/10 border-[#c9a26d]/40 text-[#c9a26d]"
          : "bg-transparent border-[#33302c] text-[#948b80] hover:border-[#c9a26d]/40 hover:text-[#c9a26d]"
      }`}
    >
      {isWishlisted ? "♥ Saved" : "♡ Save"}
    </button>
  );
};

export default WishlistButton;