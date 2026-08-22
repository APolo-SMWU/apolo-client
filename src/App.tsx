import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import SignupPage from "./pages/auth/SignupPage"
import LoginPage from "./pages/auth/LoginPage"
import DashboardPage from "./pages/dashboard/DashboardPage"
import MyPage from "./pages/mypage/MyPage"
import PromptPage from "./pages/portfolio/PromptPage"
import GenerateLoadingPage from "./pages/portfolio/GenerateLoadingPage"
import CreateCompletePage from "./pages/portfolio/CreateCompletePage"
import BlockEditorPage from "./pages/portfolio/BlockEditorPage"
import PreviewPage from "./pages/portfolio/PreviewPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* auth */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/prompt" element={<PromptPage />} />
        <Route path="/generate-loading" element={<GenerateLoadingPage />} />
        <Route path="/create-complete" element={<CreateCompletePage />} />
        <Route path="/block-editor" element={<BlockEditorPage />} />
        <Route path="/preview" element={<PreviewPage />} />

        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
