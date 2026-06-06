import React, { useState, useMemo } from "react";
import * as Icons from "lucide-react";
import { MATERIALS } from "../data/materialsData";

// ─── FORMULA CARD ─────────────────────────────────────────────────────────────
function FormulaItem({ item }) {
  return (
    <div className="mat-formula-item">
      <span className="mat-formula-label">{item.label}</span>
      <span className="mat-formula-eq">{item.formula}</span>
      {item.note && <span className="mat-formula-note">{item.note}</span>}
    </div>
  );
}

// ─── TABLE BLOCK ──────────────────────────────────────────────────────────────
function TableBlock({ rows }) {
  return (
    <div className="mat-table-wrapper">
      <table className="mat-table">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="mat-table-row">
              {row.map((cell, j) => (
                <td key={j} className={j === 0 ? "mat-table-key" : "mat-table-val"}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── TRICKS BLOCK ─────────────────────────────────────────────────────────────
function TricksBlock({ items }) {
  return (
    <ul className="mat-tricks-list">
      {items.map((trick, i) => (
        <li key={i} className="mat-trick-item">
          <span className="mat-trick-dot" />
          <span>{trick}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── TOPIC BLOCK ──────────────────────────────────────────────────────────────
function TopicBlock({ topic }) {
  return (
    <div className="mat-topic-block">
      <div className="mat-topic-title">{topic.title}</div>
      {topic.type === "tricks" ? (
        <TricksBlock items={topic.items} />
      ) : topic.type === "table" ? (
        <TableBlock rows={topic.rows} />
      ) : (
        <div className="mat-formula-list">
          {topic.items.map((item, i) => (
            <FormulaItem key={i} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CATEGORY DETAIL PANEL ────────────────────────────────────────────────────
function CategoryDetail({ cat, onBack }) {
  return (
    <div className="mat-detail-panel">
      {/* Header */}
      <div className="mat-detail-header">
        <button className="back-button" onClick={onBack} style={{ marginBottom: 0 }}>
          <Icons.ChevronLeft size={16} />
          <span>All Topics</span>
        </button>
        <div className="mat-detail-hero">
          <div
            className="mat-detail-icon"
            style={{ background: cat.colorSoft, border: `1px solid ${cat.colorLine}` }}
          >
            <span style={{ fontSize: 28 }}>{cat.icon}</span>
          </div>
          <div>
            <div className="mat-detail-title" style={{ color: cat.color }}>
              {cat.title}
            </div>
            <div className="mat-detail-sub">
              {cat.topics.length} topic{cat.topics.length !== 1 ? "s" : ""} · Formulas, Tricks & Methods
            </div>
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="mat-topics-grid">
        {cat.topics.map((topic, i) => (
          <TopicBlock key={i} topic={topic} />
        ))}
      </div>
    </div>
  );
}

// ─── SEARCH BAR ───────────────────────────────────────────────────────────────
function SearchBar({ value, onChange }) {
  return (
    <div className="mat-search-wrap">
      <Icons.Search size={15} className="mat-search-icon" />
      <input
        className="mat-search-input"
        type="text"
        placeholder="Search topics, formulas, tricks..."
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
      />
      {value && (
        <button className="mat-search-clear" onClick={() => onChange("")}>
          <Icons.X size={13} />
        </button>
      )}
    </div>
  );
}

// ─── CATEGORY CARD ────────────────────────────────────────────────────────────
function CategoryCard({ cat, onClick, searchQuery }) {
  const topicCount = cat.topics.length;
  const formulaCount = cat.topics.reduce((acc, t) => {
    if (t.items) return acc + t.items.length;
    if (t.rows) return acc + t.rows.length;
    return acc;
  }, 0);

  return (
    <button
      className="mat-cat-card"
      onClick={onClick}
      style={{
        "--cat-color": cat.color,
        "--cat-soft": cat.colorSoft,
        "--cat-line": cat.colorLine,
      }}
    >
      <div className="mat-cat-icon-wrap" style={{ background: cat.colorSoft, border: `1px solid ${cat.colorLine}` }}>
        <span style={{ fontSize: 22 }}>{cat.icon}</span>
      </div>
      <div className="mat-cat-body">
        <div className="mat-cat-title">{cat.title}</div>
        <div className="mat-cat-meta">
          {topicCount} topics · {formulaCount}+ formulas
        </div>
      </div>
      <div
        className="mat-cat-tag"
        style={{ color: cat.color, background: cat.colorSoft, border: `1px solid ${cat.colorLine}` }}
      >
        {cat.tag}
      </div>
      <Icons.ChevronRight size={15} className="mat-cat-arrow" />
    </button>
  );
}

// ─── INLINE SEARCH RESULTS ────────────────────────────────────────────────────
function SearchResults({ query, onSelectCat }) {
  const results = useMemo(() => {
    const q = query.toLowerCase();
    const hits = [];

    MATERIALS.forEach(cat => {
      cat.topics.forEach(topic => {
        if (topic.title.toLowerCase().includes(q) || cat.title.toLowerCase().includes(q)) {
          hits.push({ cat, topic, matchType: "topic" });
        } else if (topic.items) {
          topic.items.forEach(item => {
            if (
              item.label?.toLowerCase().includes(q) ||
              item.formula?.toLowerCase().includes(q) ||
              item.note?.toLowerCase().includes(q)
            ) {
              hits.push({ cat, topic, item, matchType: "formula" });
            }
          });
        } else if (topic.rows) {
          topic.rows.forEach(row => {
            if (row.some(cell => cell.toLowerCase().includes(q))) {
              hits.push({ cat, topic, row, matchType: "table" });
            }
          });
        } else if (topic.type === "tricks" && topic.items) {
          topic.items.forEach(trick => {
            if (trick.toLowerCase().includes(q)) {
              hits.push({ cat, topic, trick, matchType: "trick" });
            }
          });
        }
      });
    });

    // deduplicate by cat+topic
    const seen = new Set();
    return hits.filter(h => {
      const key = `${h.cat.id}-${h.topic.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 12);
  }, [query]);

  if (!results.length) {
    return (
      <div className="mat-search-empty">
        <Icons.SearchX size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
        <p>No results for "{query}"</p>
        <span>Try different keywords like "profit", "AP", "speed"</span>
      </div>
    );
  }

  return (
    <div className="mat-search-results">
      <div className="mat-search-results-label">
        {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
      </div>
      {results.map((r, i) => (
        <button key={i} className="mat-search-result-item" onClick={() => onSelectCat(r.cat)}>
          <span style={{ fontSize: 18 }}>{r.cat.icon}</span>
          <div>
            <div className="mat-sr-cat">{r.cat.title}</div>
            <div className="mat-sr-topic">{r.topic.title}</div>
          </div>
          <div
            className="mat-cat-tag"
            style={{ color: r.cat.color, background: r.cat.colorSoft, border: `1px solid ${r.cat.colorLine}`, marginLeft: "auto" }}
          >
            {r.cat.tag}
          </div>
          <Icons.ChevronRight size={14} style={{ opacity: 0.4, flexShrink: 0 }} />
        </button>
      ))}
    </div>
  );
}

// ─── MAIN MATERIALS COMPONENT ─────────────────────────────────────────────────
export default function Materials({ onNavigate }) {
  const [selectedCat, setSelectedCat] = useState(null);
  const [search, setSearch] = useState("");

  const handleBack = () => {
    setSelectedCat(null);
    setSearch("");
  };

  const handleSelectCat = (cat) => {
    setSelectedCat(cat);
    setSearch("");
  };

  // Detail view
  if (selectedCat) {
    return (
      <div className="mat-container">
        <CategoryDetail cat={selectedCat} onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className="mat-container">
      {/* Page header */}
      <div className="mat-page-header">
        <div>
          <h2 className="mat-page-title">Study Materials</h2>
          <p className="mat-page-sub">
            Formulas, shortcuts &amp; tricks for every aptitude topic — all in one place
          </p>
        </div>
        <div className="mat-stats-row">
          <div className="mat-stat-pill">
            <Icons.BookOpen size={13} />
            {MATERIALS.length} Topics
          </div>
          <div className="mat-stat-pill">
            <Icons.Zap size={13} />
            200+ Formulas
          </div>
          <div className="mat-stat-pill">
            <Icons.Lightbulb size={13} />
            Shortcuts Inside
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mat-search-section">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Content */}
      {search.trim() ? (
        <SearchResults query={search.trim()} onSelectCat={handleSelectCat} />
      ) : (
        <div className="mat-cats-grid">
          {MATERIALS.map(cat => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              onClick={() => handleSelectCat(cat)}
              searchQuery={search}
            />
          ))}
        </div>
      )}
    </div>
  );
}
