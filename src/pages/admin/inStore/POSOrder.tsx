import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  InputNumber,
  Modal,
  Space,
  Row,
  Col,
  Divider,
  Typography,
  Tag,
  message,
  AutoComplete,
  Descriptions,
  Badge,
  Form,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  CreditCardOutlined,
  PrinterOutlined,
  DeleteOutlined,
  PlusOutlined,
  GiftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

// Mock data
const mockProducts = [
  {
    id: 1,
    name: "Thức ăn cho chó vị bò",
    price: 120000,
    stockQuantity: 50,
    category: "Thức ăn",
  },
  {
    id: 2,
    name: "Thức ăn cho mèo vị cá hồi",
    price: 95000,
    stockQuantity: 70,
    category: "Thức ăn",
  },
  {
    id: 3,
    name: "Dây dắt chó màu đỏ",
    price: 45000,
    stockQuantity: 30,
    category: "Phụ kiện",
  },
  {
    id: 4,
    name: "Cát vệ sinh cho mèo 10L",
    price: 70000,
    stockQuantity: 40,
    category: "Vệ sinh",
  },
  {
    id: 5,
    name: "Bát ăn inox chống trượt",
    price: 35000,
    stockQuantity: 60,
    category: "Phụ kiện",
  },
];

const mockVouchers = [
  {
    id: 1,
    code: "DISCOUNT10",
    discountType: "Percentage",
    discountValue: 10,
    minOrderAmount: 50000,
  },
  {
    id: 2,
    code: "SAVE20K",
    discountType: "FixedAmount",
    discountValue: 20000,
    minOrderAmount: 100000,
  },
  {
    id: 3,
    code: "NEWCUST15",
    discountType: "Percentage",
    discountValue: 15,
    minOrderAmount: 30000,
  },
];

const mockCustomers = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "a@email.com",
    loyaltyPoints: 150,
  },
  {
    id: 2,
    fullName: "Trần Thị B",
    phone: "0902345678",
    email: "b@email.com",
    loyaltyPoints: 200,
  },
  {
    id: 3,
    fullName: "Lê Văn C",
    phone: "0903456789",
    email: "c@email.com",
    loyaltyPoints: 80,
  },
];

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface Order {
  id?: number;
  customerId?: number;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  finalAmount: number;
  voucherId?: number;
  voucherCode?: string;
  paymentMethod: string;
  status: string;
  notes?: string;
}

