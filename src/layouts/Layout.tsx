import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Layout,
  Button,
  Menu,
  Breadcrumb,
  Space,
  Typography,
  Dropdown,
  Col,
  Row,
  Input
} from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DownOutlined,
  TagOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import images from "../res/images";
import "./Layout.scss";
import Title from "antd/es/typography/Title";

const { Header } = Layout;
const { Text } = Typography;

const AppLayout = () => {
  console.log('render');
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const productItems = [
    { key: '1', label: 'Thức ăn cho chó' },
    { key: '2', label: 'Thức ăn cho mèo' },
    { key: '3', label: 'Thức ăn cho chim' },
  ];

  const collectionItems = [
    { key: '1', label: 'Premium Collection' },
    { key: '2', label: 'Organic Collection' },
    { key: '3', label: 'Puppy Collection' },
  ];

  const blogItems = [
    { key: '1', label: 'Tips chăm sóc thú cưng' },
    { key: '2', label: 'Chế độ dinh dưỡng' },
    { key: '3', label: 'Tips dạy thú cưng' },
  ];

  const pageItems = [
    { key: '1', label: 'Về chúng tôi' },
    { key: '2', label: 'Liên hệ' },
    { key: '3', label: 'FAQ' },
  ];

  const navItems = [
    {
      key: 'home',
      label: (
        <Link to="/">
          Trang chủ
        </Link>
      ),
    },
    {
      key: 'product',
      label: (
        <Dropdown menu={{ items: productItems }} trigger={['hover']}>
          <Space>
            Sản Phẩm
            <DownOutlined />
          </Space>
        </Dropdown>
      ),
    },
    {
      key: 'collections',
      label: (
        <Dropdown menu={{ items: collectionItems }} trigger={['hover']}>
          <Space>
            Bộ sưu tập
            <DownOutlined />
          </Space>
        </Dropdown>
      ),
    },
    {
      key: 'blog',
      label: (
        <Dropdown menu={{ items: blogItems }} trigger={['hover']}>
          <Space>
            Blog
            <DownOutlined />
          </Space>
        </Dropdown>
      ),
    },
    {
      key: 'pages',
      label: (
        <Dropdown menu={{ items: pageItems }} trigger={['hover']}>
          <Space>
            Trang
            <DownOutlined />
          </Space>
        </Dropdown>
      ),
    },
  ];

  const footerLinks = {
    myAccount: [
      { title: 'Về chúng tôi', href: '/about' },
      { title: 'Liên hệ', href: '/contact' },
      { title: 'Faq', href: '/faq' },
      { title: 'Chính sách bảo mật', href: '/privacy' },
      { title: 'Hoàn và đổi trả', href: '/return' }
    ],
    customerService: [
      { title: 'Trang chủ', href: '/' },
      { title: 'Sản Phẩm', href: '/product' },
      { title: 'Bộ sưu tập', href: '/collections' },
      { title: 'Blog', href: '/blog' },
      { title: 'Trang', href: '/pages' }
    ],
    quickLinks: [
      { title: 'Về chúng tôi', href: '/about' },
      { title: 'Liên hệ', href: '/contact' },
      { title: 'Faq', href: '/faq' },
      { title: 'Chính sách bảo mật', href: '/privacy' },
      { title: 'Hoàn và đổi trả', href: '/return' }
    ]
  };

  const bottomLinks = [
    'Liên hệ', 'Về chúng tôi', 'Faq', 'Chính sách bảo mật',
    'Hoàn và đổi trả', 'Chính sách giao hàng', 'Điều khoản sử dụng'
  ];

  return (
    <Layout>
      <div className="discount-banner">
        <Space>
          <TagOutlined />
          <Text style={{ color: 'white' }}>
            Sử dụng mã giảm giá "PETZY001" để được giảm 5%
          </Text>
        </Space>
      </div>

      <Header className="main-header">
        <div className="header-content">
          <img src={images.logo} alt="" className="logo" />
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['home']}
            items={navItems}
            className="main-nav"
          />
          <div className="header-actions">
            <Space size="large">
              <div className="action-item">
                <Button
                  type="text"
                  icon={<UserOutlined />}
                  className="action-button"
                >
                  <Link to={'/login'}>
                    <div className="action-text">
                      <div>Tài Khoản</div>
                      <div className="sub-text">Đăng nhập</div>
                    </div>
                  </Link>
                </Button>
              </div>
              <div className="action-item">

                <Button
                  type="text"
                  className="action-button"
                >
                  <div className="cart-icon">
                    <ShoppingCartOutlined />
                    <span className="cart-count">{cartCount}</span>
                  </div>
                  <div className="action-text">
                    <div>Total</div>
                    <div className="sub-text">$0.00</div>
                  </div>
                </Button>
              </div>
            </Space>
          </div>
        </div>
      </Header>

      <div className="breadcrumb-container">
        <Breadcrumb
          items={[
            {
              title: 'Home',
            },
            {
              title: 'Account',
            },
          ]}
        />
      </div>

      <main>
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="newsletter-section">
          <Row justify="space-between" align="middle" gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <img src={images.logo} alt="Petzy" className="footer-logo" />
            </Col>
            <Col xs={24} md={8}>
              <div className="newsletter-content">
                <Title level={2} style={{ color: 'white', margin: 0 }}>
                  Đăng Ký Để Nhận
                </Title>
                <Title level={2} style={{ color: 'white', margin: 0 }}>
                  Tin Tức Mới Nhất
                </Title>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="newsletter-form">
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    placeholder="Email"
                    size="large"
                    style={{
                      borderRadius: '25px 0 0 25px',
                      border: 'none',
                      height: '45px'
                    }}
                  />
                  <Button
                    type="primary"
                    size="large"
                    style={{
                      borderRadius: '0 25px 25px 0',
                      backgroundColor: '#ff6b6b',
                      border: 'none',
                      height: '45px',
                      paddingLeft: '20px',
                      paddingRight: '20px'
                    }}
                  >
                    SUBSCRIBE
                  </Button>
                </Space.Compact>
              </div>
            </Col>
          </Row>
        </div>

        <div className="footer-content">
          <Row gutter={[48, 32]}>
            <Col xs={24} sm={12} lg={6}>
              <div className="footer-section">
                <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>
                  Thông Tin Liên Hệ
                </Title>
                <Space direction="vertical" size="middle">
                  <div className="contact-item">
                    <PhoneOutlined style={{ color: '#ccc', marginRight: '8px' }} />
                    <div>
                      <Text style={{ color: '#ccc', fontSize: '12px', display: 'block' }}>
                        Hotline free 24/7:
                      </Text>
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        +84 123 456 789
                      </Text>
                    </div>
                  </div>
                  <div className="contact-item">
                    <Text style={{ color: 'white' }}>
                      <Text strong style={{ color: 'white' }}>ĐỊA CHỈ:</Text>
                      <Text style={{ color: '#ccc' }}> Khu Tập Thể E2b, Ngõ 4 Phương Mai, Đống Đa, Hà Nội</Text>
                    </Text>
                  </div>
                  <div className="contact-item">
                    <Text style={{ color: 'white' }}>
                      <Text strong style={{ color: 'white' }}>EMAIL:</Text>
                      <Text style={{ color: '#ccc' }}> admin@gmail.com</Text>
                    </Text>
                  </div>
                </Space>
              </div>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <div className="footer-section">
                <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>
                  Tài Khoản Của Tôi
                </Title>
                <Space direction="vertical" size="small">
                  {footerLinks.myAccount.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      style={{ color: '#ccc', display: 'block', textDecoration: 'none' }}
                    >
                      {link.title}
                    </a>
                  ))}
                </Space>
              </div>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <div className="footer-section">
                <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>
                  Dịch Vụ Khách Hàng
                </Title>
                <Space direction="vertical" size="small">
                  {footerLinks.customerService.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      style={{ color: '#ccc', display: 'block', textDecoration: 'none' }}
                    >
                      {link.title}
                    </a>
                  ))}
                </Space>
              </div>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <div className="footer-section">
                <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>
                  Liên Kết Nhanh
                </Title>
                <Space direction="vertical" size="small">
                  {footerLinks.quickLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      style={{ color: '#ccc', display: 'block', textDecoration: 'none' }}
                    >
                      {link.title}
                    </a>
                  ))}
                </Space>
              </div>
            </Col>
          </Row>
        </div>

        <div className="footer-bottom">
          <Row justify="space-between" align="middle" gutter={[24, 16]}>
            <Col xs={24} lg={12}>
              <Space wrap>
                {bottomLinks.map((link, index) => (
                  <React.Fragment key={index}>
                    <a href="#" style={{ color: '#ccc', fontSize: '12px', textDecoration: 'none' }}>
                      {link}
                    </a>
                    {index < bottomLinks.length - 1 && (
                      <span style={{ color: '#666' }}>|</span>
                    )}
                  </React.Fragment>
                ))}
              </Space>
            </Col>
            <Col xs={24} lg={12} style={{ textAlign: 'right' }}>
              <Space>
                <img src="" alt="Visa" />
                <img src="" alt="Mastercard" />
                <img src="" alt="American Express" />
                <img src="" alt="PayPal" />
                <img src="" alt="Diners Club" />
                <img src="" alt="Discover" />
              </Space>
            </Col>
          </Row>
          <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #444' }}>
            <Text style={{ color: '#999', fontSize: '12px' }}>
              © 2025, LogicGo Infotech Powered by Shopify
            </Text>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default AppLayout;