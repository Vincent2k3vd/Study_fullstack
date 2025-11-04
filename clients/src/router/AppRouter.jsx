import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Profile = lazy(() => import("../pages/Profile"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [{ index: true, element: <Home /> }],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
