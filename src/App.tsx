import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/onboarding",
    element: <OnboardingPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/select",
    element: <SelectPage />,
  },
  {
    path: "/create",
    element: <CreatePage />,
  },
  {
    path: "/loading",
    element: <LoadingPage />,
  },
  {
    path: "/preview",
    element: <PreviewPage />,
  },
  {
    path: "/share/:shareId",
    element: <PreviewPage />,
  },
  {
    path: "/editor",
    element: <EditorPage />,
  },
  {
    path: "/mypage",
    element: <MyPage />,
  },
  {
    path: "*",
    element: <Navigate to="/home" replace />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
