export default function FeedManager({ feeds, onRemove }) {
  return (
    <div>
      {feeds.length === 0 ? (
        <div className="empty">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
          </svg>
          <h3>No feeds added yet</h3>
          <p>Use the input above to add your first RSS feed</p>
        </div>
      ) : (
        <div className="feed-list">
          {feeds.map((f,i)=>(
            <div key={i} className="feed-item">
              <div>
                <div className="feed-item-name">{f.feedTitle||f.title||"Untitled Feed"}</div>
                <div className="feed-item-url">{f.url}</div>
                <div className="feed-item-count">{f.items?.length||0} articles loaded</div>
              </div>
              <button className="btn-danger" onClick={()=>onRemove(f.url)}>Remove</button>
            </div>
          ))}
        </div>
      )}
      <div className="how-it-works">
        <h4>How the data pipeline works</h4>
        <ol>
          <li>User enters an RSS URL and clicks Add Feed</li>
          <li>React sends the URL to Express backend at <code>/api/feed?url=…</code></li>
          <li>Express fetches raw XML and parses it with <code>fast-xml-parser</code> (handles RSS 2.0 + Atom)</li>
          <li>Parsed items are forwarded to the Python Flask microservice at <code>/analyze</code></li>
          <li>Python scores SEO quality and extracts keywords using pure stdlib</li>
          <li>Enriched articles return to React and render in real-time</li>
        </ol>
      </div>
    </div>
  );
}