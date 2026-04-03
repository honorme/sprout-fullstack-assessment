function apiBase() {
  const explicit = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
  if (explicit) return explicit
  if (import.meta.env.DEV) return ''
  return ''
}

async function handleJson(res) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function getTasks() {
  const base = apiBase()
  const res = await fetch(`${base}/tasks`)
  const data = await handleJson(res)
  if (!res.ok) {
    const msg = data && data.error ? data.error : res.statusText
    throw new Error(msg)
  }
  return data
}

export async function createTask(body) {
  const base = apiBase()
  const res = await fetch(`${base}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await handleJson(res)
  if (!res.ok) {
    const msg = data && data.error ? data.error : res.statusText
    throw new Error(msg)
  }
  return data
}

export async function updateTaskStatus(id, status) {
  const base = apiBase()
  const res = await fetch(`${base}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  const data = await handleJson(res)
  if (!res.ok) {
    const msg = data && data.error ? data.error : res.statusText
    throw new Error(msg)
  }
  return data
}

export async function deleteTask(id) {
  const base = apiBase()
  const res = await fetch(`${base}/tasks/${id}`, { method: 'DELETE' })
  if (res.status === 204) return
  const data = await handleJson(res)
  if (!res.ok) {
    const msg = data && data.error ? data.error : res.statusText
    throw new Error(msg)
  }
}
