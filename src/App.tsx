import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import SignupPage from "./pages/auth/SignupPage"
import LoginPage from "./pages/auth/LoginPage"
import HomePage from "./pages/home/HomePage"
import MyPage from "./pages/mypage/MyPage"
import OnboardingPage from "./pages/auth/OnboardingPage"
import CreatePage from "./pages/portfolio/CreatePage"
import SelectPage from "./pages/portfolio/SelectPage"
import LoadingPage from "./pages/portfolio/LoadingPage"
import EditorPage from "./pages/portfolio/EditorPage"
import PreviewPage from "./pages/portfolio/PreviewPage"

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
        <Route path="/select" element={<SelectPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/editor" element={<EditorPage />} />

        <Route path="/mypage" element={<MyPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
