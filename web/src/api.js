const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function getPins(){
  const res = await fetch(`${API_BASE}/api/pins`)
  if(!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export default { getPins }
