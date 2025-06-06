import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./AdminLayout.scss";
import "./Layout.scss";
import AdminSidebar from "../components/sidebar/AdminSidebar";

const { Header } = Layout;

const AdminLayout = () => {
  console.log("render");
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="admin-layout">
      {/* Sidebar cố định bên trái */}
      {/* <Sider width={250} className="admin-sidebar-wrapper"> */}
        <AdminSidebar />
      {/* </Sider> */}

      {/* Khu vực nội dung chính */}
      <Layout>
        <Header className="main-header">
          {/* Có thể thêm breadcrumb, search bar... */}
          <h1 className="page-title">Quản trị hệ thống</h1>
        </Header>

        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </div>
  );
};

export default AdminLayout;
