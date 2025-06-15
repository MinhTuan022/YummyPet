import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Checkbox,
  Tabs,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import "./AdminAuthPage.scss";
import { _request } from "../../../network/Api";
import { _router } from "../../../context/routerSingleton";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

const AdminAuthPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    try {
      _request({
        path: "/auth/login/admin",
        method: "POST",
        body: {
          usernameOrEmail: values.email,
          password: values.password,
        },
        onSuccess(data) {
          localStorage.setItem("accessToken", data.data.token);

          message.success("Đăng nhập thành công!");
          _router.openDashboard()
        },
        onError(error) {
          message.error("Email hoặc mật khẩu không đúng!");
        },
      });
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Demo registration success
      message.success(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
      );
      registerForm.resetFields();
      setActiveTab("login");
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const LoginForm = () => (
    <Form
      form={loginForm}
      name="adminLogin"
      onFinish={handleLogin}
      autoComplete="off"
      layout="vertical"
      className="auth-form"
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: "string", message: "Email không hợp lệ!" },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="admin@yummypet.com"
          size="large"
          className="auth-input"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Mật khẩu"
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu!" },
          { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Nhập mật khẩu"
          size="large"
          className="auth-input"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        className="remember-section"
      >
        <Checkbox>Ghi nhớ đăng nhập</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={loading}
          className="auth-button"
          block
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </Form.Item>

      <div className="auth-footer">
        <div className="footer-links">
          <a href="#" className="footer-link">
            Quên mật khẩu?
          </a>
          <span className="divider">•</span>
          <a href="#" className="footer-link">
            Hỗ trợ
          </a>
        </div>
      </div>
    </Form>
  );

  const RegisterForm = () => (
    <Form
      form={registerForm}
      name="adminRegister"
      onFinish={handleRegister}
      autoComplete="off"
      layout="vertical"
      className="auth-form"
    >
      <Form.Item
        name="fullName"
        label="Họ và tên"
        rules={[
          { required: true, message: "Vui lòng nhập họ và tên!" },
          { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự!" },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Nguyễn Văn A"
          size="large"
          className="auth-input"
        />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: "email", message: "Email không hợp lệ!" },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="admin@yummypet.com"
          size="large"
          className="auth-input"
        />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Số điện thoại"
        rules={[
          { required: true, message: "Vui lòng nhập số điện thoại!" },
          { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ!" },
        ]}
      >
        <Input
          prefix={<PhoneOutlined />}
          placeholder="0123456789"
          size="large"
          className="auth-input"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Mật khẩu"
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu!" },
          { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Nhập mật khẩu"
          size="large"
          className="auth-input"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Xác nhận mật khẩu"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Vui lòng xác nhận mật khẩu!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Nhập lại mật khẩu"
          size="large"
          className="auth-input"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>

      <Form.Item
        name="agree"
        valuePropName="checked"
        className="remember-section"
        rules={[
          {
            required: true,
            message: "Bạn phải đồng ý với điều khoản sử dụng!",
          },
        ]}
      >
        <Checkbox>
          Tôi đồng ý với{" "}
          <a href="#" className="footer-link">
            Điều khoản sử dụng
          </a>{" "}
          và{" "}
          <a href="#" className="footer-link">
            Chính sách bảo mật
          </a>
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={loading}
          className="auth-button"
          block
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </Button>
      </Form.Item>

      {/* <div className="auth-footer">
        <Text className="register-info">
          Sau khi đăng ký, bạn sẽ nhận được email xác thực để kích hoạt tài khoản.
        </Text>
      </div> */}
    </Form>
  );

  return (
    <div className="admin-auth-container">
      <div className="auth-background">
        <div className="floating-elements">
          <div className="floating-paw paw-1">🐾</div>
          <div className="floating-paw paw-2">🐾</div>
          <div className="floating-paw paw-3">🐾</div>
          <div className="floating-paw paw-4">🐾</div>
          <div className="floating-paw paw-5">🐾</div>
        </div>
      </div>

      <div className="auth-content">
        <Card className="auth-card">
          <div className="auth-header">
            <div className="logo-section">
              <div className="logo">
                <span className="logo-text">Yummypet</span>
              </div>
              <Text className="logo-subtitle">Admin Panel</Text>
            </div>
            <Title level={2} className="auth-title">
              {activeTab === "login"
                ? "Đăng nhập quản trị"
                : "Đăng ký quản trị"}
            </Title>
            <Text className="auth-description">
              {activeTab === "login"
                ? "Chào mừng trở lại! Vui lòng đăng nhập để quản lý cửa hàng thú cưng của bạn."
                : "Tạo tài khoản quản trị mới để bắt đầu quản lý cửa hàng thú cưng của bạn."}
            </Text>
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="auth-tabs"
            centered
          >
            <TabPane tab="Đăng nhập" key="login">
              <LoginForm />
            </TabPane>
            {/* <TabPane tab="Đăng ký" key="register">
              <RegisterForm />
            </TabPane> */}
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuthPage;
