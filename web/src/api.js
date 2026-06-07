const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function parsePhotos(photos) {
  if (!photos) return []
  if (Array.isArray(photos)) return photos
  if (typeof photos !== 'string') return []

  try {
    const parsed = JSON.parse(photos)
    return Array.isArray(parsed) ? parsed : [String(parsed)]
  } catch {
    return [photos]
  }
}

export async function getPins(){
  const res = await fetch(`${API_BASE}/api/pins`)
  if(!res.ok) throw new Error(`API error ${res.status}`)

  const data = await res.json()
  return Array.isArray(data)
    ? data.map(pin => ({
        ...pin,
        photos: parsePhotos(pin.photos),
      }))
    : data
}

export default { getPins }