const POSOrder: React.FC = () => {
  const [form] = Form.useForm();
  const [currentOrder, setCurrentOrder] = useState<Order>({
    items: [],
    subtotal: 0,
    discountAmount: 0,
    finalAmount: 0,
    paymentMethod: "Cash",
    status: "Draft",
  });
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [productSearch, setProductSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [voucherSearch, setVoucherSearch] = useState("");
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [changeAmount, setChangeAmount] = useState<number>(0);

  useEffect(() => {
    const subtotal = currentOrder.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    let discountAmount = 0;

    if (selectedVoucher) {
      if (selectedVoucher.discountType === "Percentage") {
        discountAmount = (subtotal * selectedVoucher.discountValue) / 100;
      } else {
        discountAmount = selectedVoucher.discountValue;
      }
    }

    const finalAmount = subtotal - discountAmount;

    setCurrentOrder((prev) => ({
      ...prev,
      subtotal,
      discountAmount,
      finalAmount: Math.max(0, finalAmount),
    }));
  }, [currentOrder.items, selectedVoucher]);

  useEffect(() => {
    setChangeAmount(Math.max(0, receivedAmount - currentOrder.finalAmount));
  }, [receivedAmount, currentOrder.finalAmount]);

  const addProductToOrder = (product: any, quantity: number = 1) => {
    const existingItemIndex = currentOrder.items.findIndex(
      (item) => item.productId === product.id
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...currentOrder.items];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].totalPrice =
        updatedItems[existingItemIndex].quantity * product.price;

      setCurrentOrder((prev) => ({
        ...prev,
        items: updatedItems,
      }));
    } else {
      const newItem: OrderItem = {
        id: Date.now(),
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity,
        totalPrice: product.price * quantity,
      };

      setCurrentOrder((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
    }

    setProductSearch("");
    message.success(`Đã thêm ${product.name} vào đơn hàng`);
  };

  const updateItemQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemFromOrder(itemId);
      return;
    }

    const updatedItems = currentOrder.items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: item.price * newQuantity,
        };
      }
      return item;
    });

    setCurrentOrder((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const removeItemFromOrder = (itemId: number) => {
    const updatedItems = currentOrder.items.filter(
      (item) => item.id !== itemId
    );
    setCurrentOrder((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const applyVoucher = () => {
    const voucher = mockVouchers.find((v) => v.code === voucherSearch);
    if (!voucher) {
      message.error("Mã voucher không tồn tại");
      return;
    }

    if (currentOrder.subtotal < voucher.minOrderAmount) {
      message.error(
        `Đơn hàng tối thiểu ${voucher.minOrderAmount.toLocaleString()}đ để sử dụng voucher này`
      );
      return;
    }

    setSelectedVoucher(voucher);
    setCurrentOrder((prev) => ({
      ...prev,
      voucherId: voucher.id,
      voucherCode: voucher.code,
    }));
    message.success("Áp dụng voucher thành công");
  };

  const removeVoucher = () => {
    setSelectedVoucher(null);
    setCurrentOrder((prev) => ({
      ...prev,
      voucherId: undefined,
      voucherCode: undefined,
    }));
    setVoucherSearch("");
    message.success("Đã xóa voucher");
  };

  const processPayment = () => {
    if (currentOrder.items.length === 0) {
      message.error("Vui lòng thêm sản phẩm vào đơn hàng");
      return;
    }

    if (
      currentOrder.paymentMethod === "Cash" &&
      receivedAmount < currentOrder.finalAmount
    ) {
      message.error("Số tiền nhận không đủ");
      return;
    }

    const newOrder: Order = {
      ...currentOrder,
      id: Date.now(),
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.fullName,
      customerPhone: selectedCustomer?.phone,
      status: "Completed",
    };

    console.log("Đơn hàng đã tạo:", newOrder);

    message.success("Thanh toán thành công!");
    setPaymentModalVisible(false);

    resetOrder();
  };

  const resetOrder = () => {
    setCurrentOrder({
      items: [],
      subtotal: 0,
      discountAmount: 0,
      finalAmount: 0,
      paymentMethod: "Cash",
      status: "Draft",
    });
    setSelectedCustomer(null);
    setSelectedVoucher(null);
    setProductSearch("");
    setCustomerSearch("");
    setVoucherSearch("");
    setReceivedAmount(0);
    setChangeAmount(0);
  };

  const orderItemColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      width: "40%",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      width: "20%",
      render: (price: number) => `${price.toLocaleString()}đ`,
    },
    {
      title: "Số lượng",
      key: "quantity",
      width: "20%",
      render: (record: OrderItem) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => updateItemQuantity(record.id, value || 1)}
          size="small"
        />
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: "15%",
      render: (totalPrice: number) => `${totalPrice.toLocaleString()}đ`,
    },
    {
      title: "",
      key: "action",
      width: "5%",
      render: (record: OrderItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItemFromOrder(record.id)}
          size="small"
        />
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
        <ShoppingCartOutlined /> Xử Lý Đơn Hàng Tại Cửa Hàng
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title="Chọn Sản Phẩm" style={{ marginBottom: "24px" }}>
            <AutoComplete
              style={{ width: "100%" }}
              placeholder="Tìm kiếm sản phẩm..."
              value={productSearch}
              onChange={setProductSearch}
              options={mockProducts
                .filter((product) =>
                  product.name
                    .toLowerCase()
                    .includes(productSearch.toLowerCase())
                )
                .map((product) => ({
                  value: product.name,
                  label: (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{product.name}</span>
                      <span>{product.price.toLocaleString()}đ</span>
                    </div>
                  ),
                }))}
              onSelect={(value) => {
                const product = mockProducts.find((p) => p.name === value);
                if (product) {
                  addProductToOrder(product);
                }
              }}
            />

            <Row gutter={[8, 8]} style={{ marginTop: "16px" }}>
              {mockProducts.map((product) => (
                <Col key={product.id} xs={12} sm={8} md={6}>
                  <Card
                    hoverable
                    size="small"
                    onClick={() => addProductToOrder(product)}
                    style={{ textAlign: "center", cursor: "pointer" }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                      {product.name}
                    </div>
                    <div style={{ color: "#1890ff", fontSize: "14px" }}>
                      {product.price.toLocaleString()}đ
                    </div>
                    <div style={{ color: "#666", fontSize: "10px" }}>
                      Còn: {product.stockQuantity}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          <Card title="Đơn Hàng Hiện Tại">
            <Table
              dataSource={currentOrder.items}
              columns={orderItemColumns}
              pagination={false}
              rowKey="id"
              locale={{ emptyText: "Chưa có sản phẩm nào" }}
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title={
              <>
                <UserOutlined /> Thông Tin Khách Hàng
              </>
            }
            style={{ marginBottom: "16px" }}
          >
            <AutoComplete
              style={{ width: "100%" }}
              placeholder="Tìm kiếm khách hàng (tên hoặc SĐT)..."
              value={customerSearch}
              onChange={setCustomerSearch}
              options={mockCustomers
                .filter(
                  (customer) =>
                    customer.fullName
                      .toLowerCase()
                      .includes(customerSearch.toLowerCase()) ||
                    customer.phone.includes(customerSearch)
                )
                .map((customer) => ({
                  value: `${customer.fullName} - ${customer.phone}`,
                  label: (
                    <div>
                      <div>{customer.fullName}</div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {customer.phone} - {customer.loyaltyPoints} điểm
                      </div>
                    </div>
                  ),
                }))}
              onSelect={(value) => {
                const customer = mockCustomers.find(
                  (c) => `${c.fullName} - ${c.phone}` === value
                );
                if (customer) {
                  setSelectedCustomer(customer);
                  setCustomerSearch(customer.fullName);
                }
              }}
            />

            {selectedCustomer && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "8px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "4px",
                }}
              >
                <Text strong>{selectedCustomer.fullName}</Text>
                <br />
                <Text type="secondary">{selectedCustomer.phone}</Text>
                <br />
                <Text type="secondary">
                  Điểm tích lũy: {selectedCustomer.loyaltyPoints}
                </Text>
              </div>
            )}
          </Card>

          <Card
            title={
              <>
                <GiftOutlined /> Voucher
              </>
            }
            style={{ marginBottom: "16px" }}
          >
            <Space.Compact style={{ width: "100%" }}>
              <Input
                placeholder="Nhập mã voucher"
                value={voucherSearch}
                onChange={(e) => setVoucherSearch(e.target.value)}
              />
              <Button type="primary" onClick={applyVoucher}>
                Áp dụng
              </Button>
            </Space.Compact>

            {selectedVoucher && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "8px",
                  backgroundColor: "#e6f7ff",
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Tag color="blue">{selectedVoucher.code}</Tag>
                    <Text>
                      Giảm{" "}
                      {selectedVoucher.discountType === "Percentage"
                        ? `${selectedVoucher.discountValue}%`
                        : `${selectedVoucher.discountValue.toLocaleString()}đ`}
                    </Text>
                  </div>
                  <Button size="small" onClick={removeVoucher}>
                    Xóa
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Card title="Tổng Tiền">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Tạm tính">
                {currentOrder.subtotal.toLocaleString()}đ
              </Descriptions.Item>
              <Descriptions.Item label="Giảm giá">
                -{currentOrder.discountAmount.toLocaleString()}đ
              </Descriptions.Item>
              <Descriptions.Item label="Thành tiền">
                <Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
                  {currentOrder.finalAmount.toLocaleString()}đ
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div style={{ marginBottom: "16px" }}>
              <div style={{ marginBottom: "8px" }}>
                <Text>Phương thức thanh toán:</Text>
              </div>
              <Select
                style={{ width: "100%" }}
                value={currentOrder.paymentMethod}
                onChange={(value) =>
                  setCurrentOrder((prev) => ({ ...prev, paymentMethod: value }))
                }
              >
                <Option value="Cash">Tiền mặt</Option>
                <Option value="Card">Thẻ</Option>
                <Option value="Transfer">Chuyển khoản</Option>
              </Select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ marginBottom: "8px" }}>
                <Text>Ghi chú:</Text>
              </div>
              <Input.TextArea
                rows={2}
                placeholder="Ghi chú đơn hàng..."
                value={currentOrder.notes}
                onChange={(e) =>
                  setCurrentOrder((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
              />
            </div>

            <Space style={{ width: "100%", marginTop: "16px" }}>
              <Button
                type="primary"
                size="large"
                icon={<CreditCardOutlined />}
                onClick={() => setPaymentModalVisible(true)}
                disabled={currentOrder.items.length === 0}
                style={{ flex: 1 }}
              >
                Thanh Toán
              </Button>
              <Button onClick={resetOrder}>Hủy</Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Xác Nhận Thanh Toán"
        open={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setPaymentModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="confirm" type="primary" onClick={processPayment}>
            Xác Nhận Thanh Toán
          </Button>,
        ]}
        width={600}
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Tổng tiền">
            <Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
              {currentOrder.finalAmount.toLocaleString()}đ
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            <Badge status="processing" text={currentOrder.paymentMethod} />
          </Descriptions.Item>
          {selectedCustomer && (
            <Descriptions.Item label="Khách hàng">
              {selectedCustomer.fullName} - {selectedCustomer.phone}
            </Descriptions.Item>
          )}
        </Descriptions>

        {currentOrder.paymentMethod === "Cash" && (
          <div style={{ marginTop: "16px" }}>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ marginBottom: "8px" }}>
                <Text>Tiền khách đưa:</Text>
              </div>
              <InputNumber
                style={{ width: "100%" }}
                value={receivedAmount}
                onChange={(value) => setReceivedAmount(value || 0)}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                // parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                placeholder="Nhập số tiền khách đưa"
                size="large"
              />
            </div>
            <div style={{ marginBottom: "8px" }}>
              <Text>Tiền thừa:</Text>
            </div>
            <Text
              style={{
                fontSize: "16px",
                color: changeAmount >= 0 ? "#52c41a" : "#ff4d4f",
              }}
            >
              {changeAmount.toLocaleString()}đ
            </Text>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default POSOrder;
