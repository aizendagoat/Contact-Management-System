import { useState } from "react"

// Used for both creating and editing. The parent gives this component a `key`
// that changes when switching modes, so state re-initializes automatically.
const ContactForm = ({ editing, onSave, onCancel }) => {
  const [firstName, setFirstName] = useState(editing?.firstName ?? "")
  const [lastName, setLastName] = useState(editing?.lastName ?? "")
  const [email, setEmail] = useState(editing?.email ?? "")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await onSave({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() }, editing?.id)
      if (!editing) {
        setFirstName("")
        setLastName("")
        setEmail("")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h2>{editing ? "Edit contact" : "New contact"}</h2>
      <p className="hint">
        {editing ? `Changing ${editing.firstName} ${editing.lastName}.` : "Add someone to your list."}
      </p>

      <div className="field">
        <label htmlFor="firstName">First name</label>
        <input id="firstName" type="text" required autoComplete="off"
          value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="lastName">Last name</label>
        <input id="lastName" type="text" required autoComplete="off"
          value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required autoComplete="off"
          value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving…" : editing ? "Save changes" : "Add contact"}
        </button>
        {editing && (
          <button className="btn" type="button" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  )
}

export default ContactForm
