import { NavLink } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="w-full px-16 py-4 flex items-center justify-between bg-surface border-t border-focus whitespace-nowrap">
      <p className="md:text-body-02 text-mini-01 font-medium text-ink">©2026 APolo</p>
      <p className="md:text-caption-01 text-mini-01 text-placeholder">AI Personal Online Link Organizer</p>
      <NavLink to="/policy" className="md: text-body-02 text-mini-01 font-medium text-ink">Privacy Policy</NavLink>
    </footer>
  )
}