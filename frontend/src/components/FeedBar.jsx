import { useState } from "react";

const QUICK_FEEDS = [
  { name: "TechCrunch",         url: "https://techcrunch.com/feed/" },
  { name: "Moz Blog",           url: "https://moz.com/blog/feed" },
  { name: "HubSpot Marketing",  url: "https://blog.hubspot.com/marketing/rss.xml" },
  { name: "Neil Patel",         url: "https://neilpatel.com/blog/feed/" },
  { name: "Search Engine Land", url: "https://searchengineland.com/feed" },
  { name: "Backlinko",          url: "https://backlinko.com/feed" },
];

export default function FeedBar({ onAdd, loading, error, feeds }) {
  const [url, setUrl] = useState("");
  const handle = () => { const t = url.trim(); if (t) { onAdd(t); setUrl(""); } };

  return (
    <div className="feed-bar">
      <p className="feed-bar-label">Add RSS Feed URL</p>
      <div className="feed-bar-row">
        <input className="url-input" value={url} onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handle()} placeholder="https://example.com/feed/" />
        <button className="btn-primary" onClick={handle} disabled={loading}>
          {loading
            ? <span className="loading-dots"><span className="loading-dot"/><span className="loading-dot"/><span className="loading-dot"/></span>
            : "+ Add Feed"}
        </button>
      </div>
      {error && <p className="error-msg">{error}</p>}
      <div className="quick-add">
        <span className="quick-add-label">Quick add:</span>
        {QUICK_FEEDS.map(f => (
          <button key={f.url} className={`chip ${feeds?.find(fd => fd.url === f.url) ? "active" : ""}`}
            onClick={() => setUrl(f.url)}>
            {f.name}{feeds?.find(fd => fd.url === f.url) ? " ✓" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}