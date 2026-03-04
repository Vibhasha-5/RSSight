export default function Analytics({ articles }) {
  const seoCount    = articles.filter(a => a.category === "SEO").length;
  const growthCount = articles.filter(a => a.category === "Growth").length;
  const genCount    = articles.length - seoCount - growthCount;
  const avgSeo      = articles.length ? Math.round(articles.reduce((s,a) => s+(a.seoScore||0),0)/articles.length) : 0;
  const topKw       = articles.flatMap(a=>a.keywords||[]).reduce((acc,k)=>{acc[k]=(acc[k]||0)+1;return acc;},{});
  const topKwList   = Object.entries(topKw).sort((a,b)=>b[1]-a[1]).slice(0,10);
  const seoBar  = s => s>=90?"bar-green":s>=75?"bar-yellow":"bar-red";
  const seoText = s => s>=90?"seo-high":s>=75?"seo-mid":"seo-low";

  if (!articles.length) return (
    <div className="empty">
      <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
      <h3>No data yet</h3><p>Add feeds to see analytics</p>
    </div>
  );

  return (
    <div>
      <div className="stat-grid">
        {[
          { label:"Total Articles", val:articles.length, cls:"stat-icon-blue",
            icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
          { label:"Avg SEO Score",  val:avgSeo,          cls:"stat-icon-green",
            icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> },
          { label:"Growth Articles",val:growthCount,     cls:"stat-icon-purple",
            icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
          { label:"SEO Articles",   val:seoCount,        cls:"stat-icon-yellow",
            icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
          Content Category Breakdown
        </div>
        {[{label:"SEO",count:seoCount,cls:"bar-blue"},{label:"Growth",count:growthCount,cls:"bar-green"},{label:"General",count:genCount,cls:"bar-gray"}].map(c=>(
          <div key={c.label} className="bar-row">
            <div className="bar-info"><span>{c.label}</span><span>{c.count} ({articles.length?Math.round(c.count/articles.length*100):0}%)</span></div>
            <div className="bar-track"><div className={`bar-fill ${c.cls}`} style={{width:articles.length?`${c.count/articles.length*100}%`:"0%"}}/></div>
          </div>
        ))}
      </div>

      {topKwList.length > 0 && (
        <div className="panel">
          <div className="panel-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            Trending Keywords
          </div>
          <div className="kw-cloud">
            {topKwList.map(([kw,cnt])=>(
              <span key={kw} className="kw-cloud-tag">{kw}<span className="kw-cloud-count">{cnt}</span></span>
            ))}
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          SEO Score Per Article
        </div>
        <div className="seo-rows">
          {articles.slice(0,15).map((a,i)=>(
            <div key={i} className="seo-row">
              <span className="seo-row-title">{a.title}</span>
              <div className="seo-row-bar-track"><div className={`seo-row-bar-fill ${seoBar(a.seoScore||0)}`} style={{width:`${a.seoScore||0}%`}}/></div>
              <span className={`seo-row-num ${seoText(a.seoScore||0)}`}>{a.seoScore||"–"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          Growth Hacker Insights
        </div>
        <div className="insights-grid">
          {[
            {title:"Viral Coefficient",  desc:"Track K-factor: how many new users each article brings via shares",    tip:"Aim for K-factor > 1.0"},
            {title:"Topical Authority",  desc:"Consistent publishing in a niche builds domain authority over time",   tip:"Target topic clusters, not single keywords"},
            {title:"Content Velocity",   desc:"Publishing frequency directly impacts crawl rate and indexation speed",tip:"3–5 posts/week is the sweet spot"},
            {title:"Lead Capture",       desc:"High-SEO articles are prime real estate for newsletter CTAs",          tip:"Embed opt-ins in top-scoring articles"},
          ].map(ins=>(
            <div key={ins.title} className="insight-card">
              <div className="insight-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {ins.title}
              </div>
              <p className="insight-desc">{ins.desc}</p>
              <div className="insight-tip">{ins.tip}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}