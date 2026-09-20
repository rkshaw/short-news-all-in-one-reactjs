import React, { useEffect, useState } from 'react'
import feeds from './feeds.json'
import ProviderTile from './components/ProviderTile'
import FeedList from './components/FeedList'
import Menu from './components/Menu'

export default function App() {
  const [country, setCountry] = useState('All')
  const [selectedProvider, setSelectedProvider] = useState(null)

  const countries = ['All', ...Array.from(new Set(feeds.providers.map(p => p.country)))]

  const providers = feeds.providers.filter(p => country === 'All' ? true : p.country === country)

  return (
    <div className="app">
      <header>
        <h1>Short News — All In One</h1>
      </header>

      <Menu providers={feeds.providers} onSelect={setSelectedProvider} />

      <section className="controls">
        <label>Country: </label>
        <select value={country} onChange={e => setCountry(e.target.value)}>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </section>

      <section className="tiles">
        {providers.map(p => (
          <ProviderTile key={p.id} provider={p} onOpen={() => setSelectedProvider(p)} />
        ))}
      </section>

      <section className="feedlist">
        {selectedProvider ? (
          <FeedList provider={selectedProvider} />
        ) : (
          <p>Select a provider to view its feeds.</p>
        )}
      </section>
    </div>
  )
}
