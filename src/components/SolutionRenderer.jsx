/**
 * SolutionRenderer — Renders explanation text with rich formatting.
 *
 * Supports:
 *  - Paragraphs (blank-line separated)
 *  - Step lines starting with →, -, *, numbers like "1."
 *  - "| ... |" table lines
 *  - Bold labels like "Answer:", "Key:", "Note:"
 *  - Inline math rendered cleanly
 */
export default function SolutionRenderer({ text }) {
  if (!text) {
    return (
      <p className="sol-empty">No explanation provided for this question.</p>
    );
  }

  const lines = text.split('\n');
  const blocks = [];
  let currentPara = [];

  const flushPara = () => {
    if (currentPara.length > 0) {
      blocks.push({ type: 'para', lines: [...currentPara] });
      currentPara = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === '') {
      flushPara();
      continue;
    }

    // Table row
    if (line.startsWith('|') && line.endsWith('|')) {
      flushPara();
      blocks.push({ type: 'table-row', content: line });
      continue;
    }

    // Separator line (---|---|---)
    if (/^\|[-\s|]+\|$/.test(line)) {
      blocks.push({ type: 'table-sep' });
      continue;
    }

    currentPara.push(line);
  }
  flushPara();

  // Group table rows into table blocks
  const merged = [];
  let tableRows = [];
  for (const block of blocks) {
    if (block.type === 'table-row') {
      tableRows.push(block.content);
    } else if (block.type === 'table-sep') {
      // skip separator — it's just formatting
    } else {
      if (tableRows.length > 0) {
        merged.push({ type: 'table', rows: tableRows });
        tableRows = [];
      }
      merged.push(block);
    }
  }
  if (tableRows.length > 0) merged.push({ type: 'table', rows: tableRows });

  const renderInline = (text) => {
    // Bold Answer/Note labels
    const parts = text.split(/(\*\*[^*]+\*\*|Answer:|Note:|Key:|Formula:|Given:|Step \d+:)/g);
    return parts.map((part, i) => {
      if (/^\*\*[^*]+\*\*$/.test(part)) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (/^(Answer:|Note:|Key:|Formula:|Given:|Step \d+:)$/.test(part)) {
        return <strong key={i} className="sol-label">{part}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const renderParaLine = (line, i) => {
    // Step/formula line
    if (/^[→•\-\*]/.test(line) || /^\d+[.)]\s/.test(line)) {
      return (
        <div key={i} className="sol-step">
          {renderInline(line)}
        </div>
      );
    }
    // Answer / conclusion line
    if (/^(Answer:|Result:|Therefore|Hence|So,)/i.test(line)) {
      return (
        <div key={i} className="sol-answer">
          {renderInline(line)}
        </div>
      );
    }
    return (
      <div key={i} className="sol-line">
        {renderInline(line)}
      </div>
    );
  };

  const renderTable = (rows, tableIdx) => {
    const cells = rows.map(row =>
      row.split('|').map(c => c.trim()).filter(Boolean)
    );
    const [header, ...body] = cells;
    return (
      <div key={`table-${tableIdx}`} className="sol-table-wrap">
        <table className="sol-table">
          <thead>
            <tr>{header.map((h, i) => <th key={i}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="sol-renderer">
      {merged.map((block, bi) => {
        if (block.type === 'para') {
          return (
            <div key={bi} className="sol-para">
              {block.lines.map((line, li) => renderParaLine(line, li))}
            </div>
          );
        }
        if (block.type === 'table') {
          return renderTable(block.rows, bi);
        }
        return null;
      })}
    </div>
  );
}
