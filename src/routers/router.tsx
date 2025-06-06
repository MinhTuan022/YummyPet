import { createBrowserRouter } from "react-router-dom";
import { CustomRouterProvider } from "../context/RouterContext";
import HomeScreen from "../pages/home/HomeScreen";
import CartScreen from "../pages/cart/CartScreen";
import NotFound from "../pages/notFound/NotFound";
import Layout from "../layouts/Layout";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import ProtectedRoute from "./ProtectedRoute";
import DashBoard from "../pages/admin/dashboard/DashBoard";
import Unauthorized from "../pages/Unauthorized";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CustomRouterProvider>
        <Layout />
      </CustomRouterProvider>
    ),
    children: [
      { path: "/", element: <HomeScreen /> },
      { path: "/cart/:id", element: <CartScreen /> },
      { path: "/sign-up", element: <SignUp /> },
      { path: "/login", element: <Login /> },

      {
        path: "/admin/dashboard",
        element: (
          <ProtectedRoute element={<DashBoard />} allowedRoles={["ADMIN"]} />
        ),
      },

      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },

    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

