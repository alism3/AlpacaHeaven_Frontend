import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FundraiserForm from "./components/FundraiserForm";

import HomePage from "./pages/HomePage.jsx";
import FundraiserPage from "./pages/FundraiserPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegistrationPage from "./pages/RegistrationPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import NavBar from "./components/NavBar.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/fundraiser/:id", element: <FundraiserPage /> },
      { path: "/register", element: <RegistrationPage /> },
      { path: "/create-fundraiser", element: <FundraiserForm /> },
      { path: "/profile", element: <UserProfilePage /> },
      { path: "/my-pledges", element: <UserProfilePage /> }, // Same page, different tab
      { path: "*", element: <NotFoundPage /> }, // 404 catch-all
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
