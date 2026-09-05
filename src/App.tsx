import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import SignupPage from "./pages/auth/SignupPage"
import LoginPage from "./pages/auth/LoginPage"
import DashboardPage from "./pages/dashboard/DashboardPage"
import MyPage from "./pages/mypage/MyPage"
import OnboardingPage from "./pages/auth/OnboardingPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* auth */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/mypage" element={<MyPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
