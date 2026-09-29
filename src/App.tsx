import { Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { routeModules } from "./routeModules";

const {
  LandingPage,
  SignupPage,
  LoginPage,
  HomePage,
  MyPage,
  OnboardingPage,
  CreatePage,
  SelectPage,
  LoadingPage,
  EditorPage,
  PreviewPage,
} = routeModules;

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/onboarding", element: <OnboardingPage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/select", element: <SelectPage /> },
  { path: "/create", element: <CreatePage /> },
  { path: "/loading", element: <LoadingPage /> },
  { path: "/preview", element: <PreviewPage /> },
  { path: "/share/:shareId", element: <PreviewPage /> },
  { path: "/editor", element: <EditorPage /> },
  { path: "/mypage", element: <MyPage /> },
  { path: "*", element: <Navigate to="/home" replace /> },
]);

function RouteLoadingFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-white text-body-01 text-placeholder" role="status">
      불러오는 중...
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
