import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  InputNumber,
  Table,
  Modal,
  notification,
  Row,
  Col,
  Divider,
  Tag,
  Space,
  Typography,
  Steps,
  Descriptions,
  Radio,
  Checkbox,
  Alert,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  UserAddOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { Title, Text } = Typography;
const { Step } = Steps;

// Mock data based on database schema
const mockServices = [
  {
    id: 1,
    name: "Tắm cho chó",
    price: 100000,
    durationMinutes: 60,
    isActive: true,
  },
  {
    id: 2,
    name: "Cắt tỉa lông",
    price: 150000,
    durationMinutes: 90,
    isActive: true,
  },
  {
    id: 3,
    name: "Chăm sóc móng",
    price: 50000,
    durationMinutes: 30,
    isActive: true,
  },
  {
    id: 4,
    name: "Vệ sinh tai",
    price: 80000,
    durationMinutes: 45,
    isActive: true,
  },
  {
    id: 5,
    name: "Spa thú cưng",
    price: 300000,
    durationMinutes: 120,
    isActive: true,
  },
];

const mockCustomers = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    phone: "0123456789",
    email: "vana@email.com",
  },
  {
    id: 2,
    fullName: "Trần Thị B",
    phone: "0987654321",
    email: "thib@email.com",
  },
  { id: 3, fullName: "Lê Văn C", phone: "0369852147", email: "vanc@email.com" },
];

const mockPets = [
  {
    id: 1,
    customerId: 1,
    fullName: "Lucky",
    breed: "Golden Retriever",
    ageMonths: 24,
    gender: "Male",
  },
  {
    id: 2,
    customerId: 1,
    fullName: "Mimi",
    breed: "Persian Cat",
    ageMonths: 18,
    gender: "Female",
  },
  {
    id: 3,
    customerId: 2,
    fullName: "Max",
    breed: "Poodle",
    ageMonths: 36,
    gender: "Male",
  },
];

