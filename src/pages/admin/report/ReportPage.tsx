import {
  DollarOutlined,
  ShopOutlined,
  ShoppingCartOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import "./ReportPage.scss";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const mockData = {
  orders: [
    {
      id: 1,
      createdAt: "2024-06-01",
      customerName: "Nguyễn Văn A",
      totalAmount: 1500000,
      status: "completed",
      paymentMethod: "credit_card",
      items: [
        {
          productName: "Thức ăn cho chó Golden",
          quantity: 2,
          unitPrice: 500000,
        },
        { productName: "Đồ chơi cho mèo", quantity: 1, unitPrice: 500000 },
      ],
    },
    {
      id: 2,
      createdAt: "2024-06-02",
      customerName: "Trần Thị B",
      totalAmount: 2000000,
      status: "completed",
      paymentMethod: "cash",
      items: [
        { productName: "Chuồng chó size L", quantity: 1, unitPrice: 2000000 },
      ],
    },
    {
      id: 3,
      createdAt: "2024-06-03",
      customerName: "Lê Văn C",
      totalAmount: 800000,
      status: "pending",
      paymentMethod: "bank_transfer",
      items: [
        { productName: "Thức ăn cho mèo", quantity: 2, unitPrice: 300000 },
        { productName: "Cát vệ sinh", quantity: 1, unitPrice: 200000 },
      ],
    },
    {
      id: 4,
      createdAt: "2024-05-15",
      customerName: "Phạm Thị D",
      totalAmount: 1200000,
      status: "completed",
      paymentMethod: "credit_card",
      items: [
        { productName: "Vitamin cho chó", quantity: 3, unitPrice: 400000 },
      ],
    },
    {
      id: 5,
      createdAt: "2024-04-20",
      customerName: "Hoàng Văn E",
      totalAmount: 3000000,
      status: "completed",
      paymentMethod: "bank_transfer",
      items: [
        { productName: "Chuồng mèo cao cấp", quantity: 1, unitPrice: 3000000 },
      ],
    },
  ],
  services: [
    {
      id: 1,
      name: "Tắm rửa cho chó",
      price: 200000,
      bookings: 15,
      revenue: 3000000,
    },
    {
      id: 2,
      name: "Cắt tỉa lông",
      price: 150000,
      bookings: 12,
      revenue: 1800000,
    },
    {
      id: 3,
      name: "Khám sức khỏe",
      price: 300000,
      bookings: 8,
      revenue: 2400000,
    },
    {
      id: 4,
      name: "Spa thú cưng",
      price: 500000,
      bookings: 6,
      revenue: 3000000,
    },
  ],
  customers: [
    {
      id: 1,
      name: "Nguyễn Văn A",
      phone: "0901234567",
      totalOrders: 5,
      totalSpent: 7500000,
    },
    {
      id: 2,
      name: "Trần Thị B",
      phone: "0912345678",
      totalOrders: 3,
      totalSpent: 4500000,
    },
    {
      id: 3,
      name: "Lê Văn C",
      phone: "0923456789",
      totalOrders: 2,
      totalSpent: 2800000,
    },
    {
      id: 4,
      name: "Phạm Thị D",
      phone: "0934567890",
      totalOrders: 4,
      totalSpent: 6200000,
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      phone: "0945678901",
      totalOrders: 1,
      totalSpent: 3000000,
    },
  ],
  products: [
    {
      id: 1,
      name: "Thức ăn cho chó Golden",
      category: "Thức ăn",
      stock: 50,
      price: 500000,
      sold: 25,
    },
    {
      id: 2,
      name: "Đồ chơi cho mèo",
      category: "Phụ kiện",
      stock: 30,
      price: 500000,
      sold: 15,
    },
    {
      id: 3,
      name: "Chuồng chó size L",
      category: "Phụ kiện",
      stock: 10,
      price: 2000000,
      sold: 5,
    },
    {
      id: 4,
      name: "Vitamin cho chó",
      category: "Y tế",
      stock: 40,
      price: 400000,
      sold: 20,
    },
    {
      id: 5,
      name: "Cát vệ sinh",
      category: "Vệ sinh",
      stock: 25,
      price: 200000,
      sold: 35,
    },
  ],
};

const ReportPage = () => {
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(1, "month"),
    dayjs(),
  ]);
  const [reportType, setReportType] = useState("sales");
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));
  const reportRef = useRef(null);

  const handleExportPDF = () => {
    const element = reportRef.current;
    if (element) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Báo cáo cửa hàng thú cưng</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              .report-header { text-align: center; margin-bottom: 40px; }
              .report-section { margin-bottom: 40px; }
              .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
              .stat-card { border: 1px solid #ddd; padding: 20px; text-align: center; border-radius: 8px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              th, td { border: 1px solid #ddd; padding: 12px 8px; text-align: left; }
              th { background-color: #1890ff; color: white; font-weight: 600; }
              tr:nth-child(even) { background-color: #f9f9f9; }
              .section-title { color: #1890ff; font-size: 18px; font-weight: 600; margin-bottom: 20px; border-bottom: 2px solid #1890ff; padding-bottom: 8px; }
              .report-footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getFilteredData = () => {
    if (!dateRange || dateRange.length !== 2) return mockData;

    const startDate = dateRange[0].format("YYYY-MM-DD");
    const endDate = dateRange[1].format("YYYY-MM-DD");

    const filteredOrders = mockData.orders.filter(
      (order) => order.createdAt >= startDate && order.createdAt <= endDate
    );

    return {
      ...mockData,
      orders: filteredOrders,
    };
  };

  const filteredData = getFilteredData();

  const totalRevenue = filteredData.orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );
  const totalOrders = filteredData.orders.length;
  const completedOrders = filteredData.orders.filter(
    (order) => order.status === "completed"
  ).length;
  const totalServices = mockData.services.reduce(
    (sum, service) => sum + service.bookings,
    0
  );

  const orderColumns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "completed" ? "green" : "orange"}>
          {status === "completed" ? "Hoàn thành" : "Đang xử lý"}
        </Tag>
      ),
    },
  ];

  const customerColumns = [
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Tổng đơn hàng",
      dataIndex: "totalOrders",
      key: "totalOrders",
    },
    {
      title: "Tổng chi tiêu",
      dataIndex: "totalSpent",
      key: "totalSpent",
      render: (amount) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount),
    },
  ];
  const [selectedDateRange, setSelectedDateRange] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  return (
    <div className="pet-store-report">
      <div className="reports-content">
        {/* <div className="report-header-section">
          <Title className="main-title">CỬA HÀNG THÚ CƯNG YUMMYPET</Title>
          <Text className="sub-title">
            Hệ thống báo cáo và thống kê toàn diện
          </Text>
        </div> */}

        <div className="report-controls">
          <Title level={3} className="controls-title">
            Tùy chọn báo cáo
          </Title>

          <div className="filter-section">
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12} md={8}>
                <Space>
                  <Text strong>Thời gian:</Text>
                  <RangePicker
                    value={selectedDateRange}
                    onChange={setSelectedDateRange}
                    placeholder={["Từ ngày", "Đến ngày"]}
                  />
                </Space>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Space>
                  <Text strong>Loại báo cáo:</Text>
                  <Select value={reportType} onChange={setReportType}>
                    <Option value="sales">Báo cáo bán hàng</Option>
                    <Option value="services">Báo cáo dịch vụ</Option>
                    <Option value="customers">Báo cáo khách hàng</Option>
                    <Option value="inventory">Báo cáo tồn kho</Option>
                    <Option value="comprehensive">Báo cáo tổng hợp</Option>
                  </Select>
                </Space>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Space>
                  <Button onClick={handleExportPDF} type="primary">
                    Xuất báo cáo
                  </Button>
                  <Button>Làm mới</Button>
                </Space>
              </Col>
            </Row>
          </div>
        </div>

        <div ref={reportRef} className="report-content">
          <div className="report-header">
            <Title level={1}>CỬA HÀNG THÚ CƯNG YUMMY PET</Title>
            {/* <Title level={3}>
              BÁO CÁO CHI TIẾT{" "}
              {selectedMonth
                ? `THÁNG ${dayjs(selectedMonth).format("MM/YYYY")}`
                : "TỔNG HỢP"}
            </Title> */}
            <Text className="report-date">
              Khoảng thời gian:{" "}
              {dateRange
                ? `${dateRange[0].format("DD/MM/YYYY")} - ${dateRange[1].format(
                    "DD/MM/YYYY"
                  )}`
                : "Toàn bộ"}
            </Text>
            <br />
            <Text className="report-date">
              Ngày xuất: {dayjs().format("DD/MM/YYYY HH:mm:ss")}
            </Text>
          </div>

          <Divider />

          <div className="report-section">
            <Title level={3} className="section-title">
              1. TỔNG QUAN KINH DOANH
            </Title>
            <Row gutter={[24, 24]} className="overview-stats">
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card">
                  <Statistic
                    title="Tổng doanh thu"
                    value={totalRevenue}
                    formatter={(value) =>
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value)
                    }
                    prefix={<DollarOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card">
                  <Statistic
                    title="Tổng đơn hàng"
                    value={totalOrders}
                    prefix={<ShoppingCartOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card">
                  <Statistic
                    title="Đơn hoàn thành"
                    value={completedOrders}
                    suffix={`/ ${totalOrders}`}
                    prefix={<ShoppingCartOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card">
                  <Statistic
                    title="Dịch vụ thực hiện"
                    value={totalServices}
                    prefix={<ShopOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </div>

          <div className="report-section">
            <Title level={3} className="section-title">
              2. CHI TIẾT ĐƠN HÀNG
            </Title>
            <Table
              columns={orderColumns}
              dataSource={filteredData.orders}
              pagination={false}
              size="small"
              className="report-table"
              scroll={{ x: 800 }}
            />
          </div>

          <div className="report-section">
            <Title level={3} className="section-title">
              3. DỊCH VỤ ĐƯỢC SỬ DỤNG NHIỀU NHẤT
            </Title>
            <Table
              columns={[
                { title: "Tên dịch vụ", dataIndex: "name", key: "name" },
                {
                  title: "Giá dịch vụ",
                  dataIndex: "price",
                  key: "price",
                  render: (price) =>
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(price),
                },
                {
                  title: "Số lượt đặt",
                  dataIndex: "bookings",
                  key: "bookings",
                },
                {
                  title: "Doanh thu",
                  dataIndex: "revenue",
                  key: "revenue",
                  render: (revenue) =>
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(revenue),
                },
              ]}
              dataSource={mockData.services}
              pagination={false}
              size="small"
              className="report-table"
              scroll={{ x: 600 }}
            />
          </div>

          <div className="report-section">
            <Title level={3} className="section-title">
              4. KHÁCH HÀNG THÂN THIẾT
            </Title>
            <Table
              columns={customerColumns}
              dataSource={mockData.customers}
              pagination={false}
              size="small"
              className="report-table"
              scroll={{ x: 600 }}
            />
          </div>

          <div className="report-section">
            <Title level={3} className="section-title">
              5. SẢN PHẨM BÁN CHẠY
            </Title>
            <Table
              columns={[
                { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
                {
                  title: "Danh mục",
                  dataIndex: "category",
                  key: "category",
                  render: (category) => <Tag color="blue">{category}</Tag>,
                },
                {
                  title: "Giá bán",
                  dataIndex: "price",
                  key: "price",
                  render: (price) =>
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(price),
                },
                { title: "Đã bán", dataIndex: "sold", key: "sold" },
                {
                  title: "Tồn kho",
                  dataIndex: "stock",
                  key: "stock",
                  render: (stock) => (
                    <Tag
                      color={
                        stock > 20 ? "green" : stock > 10 ? "orange" : "red"
                      }
                    >
                      {stock}
                    </Tag>
                  ),
                },
              ]}
              dataSource={mockData.products}
              pagination={false}
              size="small"
              className="report-table"
              scroll={{ x: 700 }}
            />
          </div>

          <div className="report-footer">
            <Divider />
            <Text className="footer-text">
              📊 Báo cáo được tạo tự động bởi hệ thống quản lý PetStore
            </Text>
            <br />
            <Text className="footer-text">
              🕒 Thời gian tạo: {dayjs().format("DD/MM/YYYY HH:mm:ss")}
            </Text>
            <br />
            <Text className="footer-text">
              📞 Liên hệ hỗ trợ: (028) 1234 5678 | 📧 support@petstore.vn
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
