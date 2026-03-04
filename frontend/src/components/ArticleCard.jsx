export default function ArticleCard({ article: a }) {
  const catClass  = a.category === "SEO" ? "cat-seo" : a.category === "Growth" ? "cat-growth" : "cat-general";
  const seoClass  = (a.seoScore||0) >= 90 ? "seo-high" : (a.seoScore||0) >= 75 ? "seo-mid" : "seo-low";

  return (
    <div className="article-card">
      {a.thumbnail && (
        <img className="article-thumb" src={a.thumbnail} alt=""
          onError={e => { e.target.style.display = "none"; }} />
      )}
      <div className="article-body">
        <div className="article-meta">
          <span className={`cat-badge ${catClass}`}>{a.category}</span>
          <span className="meta-dot">·</span>
          <span className="meta-text">{a.feedName}</span>
          {a.pubDate && (<><span className="meta-dot">·</span>
            <span className="meta-text">{new Date(a.pubDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span></>)}
          {a.readTime && (<><span className="meta-dot">·</span><span className="meta-text">{a.readTime} read</span></>)}
        </div>
        <a className="article-title" href={a.link} target="_blank" rel="noopener noreferrer">{a.title}</a>
        {a.description && <p className="article-desc">{a.description}</p>}
        {(a.keywords||[]).length > 0 && (
          <div className="kw-list">
            {(a.keywords||[]).slice(0,5).map(k => <span key={k} className="kw-tag">{k}</span>)}
          </div>
        )}
      </div>
      {a.seoScore !== undefined && (
        <div className="seo-score">
          <div className={`seo-num ${seoClass}`}>{a.seoScore}</div>
          <div className="seo-label">SEO</div>
        </div>
      )}
    </div>
  );
}