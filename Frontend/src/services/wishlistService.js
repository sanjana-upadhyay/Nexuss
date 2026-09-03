import api from "./api";

export const addToWishlist = async (workspaceId) => {
  const { data } = await api.post("/wishlist", { workspaceId });
  return data;
};

export const getMyWishlist = async () => {
  const { data } = await api.get("/wishlist");
  return data;
};

export const removeFromWishlist = async (workspaceId) => {
  const { data } = await api.delete(`/wishlist/${workspaceId}`);
  return data;
};