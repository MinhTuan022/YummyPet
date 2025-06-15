import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./AdminLayout.scss";
import "./Layout.scss";
import AdminSidebar from "../components/sidebar/AdminSidebar";

const { Header } = Layout;

const AdminLayout = () => {
  console.log("render");
  const location = useLocation();
  const [title, setTitle] = useState<string>("");
  const contentRef = useRef<any>();
  useEffect(() => {
    window.scrollTo(0, 0);
    contentRef.current.scrollTo(0, 0);

    const getTitleByPath = (path: string) => {
      switch (path) {
        case "/admin":
          return "Trang chủ quản trị";
        case "/admin/pets":
          return "Tất cả thú cưng";
        case "/admin/pets/add":
          return "Thêm thú cưng";
        case "/admin/categories":
          return "Danh mục thú cưng";
        case "/admin/customers":
          return "Tất cả khách hàng";
        case "/admin/services":
          return "Tất cả dịch vụ";
        case "/admin/orders":
          return "Quản lý đơn hàng";
        default:
          return "Quản trị hệ thống";
      }
    };

    const newTitle = getTitleByPath(location.pathname);
    setTitle(newTitle);
  }, [location]);

  return (
    <div className="admin-layout">
      {location.pathname !== "/admin/auth" && <AdminSidebar />}

      <Layout>
        {location.pathname !== "/admin/auth" && (
          <Header className="main-header">
            <h1 className="page-title">{title}</h1>
          </Header>
        )}
        <Content className="admin-content" ref={contentRef}>
          <Outlet />
        </Content>
      </Layout>
    </div>
  );
};

export default AdminLayout;
