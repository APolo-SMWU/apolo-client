import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import SignupPage from "./pages/auth/SignupPage"
import LoginPage from "./pages/auth/LoginPage"
import HomePage from "./pages/home/HomePage"
import MyPage from "./pages/mypage/MyPage"
import OnboardingPage from "./pages/auth/OnboardingPage"
import CreatePage from "./pages/portfolio/CreatePage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* auth */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />

        <Route path="/mypage" element={<MyPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
