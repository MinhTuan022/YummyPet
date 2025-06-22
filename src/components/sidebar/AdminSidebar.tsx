import React, { useState } from "react";
import {
  Home,
  Users,
  Package,
  Calendar,
  FileText,
  Settings,
  BarChart3,
  Heart,
  Stethoscope,
  ShoppingCart,
  UserCheck,
  Pill,
  ChevronDown,
  ChevronRight,
  LogOut,
  HandHelping,
  Store,
  FolderOpen,
} from "lucide-react";
import "./AdminSidebar.scss";
import images from "../../res/images";
import { _router } from "../../context/routerSingleton";
import { getUserRoleFromToken } from "../../utils";

const AdminSidebar = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [expandedMenus, setExpandedMenus] = useState(["pets"]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuKey)
        ? prev.filter((key) => key !== menuKey)
        : [...prev, menuKey]
    );
  };

  const role = getUserRoleFromToken(); // Lấy role từ token

  // Các key menu dành riêng cho Admin
  const adminOnlyKeys = ["staff", "reports", "settings"];
  const menuItems = [
    {
      key: "dashboard",
      icon: Home,
      label: "Dashboard",
      path: "/admin/dashboard2",
    },
    {
      key: "health",
      icon: Store,
      label: "Cửa hàng",
      // hasSubmenu: true,
      path: "pos2",

      // submenu: [

      // ],
    },
    {
      key: "pet-categories",
      label: "Danh mục",
      icon: FolderOpen,
      path: "/admin/pets/categories",
    },
    {
      key: "pets",
      icon: Heart,
      label: "Quản lý thú cưng",
      hasSubmenu: true,
      submenu: [
        { key: "all-pets", label: "Tất cả thú cưng", path: "/admin/pets" },
        { key: "add-pet", label: "Thêm thú cưng", path: "/admin/pets/add" },
      ],
    },
    {
      key: "orders",
      icon: ShoppingCart,
      label: "Đơn hàng",
      path: "/admin/orders2",
      // badge: "12",
    },
    {
      key: "customers",
      icon: Users,
      label: "Khách hàng",
      path: "/admin/customers",
    },
    {
      key: "products",
      icon: Package,
      label: "Sản phẩm",
      hasSubmenu: true,
      submenu: [
        {
          key: "all-products",
          label: "Tất cả sản phẩm",
          path: "/admin/products2",
        },
        // {
        //   key: "add-product",
        //   label: "Thêm sản phẩm",
        //   path: "/admin/products/add",
        // },
        // { key: "inventory", label: "Kho hàng", path: "/admin/categories" },
      ],
    },
    {
      key: "service",
      icon: HandHelping,
      label: "Dịch vụ",
      path: "/admin/services",
    },

    // {
    //   key: "medicines",
    //   icon: Pill,
    //   label: "Thuốc & Vitamin",
    //   path: "/admin/medicines",
    // },
    {
      key: "staff",
      icon: UserCheck,
      label: "Nhân viên",
      path: "/admin/staff",
    },
    {
      key: "reports",
      icon: BarChart3,
      label: "Báo cáo",
      path: "/admin/reports2",
    },
    // {
    //   key: "documents",
    //   icon: FileText,
    //   label: "Tài liệu",
    //   path: "/admin/documents",
    // },
    {
      key: "settings",
      icon: Settings,
      label: "Cài đặt",
      path: "/admin/settings",
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (role === "admin") return true;
    return !adminOnlyKeys.includes(item.key); // Nếu không phải ADMIN thì ẩn các mục này
  });
  const handleMenuClick = (
    menuKey: string,
    path: string,
    hasSubmenu = false
  ) => {
    if (hasSubmenu) {
      // console.log("???", item)
      toggleMenu(menuKey);
    } else {
      // console.log("???2", item)

      _openMenu(menuKey, path);
    }
  };

  const _openMenu = (menuKey: string, path: string) => {
    setActiveMenu(menuKey);
    _router.openAny(path);
  };

  return (
    <div className={`admin-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo">
          {/* <Heart className="logo-icon" /> */}
          <img src={images.logo_admin} alt="" className="logo-admin" />
          {!isCollapsed && <span className="logo-text">YummyPet</span>}
        </div>
        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronRight
            className={`collapse-icon ${isCollapsed ? "" : "rotated"}`}
          />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedMenus.includes(item.key);
            const isActive = activeMenu === item.key;

            return (
              <li key={item.key} className="nav-item">
                <div
                  className={`nav-link ${isActive ? "active" : ""}`}
                  onClick={() =>
                    handleMenuClick(item.key, item.path || "", item.hasSubmenu)
                  }
                >
                  <div className="nav-link-content">
                    <Icon className="nav-icon" />
                    {/* <img src={images.logo} alt="" style={{width:20, height:20}}/> */}
                    {!isCollapsed && (
                      <>
                        <span className="nav-label">{item.label}</span>
                        {item?.badge && (
                          <span className="nav-badge">{item.badge}</span>
                        )}
                        {item.hasSubmenu && (
                          <ChevronDown
                            className={`submenu-arrow ${
                              isExpanded ? "expanded" : ""
                            }`}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>

                {item.hasSubmenu && isExpanded && !isCollapsed && (
                  <ul className="submenu">
                    {item.submenu?.map((subItem) => (
                      <li key={subItem.key} className="submenu-item">
                        <div
                          className={`submenu-link ${
                            activeMenu === subItem.key ? "active" : ""
                          }`}
                          onClick={() => _openMenu(subItem.key, subItem.path)}
                        >
                          <div className="dot"></div>

                          {subItem.label}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="Admin Avatar"
            />
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <span className="user-name">Admin User</span>
              <span className="user-role">Quản trị viên</span>
            </div>
          )}
        </div>
        <button className="logout-btn" title="Đăng xuất">
          <LogOut className="logout-icon" />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
