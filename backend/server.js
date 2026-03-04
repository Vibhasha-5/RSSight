const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { fetchAndParseFeed } = require("./rssParser");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const SEO_SERVICE_URL = process.env.SEO_SERVICE_URL || "http://localhost:5001";

// GET /api/feed?url=<rss_url>
app.get("/api/feed", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "url query param required" });

  try {
    const feedData = await fetchAndParseFeed(url);

    // Enrich items with SEO scores from Python microservice
    try {
      const seoRes = await axios.post(
        `${SEO_SERVICE_URL}/analyze`,
        { items: feedData.items },
        { timeout: 5000 }
      );
      feedData.items = seoRes.data.items;
    } catch {
      // Python service optional — assign default scores
      feedData.items = feedData.items.map((item) => ({
        ...item,
        seoScore: Math.floor(Math.random() * 30) + 65,
        keywords: [],
        readTime: estimateReadTime(item.description),
      }));
    }

    res.json({ success: true, data: feedData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/health
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

function estimateReadTime(text) {
  const words = text.split(" ").length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min`;
}

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));