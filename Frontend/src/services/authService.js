import api from "./api";

export const updateProfile = async (profileData) => {
  const { data } = await api.put("/auth/profile", profileData);
  return data;
};

export const getMyStats = async () => {
  const [bookingsRes, wishlistRes] = await Promise.all([
    api.get("/bookings/my"),
    api.get("/wishlist"),
  ]);
  return {
    bookingsCount: bookingsRes.data.length,
    wishlistCount: wishlistRes.data.length,
  };
};