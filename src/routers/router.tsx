// import React, { createContext, useContext, ReactNode } from "react";
// import { useNavigate } from "react-router-dom";

// // 1. Định nghĩa các phương thức điều hướng
// interface RouterContextProps {
//   openCart: () => void;
//   openProductDetail: (id: string) => void;
//   openLogin: () => void;
// }

// // 2. Tạo Context cho Router
// const RouterContext = createContext<RouterContextProps | undefined>(undefined);

// // 3. Tạo Provider cho Router
// interface CustomRouterProviderProps {
//   children: ReactNode;
// }

// export const CustomRouterProvider: React.FC<CustomRouterProviderProps> = ({
//   children,
// }) => {
//   const navigate = useNavigate(); // Hook điều hướng từ react-router-dom

//   // Các hàm điều hướng
//   const openCart = (id: number) => {
//     navigate(`/cart`);
//   };

//   const openProductDetail = (id: string) => {
//     navigate(`/product/${id}`);
//   };

//   const openLogin = () => {
//     navigate("/login");
//   };

//   return (
//     <RouterContext.Provider value={{ openCart, openProductDetail, openLogin }}>
//       {children}
//     </RouterContext.Provider>
//   );
// };

// // 4. Tạo hook để sử dụng context dễ dàng
// export const useRouter = () => {
//   const context = useContext(RouterContext);
//   if (!context) {
//     throw new Error("useRouter must be used within a CustomRouterProvider");
//   }
//   return context;
// };


import { createBrowserRouter } from "react-router-dom";
import { CustomRouterProvider } from "../context/RouterContext";
import HomeScreen from "../pages/home/HomeScreen";
import CartScreen from "../pages/cart/CartScreen";
import NotFound from "../pages/notFound/NotFound";
import Layout from "../layouts/Layout";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";

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
      { path: "/sign-up", element: <SignUp /> },

    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

