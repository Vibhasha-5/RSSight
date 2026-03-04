import { useState } from "react";
import axios from "axios";
import FeedBar from "./components/FeedBar";
import ArticleCard from "./components/ArticleCard";
import Analytics from "./components/Analytics";
import FeedManager from "./components/FeedManager";

const Icons = {
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  Feed: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/>
      <circle cx="5" cy="19" r="1" fill="currentColor"/>
    </svg>
  ),
  BarChart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
    </svg>
  ),
};

function classifyCategory(title, desc) {
  const text = `${title} ${desc}`.toLowerCase();
  const seoHits    = ["seo","serp","keyword","backlink","search engine","organic","crawl","index","ranking","meta"].filter(t => text.includes(t)).length;
  const growthHits = ["growth","viral","retention","funnel","cac","ltv","referral","plg","saas","conversion","acquisition","activation"].filter(t => text.includes(t)).length;
  if (seoHits > growthHits) return "SEO";
  if (growthHits > 0) return "Growth";
  return "General";
}

export default function App() {
  const [feeds, setFeeds]         = useState([]);
  const [articles, setArticles]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [activeTab, setActiveTab] = useState("reader");
  const [filterCat, setFilterCat] = useState("All");
  const [searchQ, setSearchQ]     = useState("");
  const [dark, setDark]           = useState(false);
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addFeed = async (url) => {
    if (feeds.find(f => f.url === url)) { setError("This feed is already added."); return; }
    setLoading(true); setError(null);
    try {
      const res = await axios.get(`/api/feed?url=${encodeURIComponent(url)}`);
      const { data } = res.data;
      setFeeds(prev => [...prev, { url, ...data }]);
      const newItems = data.items.map(item => ({
        ...item, feedName: data.feedTitle, feedUrl: url,
        category: classifyCategory(item.title, item.description),
      }));
      setArticles(prev => [...prev, ...newItems.filter(ni => !prev.find(p => p.link === ni.link))]);
      showToast(`Feed added: ${data.feedTitle}`);
    } catch (err) {
      setError(err.response?.data?.error || "Could not fetch feed. Check the URL.");
    } finally { setLoading(false); }
  };

  const removeFeed = (url) => {
    setFeeds(prev => prev.filter(f => f.url !== url));
    setArticles(prev => prev.filter(a => a.feedUrl !== url));
    showToast("Feed removed");
  };

  const filtered = articles.filter(a => {
    const matchCat = filterCat === "All" || a.category === filterCat;
    const matchQ   = !searchQ
      || a.title.toLowerCase().includes(searchQ.toLowerCase())
      || (a.keywords || []).some(k => k.toLowerCase().includes(searchQ.toLowerCase()));
    return matchCat && matchQ;
  });

  const tabs = [
    { id: "reader",    label: "Feed Reader",  Icon: Icons.Feed },
    { id: "analytics", label: "Analytics",    Icon: Icons.BarChart },
    { id: "feeds",     label: "Manage Feeds", Icon: Icons.Settings },
  ];

  return (
    <div className="app-wrap" data-dark={dark ? "" : undefined}>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-mark">R</div>
            <span className="logo-text">RSSight</span>
            <span className="logo-badge">SEO + Growth</span>
          </div>
          <div className="header-right">
            <span className="header-meta">{articles.length} articles · {feeds.length} feeds</span>
            <button className="theme-btn" onClick={() => setDark(!dark)}>
              {dark ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>
        </div>
      </header>

      <div className="main">
        <FeedBar onAdd={addFeed} loading={loading} error={error} feeds={feeds} />

        <div className="tabs">
          {tabs.map(({ id, label, Icon }) => (
            <button key={id} className={`tab-btn ${activeTab === id ? "active" : ""}`} onClick={() => setActiveTab(id)}>
              <Icon /> {label}
            </button>
          ))}
        </div>

        {activeTab === "reader" && (
          <>
            <div className="filter-bar">
              <div className="search-wrap">
                <span className="search-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
                <input className="search-input" placeholder="Search articles or keywords…"
                  value={searchQ} onChange={e => setSearchQ(e.target.value)} />
              </div>
              {["All", "SEO", "Growth", "General"].map(cat => (
                <button key={cat} className={`filter-chip ${filterCat === cat ? "active" : ""}`}
                  onClick={() => setFilterCat(cat)}>{cat}</button>
              ))}
              <span className="results-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            </div>
            {articles.length === 0 ? (
              <div className="empty">
                <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/>
                  <circle cx="5" cy="19" r="1" fill="currentColor"/>
                </svg>
                <h3>No feeds yet</h3>
                <p>Add an RSS feed URL above to get started</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty"><h3>No results</h3><p>Try adjusting your search or filter</p></div>
            ) : (
              <div className="articles">
                {filtered.map((a, i) => <ArticleCard key={i} article={a} />)}
              </div>
            )}
          </>
        )}
        {activeTab === "analytics" && <Analytics articles={articles} />}
        {activeTab === "feeds"     && <FeedManager feeds={feeds} onRemove={removeFeed} />}
      </div>
    </div>
  );
}