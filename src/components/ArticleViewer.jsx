import React from 'react'

export default function ArticleViewer({ item, onPrev, onNext, toggleUnread, isUnread }) {
  if (!item) return <div className="article-viewer">Select an article to view.</div>

  return (
    <div className="article-viewer">
      <div className="article-controls">
        <button onClick={onPrev}>Prev</button>
        <button onClick={onNext}>Next</button>
        <button onClick={() => toggleUnread(item)}>{isUnread ? 'Mark Read' : 'Mark Unread'}</button>
      </div>

      <h3>{item.title}</h3>
      <div className="article-meta"><small>{item.pubDate} — {item.feedTitle}</small></div>
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: item.content || item.description || item.contentSnippet || 'No preview available.' }}
      />
      <div className="article-footer">
        <a href={item.link} target="_blank" rel="noreferrer">Open original</a>
      </div>
    </div>
  )
}
