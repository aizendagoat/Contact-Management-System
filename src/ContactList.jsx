import { useMemo, useState } from "react"

// Gives each person a stable color based on their name
const avatarColor = (text) => {
  let hash = 0
  for (const ch of text) hash = (hash * 31 + ch.charCodeAt(0)) % 360
  return `hsl(${hash} 45% 36%)`
}

const initials = (c) =>
  `${c.firstName?.[0] ?? ""}${c.lastName?.[0] ?? ""}`.toUpperCase()

const ContactList = ({ contacts, editingId, onEdit, onDelete }) => {
  const [confirmingId, setConfirmingId] = useState(null)

  // Sort by last name, then group under a letter heading
  const groups = useMemo(() => {
    const sorted = [...contacts].sort(
      (a, b) =>
        a.lastName.localeCompare(b.lastName) ||
        a.firstName.localeCompare(b.firstName)
    )
    const map = new Map()
    for (const c of sorted) {
      const letter = (c.lastName[0] || "#").toUpperCase()
      if (!map.has(letter)) map.set(letter, [])
      map.get(letter).push(c)
    }
    return [...map.entries()]
  }, [contacts])

  return (
    <div>
      {groups.map(([letter, items]) => (
        <section className="group" key={letter}>
          <h3>{letter}</h3>
          <ul>
            {items.map((c) => (
              <li
                key={c.id}
                className={`row${editingId === c.id ? " is-editing" : ""}`}
              >
                <div
                  className="avatar"
                  style={{ background: avatarColor(`${c.firstName}${c.lastName}`) }}
                  aria-hidden="true"
                >
                  {initials(c)}
                </div>

                <div className="who">
                  <div className="name">{c.firstName} {c.lastName}</div>
                  <div className="email">
                    <a href={`mailto:${c.email}`}>{c.email}</a>
                  </div>
                </div>

                <div className="row-actions">
                  {confirmingId === c.id ? (
                    <>
                      <button className="btn btn-small" onClick={() => setConfirmingId(null)}>
                        Keep
                      </button>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => {
                          setConfirmingId(null)
                          onDelete(c)
                        }}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-small" onClick={() => onEdit(c)}>
                        Edit
                      </button>
                      <button className="btn btn-small" onClick={() => setConfirmingId(c.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export default ContactList
