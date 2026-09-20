import React, { useEffect, useState } from 'react'
import Accordion from './Accordion'
import ArticleViewer from './ArticleViewer'

function parseRssXml(text) {
  const doc = new DOMParser().parseFromString(text, 'application/xml')
  const parserError = doc.querySelector('parsererror')
  if (parserError) throw new Error('Invalid XML')

  const items = []
  const itemNodes = doc.querySelectorAll('item')
  if (itemNodes.length) {
    itemNodes.forEach(n => {
      const title = n.querySelector('title')?.textContent || ''
      const link = n.querySelector('link')?.textContent || n.querySelector('guid')?.textContent || ''
      const pubDate = n.querySelector('pubDate')?.textContent || ''
      const description = n.querySelector('description')?.textContent || ''
      const content = n.querySelector('content\\:encoded')?.textContent || ''
      const contentSnippet = (description || content).replace(/<[^>]+>/g, '').slice(0, 400)
      items.push({ title, link, pubDate, description, content, contentSnippet })
    })
  } else {
    // Atom support
    const entryNodes = doc.querySelectorAll('entry')
    entryNodes.forEach(n => {
      const title = n.querySelector('title')?.textContent || ''
      const link = n.querySelector('link')?.getAttribute('href') || ''
      const pubDate = n.querySelector('updated')?.textContent || n.querySelector('published')?.textContent || ''
      const description = n.querySelector('summary')?.textContent || n.querySelector('content')?.textContent || ''
      const contentSnippet = (description).replace(/<[^>]+>/g, '').slice(0, 400)
      items.push({ title, link, pubDate, description, content: description, contentSnippet })
    })
  }

  return { items }
}

export default function FeedList({ provider }) {
  const [sections, setSections] = useState([])
  const [flatItems, setFlatItems] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!provider) return
    setLoading(true)
    setError(null)
    setSections([])
    setFlatItems([])
    setSelectedIndex(-1)

    const fetchAll = async () => {
      try {
        const results = []
        const flat = []
        let counter = 0
        for (const feed of provider.feeds) {
          const resp = await fetch('http://theutility.co.in/proxy.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: feed.url })
          })
          const text = await resp.text()
          const feedData = parseRssXml(text)
          const items = (feedData.items || []).map(i => {
            const obj = { ...i, source: provider.name, feedTitle: feed.title, _absIndex: counter }
            counter += 1
            flat.push(obj)
            return obj
          })
          results.push({ title: feed.title, items })
        }

        // load read markers
        const readJson = localStorage.getItem('readArticles')
        const readSet = readJson ? new Set(JSON.parse(readJson)) : new Set()
        // annotate unread
        for (const it of flat) it.unread = !readSet.has(it.link)

        setSections(results)
        setFlatItems(flat)
        setSelectedIndex(flat.length ? 0 : -1)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [provider])

  useEffect(() => {
    // keep sections updated with unread flags when flatItems change
    if (!flatItems.length) return
    const absMap = new Map(flatItems.map((it) => [it._absIndex, it]))
    const updated = sections.map(s => ({
      ...s,
      items: s.items.map(i => ({ ...i, unread: !!absMap.get(i._absIndex)?.unread }))
    }))
    setSections(updated)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flatItems])

  const saveRead = (link) => {
    const readJson = localStorage.getItem('readArticles')
    const read = readJson ? new Set(JSON.parse(readJson)) : new Set()
    read.add(link)
    localStorage.setItem('readArticles', JSON.stringify(Array.from(read)))
  }

  const markReadByIndex = (idx) => {
    const it = flatItems[idx]
    if (!it) return
    it.unread = false
    saveRead(it.link)
    setFlatItems([...flatItems])
  }

  const markUnreadByIndex = (idx) => {
    const it = flatItems[idx]
    if (!it) return
    it.unread = true
    // remove from read set
    const readJson = localStorage.getItem('readArticles')
    const read = readJson ? new Set(JSON.parse(readJson)) : new Set()
    read.delete(it.link)
    localStorage.setItem('readArticles', JSON.stringify(Array.from(read)))
    setFlatItems([...flatItems])
  }

  const selectArticle = (absIndex) => {
    const idx = flatItems.findIndex(it => it._absIndex === absIndex)
    if (idx === -1) return
    setSelectedIndex(idx)
    markReadByIndex(idx)
  }

  const nextArticle = () => {
    if (selectedIndex < flatItems.length - 1) {
      const n = selectedIndex + 1
      setSelectedIndex(n)
      markReadByIndex(n)
    }
  }

  const prevArticle = () => {
    if (selectedIndex > 0) {
      const p = selectedIndex - 1
      setSelectedIndex(p)
      markReadByIndex(p)
    }
  }

  const toggleUnread = (item) => {
    const idx = flatItems.findIndex(it => it._absIndex === item._absIndex)
    if (idx === -1) return
    if (flatItems[idx].unread) markReadByIndex(idx)
    else markUnreadByIndex(idx)
  }

  if (!provider) return null

  const current = selectedIndex >= 0 ? flatItems[selectedIndex] : null

  return (
    <div>
      <Accordion providerName={provider.name} sections={sections} onSelectArticle={selectArticle} />
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div style={{marginTop:12}}>
        <ArticleViewer
          item={current}
          onPrev={prevArticle}
          onNext={nextArticle}
          toggleUnread={toggleUnread}
          isUnread={current ? !!current.unread : false}
        />
      </div>
    </div>
  )
}
