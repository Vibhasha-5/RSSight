const { XMLParser } = require("fast-xml-parser");
const fetch = require("node-fetch");

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

async function fetchAndParseFeed(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "RSSight/1.0 RSS Reader Bot" },
    timeout: 8000,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching feed`);
  const xml = await res.text();
  const result = parser.parse(xml);

  // Handle both RSS 2.0 and Atom formats
  if (result.rss?.channel) {
    const ch = result.rss.channel;
    const items = Array.isArray(ch.item) ? ch.item : ch.item ? [ch.item] : [];
    return {
      feedTitle: ch.title || url,
      feedDescription: ch.description || "",
      feedLink: ch.link || url,
      items: items.map((item) => ({
        title: item.title || "Untitled",
        description: stripHtml(item.description || item["content:encoded"] || ""),
        link: item.link || item.guid?.["#text"] || item.guid || "",
        pubDate: item.pubDate || item.published || "",
        category: Array.isArray(item.category)
          ? item.category.join(", ")
          : item.category || "",
        author: item.author || item["dc:creator"] || "",
        thumbnail:
          item["media:thumbnail"]?.["@_url"] ||
          item["media:content"]?.["@_url"] ||
          null,
      })),
    };
  }

  if (result.feed) {
    const feed = result.feed;
    const entries = Array.isArray(feed.entry)
      ? feed.entry
      : feed.entry
      ? [feed.entry]
      : [];
    return {
      feedTitle: feed.title?.["#text"] || feed.title || url,
      feedDescription: feed.subtitle?.["#text"] || "",
      feedLink: Array.isArray(feed.link)
        ? feed.link.find((l) => l["@_rel"] === "alternate")?.["@_href"] || url
        : feed.link?.["@_href"] || url,
      items: entries.map((e) => ({
        title: e.title?.["#text"] || e.title || "Untitled",
        description: stripHtml(e.summary?.["#text"] || e.summary || e.content?.["#text"] || ""),
        link: Array.isArray(e.link)
          ? e.link.find((l) => l["@_rel"] === "alternate")?.["@_href"] || ""
          : e.link?.["@_href"] || "",
        pubDate: e.published || e.updated || "",
        category: "",
        author: e.author?.name || "",
        thumbnail: null,
      })),
    };
  }

  throw new Error("Unknown feed format");
}

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
}

module.exports = { fetchAndParseFeed };