import { NavLink } from "react-router-dom"

export default function Header() {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  
  return (
    <header className="w-full flex px-16 py-4 items-center justify-between bg-surface border-b border-focus">
      <div className="flex flex-col items-start justify-center">
        <h3 className="text-heading-02 font-bold text-ink leading-none">
          APolo
        </h3>
        <p className="text-caption-02 text-placeholder leading-none">
          AI Personal Online Link Organizer
        </p>
      </div>

      <div className="flex items-center justify-center gap-16 text-body-01 font-medium text-ink leading-none">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/community">Community</NavLink>
        <NavLink to={isLoggedIn ? "/mypage" : "/login"}>
          {isLoggedIn ? "My Page" : "Login"}
        </NavLink>
      </div>
    </header>
  )
}