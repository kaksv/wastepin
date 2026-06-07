import React, {useEffect, useState} from 'react'
import { getPins } from './api'
import MapView from './MapView'

function PinCard({ pin }) {
  const photos = Array.isArray(pin.photos) ? pin.photos : []
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedPhoto = photos[selectedIndex] || null

  return (
    <li className="pin">
      {selectedPhoto ? (
        <img
          src={selectedPhoto}
          alt={pin.title || 'pin image'}
          onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex' }}
        />
      ) : null}
      <div className="pin-placeholder" style={{ display: selectedPhoto ? 'none' : 'flex' }}>No image available</div>
      {photos.length > 1 && (
        <div className="pin-thumbnails">
          {photos.slice(0, 3).map((thumbUrl, index) => (
            <button
              key={index}
              type="button"
              className={`thumbnail-button ${index === selectedIndex ? 'active' : ''}`}
              onClick={() => setSelectedIndex(index)}
            >
              <img
              src={thumbUrl}
              alt={`Thumbnail ${index + 1}`}
              className="pin-thumbnail"
              onError={e => { e.currentTarget.parentElement.style.display = 'none' }}
            />
            </button>
          ))}
        </div>
      )}
      <div className="pin-body">
        <h3>{pin.title || 'Untitled'}</h3>
        <p>{pin.description || ''}</p>
        <p className="meta">Status: {pin.status || 'open'}</p>
        <p className="meta">Type: {pin.wasteType || 'unknown'}</p>
      </div>
    </li>
  )
}

export default function App(){
  const [pins, setPins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState('map') // 'map' or 'list'

  useEffect(()=>{
    setLoading(true)
    getPins()
      .then(data=>{
        setPins(data || [])
      })
      .catch(err=>{
        setError(err.message || 'Failed to load')
      })
      .finally(()=>setLoading(false))
  },[])

  return (
    <div className="container">
      <header>
        <h1>Wastepin — Waste Collection Hub</h1>
        <p>Find and contribute to waste collection points</p>
        <div className="view-toggle">
          <button onClick={()=>setView('map')} className={view==='map'?'active':''}>
            Map View
          </button>
          <button onClick={()=>setView('list')} className={view==='list'?'active':''}>
            List View
          </button>
        </div>
      </header>

      {loading && <p>Loading pins…</p>}
      {error && <p className="error">{error}</p>}

      <main>
        {view === 'map' ? (
          <MapView pins={pins} loading={loading} />
        ) : (
          <>
            {pins.length === 0 && !loading && <p>No pins yet.</p>}
            <ul className="pins-list">
              {pins.map(pin=> (
                <PinCard key={pin.id} pin={pin} />
              ))}
            </ul>
          </>
        )}
      </main>

      <footer>
        <small>Wastepin Web — API at {import.meta.env.VITE_API_URL || 'http://localhost:4000'}</small>
      </footer>
    </div>
  )
}

