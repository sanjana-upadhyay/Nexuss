import api from "./api";

export const createReview = async (reviewData) => {
  const { data } = await api.post("/reviews", reviewData);
  return data;
};

export const getWorkspaceReviews = async (workspaceId) => {
  const { data } = await api.get(`/reviews/workspace/${workspaceId}`);
  return data;
};

export const replyToReview = async (reviewId, text) => {
  const { data } = await api.put(`/reviews/${reviewId}/reply`, { text });
  return data;
};

export const deleteReview = async (id) => {
  const { data } = await api.delete(`/reviews/${id}`);
  return data;
};