const API_BASE = "http://localhost:4000/api";

export async function fetchPins(status) {
  const query = status ? `?status=${status}` : "";
  const response = await fetch(`${API_BASE}/pins${query}`);
  return response.json();
}

export async function fetchAssignedPins(userId) {
  const response = await fetch(`${API_BASE}/pins?claimedById=${userId}`);
  return response.json();
}

export async function createUser({ name, phone, role }) {
  const response = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, role }),
  });
  return response.json();
}

export async function fetchUser(userId) {
  const response = await fetch(`${API_BASE}/users/${userId}`);
  return response.json();
}

export async function createPin(pin) {
  const response = await fetch(`${API_BASE}/pins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pin),
  });
  return response.json();
}

export async function claimPin(pinId, userId) {
  const response = await fetch(`${API_BASE}/pins/${pinId}/claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return response.json();
}

export async function completePin(pinId, userId) {
  const response = await fetch(`${API_BASE}/pins/${pinId}/complete`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return response.json();
}
