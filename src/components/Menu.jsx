import React from 'react'

export default function Menu({ providers, onSelect }) {
  const groups = providers.reduce((acc, p) => {
    acc[p.name] = p
    return acc
  }, {})

  return (
    <nav className="menu">
      <ul>
        {Object.values(groups).map(p => (
          <li key={p.id} onClick={() => onSelect(p)}>{p.name}</li>
        ))}
      </ul>
    </nav>
  )
}
