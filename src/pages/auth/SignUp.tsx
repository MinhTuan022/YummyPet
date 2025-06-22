import { Button, Card, Form, Input, Space, Typography } from "antd";
import { Link } from "react-router-dom";
import "./SignUp.scss";
import images from "../../res/images";
import { _request } from "../../network/Api";
import { _router } from "../../context/routerSingleton";
import { _global } from "../../global";

const { Title, Text } = Typography;
const SignUp = () => {
  const [form] = Form.useForm();

  const handleRegister = (values: any) => {
    console.log(values);
    _request({
      path: "/auth/register",
      method: "POST",
      body: {
        username: values.email,
        password: values.password,
        email: values.email,
        fullName: values.fullName,
        phone: values.phone,
      },
      onSuccess: (data) => {
        _global.event.alert.current?.show({
          message: "Đăng ký thành công! Hãy đăng nhập tài khoản của bạn.",
          type: "success",
        });
        _router.openLogin();
      },
      onError: (err) => {
        console.error("Đăng nhập thất bại:", err.message || err);
        _global.event.alert.current?.show({
          message: err.message || err,
          type: "warning",
        });
      },
    });
  };
  return (
    <div className="screen">
      <div className="thumbnail">
        <img src={images.thumbnail} alt="" />
      </div>
      <Card className="card">
        <div className="text-center">
          <Title className="title" level={2}>
            ĐĂNG KÝ
          </Title>
        </div>
        <Form onFinish={handleRegister} layout="vertical" form={form} size="large">
          <Form.Item
            name={"fullName"}
            rules={[
              {
                required: true,
                message: "Hãy nhập tên của bạn!",
              },
            ]}
          >
            <Input placeholder="Tên đầy đủ" allowClear className="custom-input" />
          </Form.Item>
          
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
            name={"phone"}
            rules={[
              {
                required: true,
                message: "Hãy nhập số điện thoại của bạn!",
              },
            ]}
          >
            <Input placeholder="Số điện thoại" allowClear className="custom-input" />
          </Form.Item>
          <Form.Item
            name={"username"}
            rules={[
              {
                required: true,
                message: "Hãy nhập username của bạn!",
              },
            ]}
          >
            <Input placeholder="Username" allowClear className="custom-input" />
          </Form.Item>
          <Form.Item
            name={"password"}
            rules={[
              {
                required: true,
                message: "Hãy nhập mật khẩu của bạn!",
              },
              () => ({
                validator: (_, value) => {
                  if (value.length < 6) {
                    return Promise.reject(
                      new Error("Mật khẩu phải chứa ít nhất 6 ký tự!")
                    );
                  } else {
                    return Promise.resolve();
                  }
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Mật khẩu"
              maxLength={100}
              className="custom-input"
            />
          </Form.Item>
        </Form>
        <div className="button-container">
          <Button
            className="btn-signin"
            onClick={() => form.submit()}
            type="primary"
            size="large"
            block
          >
            TẠO TÀI KHOẢN
          </Button>
        </div>
        <div className="mt-4 text-center">
          <Space>
            <Text strong={true} type="secondary">
              {" "}
              Đã có tài khoản?
            </Text>
            <Link className="login-link" to={"/"}>
              Đăng nhập
            </Link>
          </Space>
        </div>
      </Card>
    </div>
  );
};
export default SignUp;
