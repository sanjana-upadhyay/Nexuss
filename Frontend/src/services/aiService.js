import api from "./api";

export const generateDescription = async ({ keywords, name, city }) => {
  const { data } = await api.post("/ai/generate-description", {
    keywords,
    name,
    city,
  });
  return data.description;
};

export const getReviewSummary = async (workspaceId) => {
  const { data } = await api.get(`/ai/review-summary/${workspaceId}`);
  return data.summary;
};

export const getAIRecommendations = async (query) => {
  const { data } = await api.post("/ai/recommend", { query });
  return data.recommendations || [];
};