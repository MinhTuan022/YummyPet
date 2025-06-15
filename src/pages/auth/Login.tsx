import { Button, Card, Form, Input, Typography } from "antd";
import { Link } from "react-router-dom";
import "./Login.scss";
import images from "../../res/images";
import { _request } from "../../network/Api";
import { _router } from "../../context/routerSingleton";
import { _global } from "../../global";

const { Title } = Typography;

const Login = () => {
  const [form] = Form.useForm();

  const handleLogin = (values: { email: string; password: string }) => {
    console.log(values);
    _request({
      path: "/auth/login",
      method: "POST",
      body: {
        usernameOrEmail: values.email,
        password: values.password,
      },
      onSuccess: (data) => {
        localStorage.setItem("accessToken", data.data.token);
        console.error("Đăng nhập thành công:", data);

        _router.openCart(1, "Hoa", 10);
      },
      onError: (err) => {
        console.error("Đăng nhập thất bại:", err.message || err);
        _global.event.alert.current?.show({
            message: err.message || err,
            type: "warning"
        })
    },
    });
  };
  return (
    <div className="screen">
      <div className="thumbnail">
        <img src={images.thumbnail} alt="" />
      </div>
      <Card className="card">
        <Title className="title" level={2}>
          Đăng Nhập
        </Title>
        <Form onFinish={handleLogin} layout="vertical" form={form} size="large">
          <Form.Item
            name={"email"}
            rules={[
              {
                required: true,
                message: "Email không được để trống!",
              },
            ]}
          >
            <Input
              placeholder="Email"
              allowClear
              maxLength={100}
              type="email"
              className="custom-input"
            />
          </Form.Item>
          <Form.Item
            name={"password"}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu của bạn!",
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              maxLength={100}
              className="custom-input"
            />
          </Form.Item>
        </Form>

        <div className="links-row">
          <div className="link-left">
            <Link to={"/"} className="forgot-link">
              Quên mật khẩu?
            </Link>
          </div>
          <div className="link-right">
            <Link to={"/"} className="back-link">
              <span className="back-icon">⟪</span> Quay lại cửa hàng
            </Link>
          </div>
        </div>

        <div className="button-container">
          <Button
            className="btn-signin"
            onClick={() => form.submit()}
            type="primary"
            block
          >
            ĐĂNG NHẬP
          </Button>
        </div>

        <div className="button-container">
          <Button className="btn-create-account" type="primary" block>
            <Link to={"/sign-up"}>TẠO TÀI KHOẢN</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