interface ServiceOrderItem {
  serviceId: number;
  serviceName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface GuestCustomerInfo {
  fullName: string;
  phone: string;
  email?: string;
}

interface GuestPetInfo {
  fullName: string;
  breed: string;
  ageMonths: number;
  gender: string;
  weight?: number;
  specialNotes?: string;
}

interface OrderData {
  customerId?: number;
  petId?: number;
  guestCustomer?: GuestCustomerInfo;
  guestPet?: GuestPetInfo;
  services: ServiceOrderItem[];
  totalAmount: number;
  notes: string;
  appointmentDate: dayjs.Dayjs;
  createAccount: boolean;
}

const POSService: React.FC = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [customerType, setCustomerType] = useState<"existing" | "guest">(
    "existing"
  );
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [guestCustomerInfo, setGuestCustomerInfo] =
    useState<GuestCustomerInfo | null>(null);
  const [guestPetInfo, setGuestPetInfo] = useState<GuestPetInfo | any>();
  const [orderItems, setOrderItems] = useState<ServiceOrderItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerPets, setCustomerPets] = useState<any[]>([]);
  const [createAccount, setCreateAccount] = useState(false);

  useEffect(() => {
    const total = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalAmount(total);
  }, [orderItems]);

  useEffect(() => {
    if (selectedCustomer && customerType === "existing") {
      const pets = mockPets.filter(
        (pet) => pet.customerId === selectedCustomer.id
      );
      setCustomerPets(pets);
    } else {
      setCustomerPets([]);
    }
  }, [selectedCustomer, customerType]);

  const handleCustomerTypeChange = (type: "existing" | "guest") => {
    setCustomerType(type);
    setSelectedCustomer(null);
    setSelectedPet(null);
    setGuestCustomerInfo(null);
    setGuestPetInfo(null);
    setCreateAccount(false);
    form.resetFields([
      "customerId",
      "petId",
      "guestFullName",
      "guestPhone",
      "guestEmail",
      "petName",
      "petBreed",
      "petAge",
      "petGender",
      "petWeight",
      "petNotes",
    ]);
  };

  const handleCustomerSelect = (customerId: number) => {
    const customer = mockCustomers.find((c) => c.id === customerId);
    setSelectedCustomer(customer);
    setSelectedPet(null);
    form.setFieldsValue({ petId: undefined });
  };

  const handlePetSelect = (petId: number) => {
    const pet = customerPets.find((p) => p.id === petId);
    setSelectedPet(pet);
  };

  const handleGuestInfoChange = () => {
    const values = form.getFieldsValue();
    if (values.guestFullName && values.guestPhone) {
      setGuestCustomerInfo({
        fullName: values.guestFullName,
        phone: values.guestPhone,
        email: values.guestEmail,
      });
    }
  };

  const handleGuestPetInfoChange = () => {
    const values = form.getFieldsValue();
    if (
      values.petName &&
      values.petBreed &&
      values.petAge &&
      values.petGender
    ) {
      setGuestPetInfo({
        fullName: values.petName,
        breed: values.petBreed,
        ageMonths: values.petAge,
        gender: values.petGender,
        weight: values.petWeight,
        specialNotes: values.petNotes,
      });
    }
  };

  const addServiceToOrder = (serviceId: number) => {
    const service = mockServices.find((s) => s.id === serviceId);
    if (!service) return;

    const existingItem = orderItems.find(
      (item) => item.serviceId === serviceId
    );

    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.serviceId === serviceId
            ? {
                ...item,
                quantity: item.quantity + 1,
                totalPrice: (item.quantity + 1) * item.price,
              }
            : item
        )
      );
    } else {
      const newItem: ServiceOrderItem = {
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
        quantity: 1,
        totalPrice: service.price,
      };
      setOrderItems([...orderItems, newItem]);
    }
  };

  const updateItemQuantity = (serviceId: number, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems(orderItems.filter((item) => item.serviceId !== serviceId));
    } else {
      setOrderItems(
        orderItems.map((item) =>
          item.serviceId === serviceId
            ? { ...item, quantity, totalPrice: quantity * item.price }
            : item
        )
      );
    }
  };

  const removeServiceFromOrder = (serviceId: number) => {
    setOrderItems(orderItems.filter((item) => item.serviceId !== serviceId));
  };

  const validateStep1 = () => {
    if (customerType === "existing") {
      return selectedCustomer && selectedPet;
    } else {
      return guestCustomerInfo && guestPetInfo;
    }
  };

  const handleSubmitOrder = async (values: any) => {
    if (!validateStep1() || orderItems.length === 0) {
      notification.error({
        message: "Lỗi",
        description:
          "Vui lòng điền đầy đủ thông tin khách hàng, thú cưng và dịch vụ",
      });
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const orderData: OrderData = {
        services: orderItems,
        totalAmount,
        notes: values.notes || "",
        appointmentDate: values.appointmentDate,
        createAccount: customerType === "guest" ? createAccount : false,
      };

      if (customerType === "existing") {
        orderData.customerId = selectedCustomer.id;
        orderData.petId = selectedPet.id;
      } else {
        orderData.guestCustomer = guestCustomerInfo!;
        orderData.guestPet = guestPetInfo!;
      }

      console.log("Order submitted:", orderData);

      let successMessage = "Đơn hàng đã được tạo thành công!";
      if (customerType === "guest" && createAccount) {
        successMessage += " Tài khoản khách hàng đã được tạo để tích điểm.";
      }

      notification.success({
        message: "Thành công",
        description: successMessage,
      });

      form.resetFields();
      setSelectedCustomer(null);
      setSelectedPet(null);
      setGuestCustomerInfo(null);
      setGuestPetInfo(null);
      setOrderItems([]);
      setCurrentStep(0);
      setCustomerType("existing");
      setCreateAccount(false);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi tạo đơn hàng",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const serviceColumns = [
    {
      title: "Dịch vụ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      title: "Thời gian",
      dataIndex: "durationMinutes",
      key: "duration",
      render: (minutes: number) => `${minutes} phút`,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: any) => (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => addServiceToOrder(record.id)}
        >
          Thêm
        </Button>
      ),
    },
  ];

  const orderItemColumns = [
    {
      title: "Dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number, record: ServiceOrderItem) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => updateItemQuantity(record.serviceId, value || 1)}
          style={{ width: 80 }}
        />
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (total: number) => (
        <Text strong>{total.toLocaleString("vi-VN")} VNĐ</Text>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: ServiceOrderItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeServiceFromOrder(record.serviceId)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  const steps = [
    {
      title: "Thông tin khách hàng",
      icon: <UserOutlined />,
    },
    {
      title: "Chọn dịch vụ",
      icon: <ShoppingCartOutlined />,
    },
    {
      title: "Xác nhận đơn hàng",
      icon: <CheckCircleOutlined />,
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Card>
        <Title level={2}>
          <ShoppingCartOutlined /> Xử Lý Đơn Hàng Dịch Vụ Thú Cưng
        </Title>

        <Steps current={currentStep} style={{ marginBottom: 32 }}>
          {steps.map((step, index) => (
            <Step key={index} title={step.title} icon={step.icon} />
          ))}
        </Steps>

        <Form form={form} layout="vertical" onFinish={handleSubmitOrder}>
          {currentStep === 0 && (
            <>
              <Card
                title="Loại Khách Hàng"
                size="small"
                style={{ marginBottom: 16 }}
              >
                <Radio.Group
                  value={customerType}
                  onChange={(e) => handleCustomerTypeChange(e.target.value)}
                  style={{ width: "100%" }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Radio.Button
                        value="existing"
                        style={{ width: "100%", textAlign: "center" }}
                      >
                        <UserOutlined /> Khách hàng có tài khoản
                      </Radio.Button>
                    </Col>
                    <Col span={12}>
                      <Radio.Button
                        value="guest"
                        style={{ width: "100%", textAlign: "center" }}
                      >
                        <UserAddOutlined /> Khách hàng vãng lai
                      </Radio.Button>
                    </Col>
                  </Row>
                </Radio.Group>
              </Card>

              {customerType === "existing" ? (
                <Row gutter={24}>
                  <Col span={12}>
                    <Card title="Chọn Khách Hàng" size="small">
                      <Form.Item
                        name="customerId"
                        label="Khách hàng"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn khách hàng",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Chọn khách hàng"
                          onChange={handleCustomerSelect}
                          showSearch
                          filterOption={(input, option: any) =>
                            option?.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {mockCustomers.map((customer) => (
                            <Option key={customer.id} value={customer.id}>
                              {customer.fullName} - {customer.phone}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>

                      {selectedCustomer && (
                        <Descriptions size="small" column={1}>
                          <Descriptions.Item label="Tên">
                            {selectedCustomer.fullName}
                          </Descriptions.Item>
                          <Descriptions.Item label="SĐT">
                            {selectedCustomer.phone}
                          </Descriptions.Item>
                          <Descriptions.Item label="Email">
                            {selectedCustomer.email}
                          </Descriptions.Item>
                        </Descriptions>
                      )}
                    </Card>
                  </Col>

                  <Col span={12}>
                    <Card title="Chọn Thú Cưng" size="small">
                      <Form.Item
                        name="petId"
                        label="Thú cưng"
                        rules={[
                          { required: true, message: "Vui lòng chọn thú cưng" },
                        ]}
                      >
                        <Select
                          placeholder="Chọn thú cưng"
                          onChange={handlePetSelect}
                          disabled={!selectedCustomer}
                        >
                          {customerPets.map((pet) => (
                            <Option key={pet.id} value={pet.id}>
                              {pet.fullName} - {pet.breed}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>

                      {selectedPet && (
                        <Descriptions size="small" column={1}>
                          <Descriptions.Item label="Tên">
                            {selectedPet.fullName}
                          </Descriptions.Item>
                          <Descriptions.Item label="Giống">
                            {selectedPet.breed}
                          </Descriptions.Item>
                          <Descriptions.Item label="Tuổi">
                            {Math.floor(selectedPet.ageMonths / 12)} năm{" "}
                            {selectedPet.ageMonths % 12} tháng
                          </Descriptions.Item>
                          <Descriptions.Item label="Giới tính">
                            <Tag
                              color={
                                selectedPet.gender === "Male" ? "blue" : "pink"
                              }
                            >
                              {selectedPet.gender === "Male" ? "Đực" : "Cái"}
                            </Tag>
                          </Descriptions.Item>
                        </Descriptions>
                      )}
                    </Card>
                  </Col>
                </Row>
              ) : (
                <Row gutter={24}>
                  <Col span={12}>
                    <Card title="Thông Tin Khách Hàng Vãng Lai" size="small">
                      <Form.Item
                        name="guestFullName"
                        label="Họ và tên"
                        rules={[
                          { required: true, message: "Vui lòng nhập họ tên" },
                        ]}
                      >
                        <Input
                          placeholder="Nhập họ và tên"
                          prefix={<UserOutlined />}
                          onChange={handleGuestInfoChange}
                        />
                      </Form.Item>

                      <Form.Item
                        name="guestPhone"
                        label="Số điện thoại"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại",
                          },
                          {
                            pattern: /^[0-9]{10,11}$/,
                            message: "Số điện thoại không hợp lệ",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập số điện thoại"
                          prefix={<PhoneOutlined />}
                          onChange={handleGuestInfoChange}
                        />
                      </Form.Item>

                      <Form.Item name="guestEmail" label="Email (tùy chọn)">
                        <Input
                          placeholder="Nhập email"
                          prefix={<MailOutlined />}
                          onChange={handleGuestInfoChange}
                        />
                      </Form.Item>

                      <Alert
                        message="Tích điểm và ưu đãi"
                        description={
                          <div>
                            <Checkbox
                              checked={createAccount}
                              onChange={(e) =>
                                setCreateAccount(e.target.checked)
                              }
                            >
                              Tạo tài khoản để tích điểm và nhận ưu đãi
                            </Checkbox>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#666",
                                marginTop: "4px",
                              }}
                            >
                              Tài khoản sẽ được tạo tự động sau khi hoàn thành
                              đơn hàng
                            </div>
                          </div>
                        }
                        type="info"
                        showIcon
                        style={{ marginTop: 16 }}
                      />
                    </Card>
                  </Col>

                  <Col span={12}>
                    <Card title="Thông Tin Thú Cưng" size="small">
                      <Form.Item
                        name="petName"
                        label="Tên thú cưng"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên thú cưng",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập tên thú cưng"
                          onChange={handleGuestPetInfoChange}
                        />
                      </Form.Item>

                      <Form.Item
                        name="petBreed"
                        label="Giống"
                        rules={[
                          { required: true, message: "Vui lòng nhập giống" },
                        ]}
                      >
                        <Input
                          placeholder="VD: Golden Retriever, Persian Cat"
                          onChange={handleGuestPetInfoChange}
                        />
                      </Form.Item>

                      <Row gutter={12}>
                        <Col span={12}>
                          <Form.Item
                            name="petAge"
                            label="Tuổi (tháng)"
                            rules={[
                              { required: true, message: "Vui lòng nhập tuổi" },
                            ]}
                          >
                            <InputNumber
                              placeholder="Tuổi"
                              min={1}
                              max={300}
                              style={{ width: "100%" }}
                              onChange={handleGuestPetInfoChange}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="petGender"
                            label="Giới tính"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn giới tính",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Chọn giới tính"
                              onChange={handleGuestPetInfoChange}
                            >
                              <Option value="Male">Đực</Option>
                              <Option value="Female">Cái</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item name="petWeight" label="Cân nặng (kg)">
                        <InputNumber
                          placeholder="Cân nặng"
                          min={0.1}
                          max={100}
                          step={0.1}
                          style={{ width: "100%" }}
                          onChange={handleGuestPetInfoChange}
                        />
                      </Form.Item>

                      <Form.Item name="petNotes" label="Ghi chú đặc biệt">
                        <Input.TextArea
                          placeholder="VD: Sợ tiếng ồn, có dị ứng..."
                          rows={2}
                          onChange={handleGuestPetInfoChange}
                        />
                      </Form.Item>
                    </Card>
                  </Col>
                </Row>
              )}

              <Col span={24} style={{ textAlign: "right", marginTop: 16 }}>
                <Button
                  type="primary"
                  onClick={() => setCurrentStep(1)}
                  disabled={!validateStep1()}
                >
                  Tiếp theo
                </Button>
              </Col>
            </>
          )}

          {currentStep === 1 && (
            <Row gutter={24}>
              <Col span={14}>
                <Card title="Danh Sách Dịch Vụ" size="small">
                  <Table
                    dataSource={mockServices.filter((s) => s.isActive)}
                    columns={serviceColumns}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>

              <Col span={10}>
                <Card title="Dịch Vụ Đã Chọn" size="small">
                  <Table
                    dataSource={orderItems}
                    columns={orderItemColumns}
                    rowKey="serviceId"
                    pagination={false}
                    size="small"
                    summary={() => (
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={3}>
                          <Text strong>Tổng cộng:</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          <Text strong style={{ color: "#f50", fontSize: 16 }}>
                            {totalAmount.toLocaleString("vi-VN")} VNĐ
                          </Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2} />
                      </Table.Summary.Row>
                    )}
                  />
                </Card>
              </Col>

              <Col span={24} style={{ textAlign: "right", marginTop: 16 }}>
                <Space>
                  <Button onClick={() => setCurrentStep(0)}>Quay lại</Button>
                  <Button
                    type="primary"
                    onClick={() => setCurrentStep(2)}
                    disabled={orderItems.length === 0}
                  >
                    Tiếp theo
                  </Button>
                </Space>
              </Col>
            </Row>
          )}

          {currentStep === 2 && (
            <Row gutter={24}>
              <Col span={16}>
                <Card title="Xác Nhận Đơn Hàng">
                  <Descriptions
                    title="Thông tin khách hàng"
                    bordered
                    size="small"
                    column={2}
                  >
                    <Descriptions.Item label="Khách hàng">
                      {customerType === "existing"
                        ? selectedCustomer?.fullName
                        : guestCustomerInfo?.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item label="SĐT">
                      {customerType === "existing"
                        ? selectedCustomer?.phone
                        : guestCustomerInfo?.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại khách hàng">
                      <Tag
                        color={customerType === "existing" ? "blue" : "green"}
                      >
                        {customerType === "existing"
                          ? "Có tài khoản"
                          : "Vãng lai"}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {customerType === "existing"
                        ? selectedCustomer?.email
                        : guestCustomerInfo?.email || "Không có"}
                    </Descriptions.Item>
                  </Descriptions>

                  <Descriptions
                    title="Thông tin thú cưng"
                    bordered
                    size="small"
                    column={2}
                    style={{ marginTop: 16 }}
                  >
                    <Descriptions.Item label="Tên">
                      {customerType === "existing"
                        ? selectedPet?.fullName
                        : guestPetInfo?.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Giống">
                      {customerType === "existing"
                        ? selectedPet?.breed
                        : guestPetInfo?.breed}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tuổi">
                      {customerType === "existing"
                        ? `${Math.floor(selectedPet?.ageMonths / 12)} năm ${
                            selectedPet?.ageMonths % 12
                          } tháng`
                        : `${Math.floor(guestPetInfo?.ageMonths / 12)} năm ${
                            guestPetInfo?.ageMonths % 12
                          } tháng`}
                    </Descriptions.Item>
                    <Descriptions.Item label="Giới tính">
                      <Tag
                        color={
                          (customerType === "existing"
                            ? selectedPet?.gender
                            : guestPetInfo?.gender) === "Male"
                            ? "blue"
                            : "pink"
                        }
                      >
                        {(customerType === "existing"
                          ? selectedPet?.gender
                          : guestPetInfo?.gender) === "Male"
                          ? "Đực"
                          : "Cái"}
                      </Tag>
                    </Descriptions.Item>
                    {customerType === "guest" && guestPetInfo?.weight && (
                      <Descriptions.Item label="Cân nặng">
                        {guestPetInfo.weight} kg
                      </Descriptions.Item>
                    )}
                    {customerType === "guest" && guestPetInfo?.specialNotes && (
                      <Descriptions.Item label="Ghi chú đặc biệt" span={2}>
                        {guestPetInfo.specialNotes}
                      </Descriptions.Item>
                    )}
                  </Descriptions>

                  {customerType === "guest" && createAccount && (
                    <Alert
                      message="Tạo tài khoản"
                      description="Hệ thống sẽ tự động tạo tài khoản cho khách hàng để tích điểm và nhận ưu đãi."
                      type="success"
                      showIcon
                      style={{ marginTop: 16 }}
                    />
                  )}

                  <Divider />

                  <Title level={4}>Chi tiết dịch vụ</Title>
                  <Table
                    dataSource={orderItems}
                    columns={[
                      {
                        title: "Dịch vụ",
                        dataIndex: "serviceName",
                        key: "serviceName",
                      },
                      {
                        title: "SL",
                        dataIndex: "quantity",
                        key: "quantity",
                        width: 60,
                      },
                      {
                        title: "Thành tiền",
                        dataIndex: "totalPrice",
                        key: "totalPrice",
                        render: (total: number) =>
                          `${total.toLocaleString("vi-VN")} VNĐ`,
                      },
                    ]}
                    rowKey="serviceId"
                    pagination={false}
                    size="small"
                    summary={() => (
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}>
                          <Text strong>Tổng tiền:</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1} />
                        <Table.Summary.Cell index={2}>
                          <Text strong style={{ color: "#f50", fontSize: 16 }}>
                            {totalAmount.toLocaleString("vi-VN")} VNĐ
                          </Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    )}
                  />
                </Card>
              </Col>

              <Col span={8}>
                <Card title="Thông tin bổ sung">
                  <Form.Item
                    name="appointmentDate"
                    label="Ngày hẹn"
                    rules={[
                      { required: true, message: "Vui lòng chọn ngày hẹn" },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder="Chọn ngày hẹn"
                      disabledDate={(current) =>
                        current && current < dayjs().startOf("day")
                      }
                    />
                  </Form.Item>

                  <Form.Item name="notes" label="Ghi chú">
                    <Input.TextArea
                      rows={4}
                      placeholder="Ghi chú thêm về dịch vụ..."
                    />
                  </Form.Item>

                  {customerType === "guest" && (
                    <Alert
                      message="Thông tin quan trọng"
                      description={
                        createAccount
                          ? "Tài khoản sẽ được tạo với thông tin đã nhập. Mật khẩu sẽ được gửi qua SMS."
                          : "Khách hàng vãng lai sẽ không được tích điểm cho đơn hàng này."
                      }
                      type={createAccount ? "info" : "warning"}
                      showIcon
                      style={{ marginBottom: 16 }}
                    />
                  )}
                </Card>
              </Col>

              <Col span={24} style={{ textAlign: "right", marginTop: 16 }}>
                <Space>
                  <Button onClick={() => setCurrentStep(1)}>Quay lại</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isProcessing}
                    size="large"
                  >
                    {customerType === "guest" && createAccount
                      ? "Tạo Tài Khoản & Đơn Hàng"
                      : "Tạo Đơn Hàng"}
                  </Button>
                </Space>
              </Col>
            </Row>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default POSService;
