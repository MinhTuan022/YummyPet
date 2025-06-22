import { createBrowserRouter } from "react-router-dom";
import { CustomRouterProvider } from "../context/RouterContext";
import HomeScreen from "../pages/home/HomeScreen";
import CartScreen from "../pages/cart/CartScreen";
import NotFound from "../pages/notFound/NotFound";
import Layout from "../layouts/Layout";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import AdminLayout from "../layouts/AdminLayout";
import PetPage from "../pages/admin/pet/PetPage";
import AddProduct from "../pages/admin/products/AddProduct";
import AddPet from "../pages/admin/pet/AddPet";

import CustomerPage from "../pages/admin/customer/CustomerPage";
import ServicePage from "../pages/admin/service/ServicePage";
import EmployeePage from "../pages/admin/employee/EmployeePage";
import ReportPage from "../pages/admin/reports/ReportPage";
import CategoryPage from "../pages/admin/category/CategoryPage";
import AdminAuthPage from "../pages/admin/auth/AdminAuthPage";
import ProductPage from "../pages/admin/products/ProductPage";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import OrderManagementPage from "../pages/admin/order/OrderManagementPage";
import POSPage from "../pages/admin/pos/POSPage";

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
        path: "auth",
        element: <AdminAuthPage />,
      },
      {
        path: "dashboard",
        // element: (
        //   <ProtectedRoute element={<DashBoard />} allowedRoles={["ADMIN"]} />
        // ),
        element: <Dashboard />,
      },
      {
        path: "pets",
        element: <PetPage />,
      },
      {
        path: "add-product",
        element: <AddProduct />,
      },      {
        path: "pets/add",
        element: <AddPet />,
      },
      {
        path: "orders",
        element: <OrderManagementPage />,
      },

      {
        path: "customers",
        element: <CustomerPage />,
      },
      {
        path: "services",
        element: <ServicePage />,
      },
      {
        path: "staff",
        element: <EmployeePage />,
      },
      {
        path: "reports",
        element: <ReportPage />,
      },
      {
        path: "pets/categories",
        element: <CategoryPage />,
      },
      {
        path: "products",
        element: <ProductPage />,
      },
      {
        path: "pos",
        element: <POSPage />,
      },
    ],
  },

  // Route 404
  {
    path: "*",
    element: <NotFound />,
  },
]);
