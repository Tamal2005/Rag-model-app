interface HomeProps {
  onStartChat: () => void;
}

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "BM25 Retrieval",
    desc: "Fast keyword-based retrieval using BM25 ranking without embeddings or vector databases.",
    color: "var(--accent)",
  },

  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" stroke="currentColor" strokeWidth="1.8" />
        <polyline points="13,2 13,9 20,9" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
    title: "PDF Knowledge Base",
    desc: "Ask questions directly from uploaded machine learning and statistics documents.",
    color: "var(--accent2)",
  },

  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Lightweight RAG",
    desc: "Runs efficiently without expensive vector databases or high-memory embedding models.",
    color: "var(--accent3)",
  },

  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
    title: "Context-Aware Answers",
    desc: "Retrieved passages are combined into focused context before generating responses.",
    color: "#f59e0b",
  },
];

const STATS = [
  { value: "2", label: "PDF Knowledge Sources" },
  { value: "1.8k+", label: "Indexed Pages & Chunks" },
  { value: "BM25", label: "Vectorless Retrieval Engine" },
  { value: "<1s", label: "Average Response Time" },
];

export default function Home({ onStartChat }: HomeProps) {
  return (
    <>
      <div className="home-page">
        <div className="home-inner">
          {/* Hero */}
          <div className="hero">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Powered by RAG
            </div>
            <h1 className="hero-title">
              Chat with your<br />
              <span className="gradient-text">Knowledge Base</span>
            </h1>
            <p className="hero-sub">
              Ask questions in plain English. Get precise answers grounded in your documents — with sources, citations, and context.
            </p>
            <button className="hero-cta" onClick={onStartChat}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Start Chatting
            </button>
          </div>

          {/* Stats */}
          <div className="stats-row">
            {STATS.map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="section-title">What it can do</div>
          <div className="section-sub">Built on retrieval-augmented generation for accurate, grounded responses.</div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div className="feature-card" key={f.title}>
                <div
                  className="feature-icon-wrap"
                  style={{ background: `${f.color}18`, color: f.color }}
                >
                  {f.icon}
                </div>
                <div className="feature-title">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}