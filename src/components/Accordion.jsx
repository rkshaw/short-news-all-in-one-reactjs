import React, { useState, useEffect } from 'react'

export default function Accordion({ providerName, sections = [], onSelectArticle }) {
  const [openIndex, setOpenIndex] = useState(sections.length ? 0 : -1)

  useEffect(() => {
    setOpenIndex(sections.length ? 0 : -1)
  }, [sections])

  const prev = () => setOpenIndex(i => Math.max(0, i - 1))
  const next = () => setOpenIndex(i => Math.min(sections.length - 1, i + 1))

  return (
    <div className="accordion">
      <div className="accordion-header-top">
        <h2>{providerName}</h2>
        <div className="accordion-nav">
          <button onClick={prev} disabled={openIndex <= 0}>Prev</button>
          <button onClick={next} disabled={openIndex >= sections.length - 1}>Next</button>
        </div>
      </div>

      {sections.map((s, idx) => (
        <div className="accordion-section" key={s.title + idx}>
          <div
            className="accordion-section-title"
            onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
          >
            <strong>{s.title}</strong>
            <span className="count">{s.items ? ` (${s.items.length})` : ''}</span>
          </div>

          {openIndex === idx && (
            <div className="accordion-section-body">
              <ul>
                {s.items && s.items.map((it, i) => (
                  <li key={it._absIndex} className={`feed-item ${it.unread ? 'unread' : ''}`}>
                    <button className="article-link" onClick={() => onSelectArticle && onSelectArticle(it._absIndex)}>
                      {it.title}
                    </button>
                    <div><small>{it.pubDate}</small></div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
