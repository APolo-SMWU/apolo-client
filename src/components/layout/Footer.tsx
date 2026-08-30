import { NavLink } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="w-full px-16 py-4 flex items-center justify-between bg-surface border-t border-focus">
      <p className="text-body-02 font-medium text-ink">©2026 APolo</p>
      <p className="text-caption-01 text-placeholder">AI Personal Online Link Organizer</p>
      <NavLink to="/policy" className="text-body-02 font-medium text-ink">Privacy Policy</NavLink>
    </footer>
  )
}