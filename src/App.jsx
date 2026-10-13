import { useState, useEffect, useRef } from "react"
import ContactList from "./ContactList"
import ContactForm from "./ContactForm"
import "./App.css"

const API = "http://127.0.0.1:5000"

// Turns a failed response into a readable message
const readError = async (response) => {
  let message = ""
  try {
    message = (await response.json()).message ?? ""
  } catch {
    /* response had no JSON body */
  }
  if (/unique/i.test(message)) return "A contact with that email already exists."
  return message || `Something went wrong (status ${response.status}).`
}

// fetch wrapper that explains network failures
const request = async (path, options) => {
  try {
    return await fetch(`${API}${path}`, options)
  } catch {
    throw new Error("Can't reach the server. Is the Flask app running on port 5000?")
  }
}

function App() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [editing, setEditing] = useState(null)
  const [query, setQuery] = useState("")
  const [toast, setToast] = useState("")
  const toastTimer = useRef(null)

  const showToast = (text) => {
    setToast(text)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(""), 2500)
  }

  const fetchContacts = async () => {
    try {
      const response = await request("/contacts")
      if (!response.ok) throw new Error(await readError(response))
      const data = await response.json()
      setContacts(data.contacts)
      setLoadError("")
    } catch (err) {
      setLoadError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
    return () => clearTimeout(toastTimer.current)
  }, [])

  // Create (no id) or update (id). Throws so the form can show the error.
  const saveContact = async (data, id) => {
    const response = await request(id ? `/update_contact/${id}` : "/create_contact", {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(await readError(response))

    await fetchContacts()
    setEditing(null)
    showToast(id ? "Changes saved" : "Contact added")
  }

  const deleteContact = async (contact) => {
    try {
      const response = await request(`/delete_contact/${contact.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error(await readError(response))
      if (editing?.id === contact.id) setEditing(null)
      await fetchContacts()
      showToast(`${contact.firstName} ${contact.lastName} deleted`)
    } catch (err) {
      showToast(err.message)
    }
  }

  const q = query.trim().toLowerCase()
  const visible = q
    ? contacts.filter((c) =>
        `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(q)
      )
    : contacts

  let body
  if (loading) {
    body = <div className="state">Loading contacts…</div>
  } else if (loadError) {
    body = (
      <div className="state error">
        <strong>Couldn't load contacts</strong>
        {loadError}
      </div>
    )
  } else if (contacts.length === 0) {
    body = (
      <div className="state">
        <strong>No contacts yet</strong>
        Add your first one using the form.
      </div>
    )
  } else if (visible.length === 0) {
    body = (
      <div className="state">
        <strong>No matches</strong>
        Nothing matches "{query}".
      </div>
    )
  } else {
    body = (
      <ContactList
        contacts={visible}
        editingId={editing?.id}
        onEdit={setEditing}
        onDelete={deleteContact}
      />
    )
  }

  return (
    <div className="shell">
      <header className="masthead">
        <h1>Contacts</h1>
        <p className="count">
          {contacts.length} {contacts.length === 1 ? "person" : "people"} saved
        </p>
      </header>

      <main className="layout">
        <aside className="panel">
          <ContactForm
            key={editing?.id ?? "new"}
            editing={editing}
            onSave={saveContact}
            onCancel={() => setEditing(null)}
          />
        </aside>

        <section className="directory">
          <div className="search">
            <input
              type="search"
              placeholder="Search by name or email"
              aria-label="Search contacts"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {body}
        </section>
      </main>

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  )
}

export default App
