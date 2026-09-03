const getModel = require("../config/gemini");
const Workspace = require("../models/Workspace");
const Review = require("../models/Review");

// Helper: retry logic for Gemini API calls (handles temporary 503 errors)
const generateWithRetry = async (model, prompt, retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      const isOverloaded = error.status === 503 || error.message?.includes("overloaded") || error.message?.includes("high demand");
      if (isOverloaded && attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
        continue;
      }
      throw error;
    }
  }
};

// @desc  Generate professional workspace description from keywords
// @route POST /api/ai/generate-description
// @access Private (Owner)
const generateDescription = async (req, res) => {
  try {
    const { keywords, name, city } = req.body;

    if (!keywords) {
      return res.status(400).json({ message: "Keywords are required" });
    }

    const model = getModel();
    const prompt = `Write a short, professional, appealing description (max 60 words) for a coworking workspace listing.
Workspace name: ${name || "Unnamed workspace"}
City: ${city || "Not specified"}
Keywords/features provided by owner: ${keywords}

Return ONLY the description text, no extra commentary, no quotes.`;

    const description = await generateWithRetry(model, prompt);

    res.json({ description });
  } catch (error) {
    console.error("❌ AI DESCRIPTION ERROR:", error);
    const isOverloaded = error.status === 503;
    res.status(isOverloaded ? 503 : 500).json({
      message: isOverloaded
        ? "AI service is busy right now, please try again in a moment."
        : "Failed to generate description",
    });
  }
};

// @desc  Summarize all reviews of a workspace
// @route GET /api/ai/review-summary/:workspaceId
// @access Public
const summarizeReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ workspace: req.params.workspaceId });

    if (reviews.length === 0) {
      return res.json({ summary: "No reviews yet for this workspace." });
    }

    const reviewTexts = reviews.map((r) => `Rating ${r.rating}/5: ${r.comment}`).join("\n");

    const model = getModel();
    const prompt = `Summarize these coworking workspace reviews into one short paragraph (max 40 words), highlighting common themes (positive and negative). Be neutral and factual.

Reviews:
${reviewTexts}

Return ONLY the summary text, no extra commentary.`;

    const summary = await generateWithRetry(model, prompt);

    res.json({ summary });
  } catch (error) {
    console.error("❌ AI SUMMARY ERROR:", error);
    const isOverloaded = error.status === 503;
    res.status(isOverloaded ? 503 : 500).json({
      message: isOverloaded
        ? "AI service is busy right now, please try again in a moment."
        : "Failed to summarize reviews",
    });
  }
};

// @desc  AI-powered workspace recommendation from natural language query
// @route POST /api/ai/recommend
// @access Public
const recommendWorkspaces = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const workspaces = await Workspace.find().limit(30);

    if (workspaces.length === 0) {
      return res.json({ message: "No workspaces available yet.", recommendations: [] });
    }

    const workspaceList = workspaces
      .map(
        (w) =>
          `ID: ${w._id} | Name: ${w.name} | City: ${w.city} | Price: ₹${w.price} | Amenities: ${Object.keys(w.amenities || {}).filter((k) => w.amenities[k]).join(", ")}`
      )
      .join("\n");

    const model = getModel();
    const prompt = `A user is searching for a coworking workspace with this request: "${query}"

Here is the list of available workspaces:
${workspaceList}

Pick the best matching workspace IDs (max 5) based on the user's request. Return ONLY a valid JSON array of workspace ID strings, nothing else. Example: ["id1", "id2"]. If nothing matches well, return an empty array [].`;

    let text = await generateWithRetry(model, prompt);
    text = text.replace(/```json|```/g, "").trim();

    let ids = [];
    try {
      ids = JSON.parse(text);
    } catch {
      ids = [];
    }

    const recommendations = workspaces.filter((w) => ids.includes(w._id.toString()));

    res.json({ recommendations });
  } catch (error) {
    console.error("❌ AI RECOMMEND ERROR:", error);
    const isOverloaded = error.status === 503;
    res.status(isOverloaded ? 503 : 500).json({
      message: isOverloaded
        ? "AI service is busy right now, please try again in a moment."
        : "Failed to get recommendations",
    });
  }
};

module.exports = { generateDescription, summarizeReviews, recommendWorkspaces };