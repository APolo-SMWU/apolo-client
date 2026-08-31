import { NavLink } from "react-router-dom"

export default function Header() {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  
  return (
    <header className="w-full flex md:px-8 px-6 py-4 items-center justify-between bg-surface border-b border-focus">
      <div className="flex flex-col items-start justify-center">
        <h3 className="md:text-heading-03 text-body-01 font-bold text-ink leading-none">
          APolo
        </h3>
        <p className="md:text-caption-02 text-mini-01 text-placeholder leading-none whitespace-nowrap">
          AI Personal Online Link Organizer
        </p>
      </div>

      <div className="flex items-center justify-center md:gap-16 gap-8 md:text-body-02 text-caption-01 font-medium text-ink leading-none whitespace-nowrap">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to={isLoggedIn ? "/mypage" : "/login"}>
          {isLoggedIn ? "My Page" : "Login"}
        </NavLink>
      </div>
    </header>
  )
}