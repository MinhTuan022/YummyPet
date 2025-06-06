import { createBrowserRouter } from "react-router-dom";
import { CustomRouterProvider } from "../context/RouterContext";
import HomeScreen from "../pages/home/HomeScreen";
import CartScreen from "../pages/cart/CartScreen";
import NotFound from "../pages/notFound/NotFound";
import Layout from "../layouts/Layout";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../pages/Unauthorized";
import AdminLayout from "../layouts/AdminLayout";
import PetPage from "../pages/admin/pet/PetPage";
import DashBoard from "../pages/admin/dashboard/DashBoard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CustomRouterProvider>
        <Layout />
      </CustomRouterProvider>
    ),
    children: [
      { path: "/", element: <Login /> },
      { path: "/cart/:id", element: <CartScreen /> },
      { path: "/sign-up", element: <SignUp /> }

    ],
  },
   {
    path: "/admin",
    element: (
      <CustomRouterProvider>
        <AdminLayout />
      </CustomRouterProvider>
    ),
    children: [
      {
        path: "dashboard",
        // element: (
        //   <ProtectedRoute element={<DashBoard />} allowedRoles={["ADMIN"]} />
        // ),
        element: (
          <DashBoard />
        ),
      },
      {
        path: "all-pets",
        element: (
          <PetPage />
        ),
      },
    ],
  },

  // Route 404
  {
    path: "*",
    element: <NotFound />,
  },
]);

