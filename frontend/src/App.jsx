import { useCallback, useEffect, useState } from 'react'
import {
  createTask,
  deleteTask,
  getTasks,
  updateTaskStatus,
} from './api'
import './App.css'

const STATUSES = [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
]

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const load = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await getTasks()
      setTasks(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleCreate(e) {
    e.preventDefault()
    setError(null)
    try {
      await createTask({ title: title.trim(), description })
      setTitle('')
      setDescription('')
      await load()
    } catch (e) {
      setError(e.message || 'Request failed')
    }
  }

  async function handleStatus(id, status) {
    setError(null)
    try {
      await updateTaskStatus(id, status)
      await load()
    } catch (e) {
      setError(e.message || 'Request failed')
    }
  }

  async function handleDelete(id) {
    setError(null)
    try {
      await deleteTask(id)
      await load()
    } catch (e) {
      setError(e.message || 'Request failed')
    }
  }

  return (
    <div className="layout">
      <header className="header">
        <h1>Team Task Tracker</h1>
      </header>

      {error ? (
        <div className="banner error" role="alert">
          {error}
        </div>
      ) : null}

      <section className="panel">
        <h2>New task</h2>
        <form className="form" onSubmit={handleCreate}>
          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </label>
          <button type="submit">Add task</button>
        </form>
      </section>

      <section className="panel">
        <h2>Tasks</h2>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : tasks.length === 0 ? (
          <p className="muted">No tasks yet.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((t) => (
              <li key={t.id} className="task-item">
                <div className="task-meta">
                  <span className="task-title">{t.title}</span>
                  <span className="task-time">
                    {new Date(t.created_at).toLocaleString()}
                  </span>
                </div>
                {t.description ? (
                  <p className="task-desc">{t.description}</p>
                ) : null}
                <div className="task-actions">
                  <label>
                    Status
                    <select
                      value={t.status}
                      onChange={(e) => handleStatus(t.id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="button" onClick={() => handleDelete(t.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="footer">
        <p>Created By: <a href="https://honournosakhare.com" target='_blank'>Honour Nosakhare</a></p>
        <p>Github Repo: <a href="https://github.com/honorme/sprout-fullstack-assessment" target='_blank'>Sprout Fullstack Assessment</a></p>
      </footer>
    </div>
  )
}
