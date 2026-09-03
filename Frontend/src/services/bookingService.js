import api from "./api";

export const createBooking = async (bookingData) => {
  const { data } = await api.post("/bookings", bookingData);
  return data;
};

export const checkAvailability = async (workspaceId, date, startTime, endTime) => {
  const params = new URLSearchParams({ date, startTime, endTime });
  const { data } = await api.get(`/bookings/availability/${workspaceId}?${params}`);
  return data;
};

export const getMyBookings = async () => {
  const { data } = await api.get("/bookings/my");
  return data;
};

export const cancelBooking = async (id) => {
  const { data } = await api.put(`/bookings/${id}/cancel`);
  return data;
};

export const getOwnerAnalytics = async () => {
  const { data } = await api.get("/bookings/analytics");
  return data;
};