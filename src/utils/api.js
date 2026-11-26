// ─── ACCESSCORE Centralized API Service Client ─────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

function getAuthHeader() {
  const token = localStorage.getItem('ac-token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const api = {
  baseUrl: API_BASE_URL,

  async get(endpoint) {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      return await res.json()
    } catch (err) {
      console.warn(`[API] GET ${endpoint} unavailable:`, err.message)
      return null
    }
  },

  async post(endpoint, data) {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      })
      const text = await res.text()
      let parsed = null
      try {
        parsed = text ? JSON.parse(text) : null
      } catch { }

      if (!res.ok) {
        const errorMsg = parsed?.message || parsed?.error || `HTTP error! status: ${res.status}`
        const error = new Error(errorMsg)
        error.status = res.status
        error.data = parsed
        throw error
      }
      return parsed || { success: true }
    } catch (err) {
      if (err.status) {
        throw err
      }
      console.warn(`[API] POST ${endpoint} unavailable:`, err.message)
      return null
    }
  },

  async patch(endpoint, data) {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const text = await res.text()
      return text ? JSON.parse(text) : { success: true }
    } catch (err) {
      console.warn(`[API] PATCH ${endpoint} unavailable:`, err.message)
      return null
    }
  },

  async delete(endpoint) {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      })
      return res.ok
    } catch (err) {
      console.warn(`[API] DELETE ${endpoint} unavailable:`, err.message)
      return false
    }
  },
}
