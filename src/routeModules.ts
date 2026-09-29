import { lazy } from "react";

export const routeModules = {
  LandingPage: lazy(() => import("./pages/LandingPage")),
  SignupPage: lazy(() => import("./pages/auth/SignupPage")),
  LoginPage: lazy(() => import("./pages/auth/LoginPage")),
  HomePage: lazy(() => import("./pages/home/HomePage")),
  MyPage: lazy(() => import("./pages/mypage/MyPage")),
  OnboardingPage: lazy(() => import("./pages/auth/OnboardingPage")),
  CreatePage: lazy(() => import("./pages/portfolio/CreatePage")),
  SelectPage: lazy(() => import("./pages/portfolio/SelectPage")),
  LoadingPage: lazy(() => import("./pages/portfolio/LoadingPage")),
  EditorPage: lazy(() => import("./pages/portfolio/EditorPage")),
  PreviewPage: lazy(() => import("./pages/portfolio/PreviewPage")),
};
