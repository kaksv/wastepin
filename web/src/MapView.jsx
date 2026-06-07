import React, { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Fix Leaflet default marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export default function MapView({ pins, loading }){
  const center = useMemo(() => {
    if (pins.length === 0) return [0.3476, 32.5825] // Default: Kampala, Uganda
    const lat = pins.reduce((acc, p) => acc + p.latitude, 0) / pins.length
    const lng = pins.reduce((acc, p) => acc + p.longitude, 0) / pins.length
    return [lat, lng]
  }, [pins])

  return (
    <div className="map-container">
      {loading ? (
        <p className="map-loading">Loading map…</p>
      ) : (
        <MapContainer center={center} zoom={12} style={{height: '600px', width: '100%'}}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {pins.map(pin => {
            const photoUrl = Array.isArray(pin.photos) && pin.photos.length > 0 ? pin.photos[0] : null
            return (
              <Marker key={pin.id} position={[pin.latitude, pin.longitude]}>
                <Popup>
                  <div className="popup-content">
                    {photoUrl && <img className="popup-image" src={photoUrl} alt={pin.title || 'pin image'} />}
                    <strong>{pin.title || 'Untitled'}</strong>
                    <p>{pin.description || ''}</p>
                    <p><small>Type: {pin.wasteType}, Qty: {pin.quantity}</small></p>
                    <p><small>Status: {pin.status}</small></p>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      )}
    </div>
  )
}
