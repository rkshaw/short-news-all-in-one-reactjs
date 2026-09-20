import React from 'react'

export default function ProviderTile({ provider, onOpen }) {
  return (
    <div className="provider-tile" onClick={onOpen}>
      <h3>{provider.name}</h3>
      <p>{provider.country} — {provider.category}</p>
    </div>
  )
}
