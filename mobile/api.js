const API_BASE = "https://wastepin-api.onrender.com/api";

async function request(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    return res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") throw new Error("Request timed out. The server may be waking up — please try again in 30 seconds.");
    throw err;
  }
}

export async function fetchPins(status) {
  const query = status ? `?status=${status}` : "";
  return request(`${API_BASE}/pins${query}`);
}

export async function fetchAssignedPins(userId) {
  return request(`${API_BASE}/pins?claimedById=${userId}`);
}

export async function createUser({ name, phone, role }) {
  return request(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, role }),
  });
}

export async function fetchUser(userId) {
  return request(`${API_BASE}/users/${userId}`);
}

export async function createPin(pin) {
  return request(`${API_BASE}/pins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pin),
  });
}

export async function claimPin(pinId, userId) {
  return request(`${API_BASE}/pins/${pinId}/claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
}

export async function completePin(pinId, userId) {
  return request(`${API_BASE}/pins/${pinId}/complete`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
}
