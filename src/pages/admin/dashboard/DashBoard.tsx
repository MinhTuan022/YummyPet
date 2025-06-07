import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Progress,
  Avatar,
  Badge,
  Tabs,
  DatePicker,
  Select,
  Button,
  Space,
  Typography,
  List,
  Timeline,
  Rate,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  HeartOutlined,
  DollarOutlined,
  TrophyOutlined,
  RiseOutlined,
  TeamOutlined,
  GiftOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import "./Dashboard.scss";
const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Mock data based on the database schema
const mockData = {
  stats: {
    totalRevenue: 125000,
    totalOrders: 1234,
    totalCustomers: 856,
    totalPets: 342,
    revenueGrowth: 12.5,
    orderGrowth: 8.3,
    customerGrowth: 15.2,
    petGrowth: 6.8,
  },
  revenueChart: [
    { month: "Jan", revenue: 15000, orders: 120 },
    { month: "Feb", revenue: 18000, orders: 145 },
    { month: "Mar", revenue: 22000, orders: 168 },
    { month: "Apr", revenue: 19000, orders: 152 },
    { month: "May", revenue: 25000, orders: 198 },
    { month: "Jun", revenue: 26000, orders: 205 },
  ],
  petCategories: [
    { name: "Dogs", value: 145, color: "#FF6B6B" },
    { name: "Cats", value: 132, color: "#4ECDC4" },
    { name: "Birds", value: 45, color: "#45B7D1" },
    { name: "Fish", value: 20, color: "#96CEB4" },
  ],
  topProducts: [
    {
      id: 1,
      name: "Premium Dog Food",
      sales: 245,
      revenue: 12250,
      category: "Food",
    },
    {
      id: 2,
      name: "Cat Litter Box",
      sales: 189,
      revenue: 9450,
      category: "Accessories",
    },
    {
      id: 3,
      name: "Bird Cage Deluxe",
      sales: 67,
      revenue: 6700,
      category: "Housing",
    },
    {
      id: 4,
      name: "Fish Tank Filter",
      sales: 123,
      revenue: 6150,
      category: "Equipment",
    },
    {
      id: 5,
      name: "Pet Grooming Kit",
      sales: 89,
      revenue: 4450,
      category: "Grooming",
    },
  ],
  recentOrders: [
    {
      id: 1,
      customer: "Nguyễn Văn A",
      pet: "Golden Retriever",
      amount: 1250,
      status: "completed",
      date: "2024-06-07",
    },
    {
      id: 2,
      customer: "Trần Thị B",
      pet: "Persian Cat",
      amount: 980,
      status: "processing",
      date: "2024-06-07",
    },
    {
      id: 3,
      customer: "Lê Văn C",
      pet: "Cockatiel",
      amount: 650,
      status: "pending",
      date: "2024-06-06",
    },
    {
      id: 4,
      customer: "Phạm Thị D",
      pet: "Goldfish",
      amount: 120,
      status: "completed",
      date: "2024-06-06",
    },
    {
      id: 5,
      customer: "Hoàng Văn E",
      pet: "Siberian Husky",
      amount: 1500,
      status: "completed",
      date: "2024-06-05",
    },
  ],
  topCustomers: [
    {
      id: 1,
      name: "Nguyễn Thị Hoa",
      totalSpent: 5400,
      orders: 12,
      loyaltyPoints: 540,
    },
    {
      id: 2,
      name: "Trần Văn Nam",
      totalSpent: 4200,
      orders: 8,
      loyaltyPoints: 420,
    },
    {
      id: 3,
      name: "Lê Thị Mai",
      totalSpent: 3800,
      orders: 15,
      loyaltyPoints: 380,
    },
    {
      id: 4,
      name: "Phạm Văn Đức",
      totalSpent: 3200,
      orders: 6,
      loyaltyPoints: 320,
    },
  ],
  services: [
    { name: "Làm đẹp thú cưng", bookings: 89, revenue: 8900 },
    { name: "Tắm rửa thú cưng", bookings: 45, revenue: 13500 },
    { name: "Cắt tỉa", bookings: 23, revenue: 6900 },
    { name: "Spa thú cưng", bookings: 34, revenue: 10200 },
  ],
  recentActivities: [
    { time: "2 phút trước", action: "Đơn hàng mới #1234", type: "order" },
    {
      time: "15 phút trước",
      action: "Khách hàng mới đăng ký",
      type: "customer",
    },
    {
      time: "30 phút trước",
      action: "Dịch vụ grooming hoàn thành",
      type: "service",
    },
    { time: "1 giờ trước", action: "Sản phẩm mới được thêm", type: "product" },
  ],
};

const Dashboard: React.FC = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const orderColumns = [
    {
      title: "Đơn hàng",
      dataIndex: "id",
      key: "id",
      render: (id: number) => `#${id.toString().padStart(4, "0")}`,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Thú cưng",
      dataIndex: "pet",
      key: "pet",
    },
    {
      title: "Giá trị",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `${amount.toLocaleString("vi-VN")}đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors = {
          completed: "green",
          processing: "blue",
          pending: "orange",
        };
        const labels = {
          completed: "Hoàn thành",
          processing: "Đang xử lý",
          pending: "Chờ xử lý",
        };
        return (
          <Tag color={colors[status as keyof typeof colors]}>
            {labels[status as keyof typeof labels]}
          </Tag>
        );
      },
    },
  ];

  const productColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category: string) => <Tag>{category}</Tag>,
    },
    {
      title: "Đã bán",
      dataIndex: "sales",
      key: "sales",
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue: number) => `${revenue.toLocaleString("vi-VN")}đ`,
    },
  ];

  return (
    <div className="pet-store-dashboard">
      <Layout>
        {/* <Header className="dashboard-header">
          <Title level={2}>🐾 Pet Store Dashboard</Title>
        </Header> */}

        <Content className="dashboard-content">
          {/* Filters */}
          

          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stats-card">
                <Statistic
                  title="Tổng doanh thu"
                  value={mockData.stats.totalRevenue}
                  precision={0}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<DollarOutlined />}
                  suffix="đ"
                />
                <div className="growth-indicator">
                  <RiseOutlined />
                  <span>
                    +{mockData.stats.revenueGrowth}% so với tháng trước
                  </span>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stats-card">
                <Statistic
                  title="Tổng đơn hàng"
                  value={mockData.stats.totalOrders}
                  valueStyle={{ color: "#1890ff" }}
                  prefix={<ShoppingCartOutlined />}
                />
                <div className="growth-indicator">
                  <RiseOutlined />
                  <span>+{mockData.stats.orderGrowth}% so với tháng trước</span>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stats-card">
                <Statistic
                  title="Khách hàng"
                  value={mockData.stats.totalCustomers}
                  valueStyle={{ color: "#722ed1" }}
                  prefix={<UserOutlined />}
                />
                <div className="growth-indicator">
                  <RiseOutlined />
                  <span>
                    +{mockData.stats.customerGrowth}% so với tháng trước
                  </span>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stats-card">
                <Statistic
                  title="Thú cưng"
                  value={mockData.stats.totalPets}
                  valueStyle={{ color: "#eb2f96" }}
                  prefix={<HeartOutlined />}
                />
                <div className="growth-indicator">
                  <RiseOutlined />
                  <span>+{mockData.stats.petGrowth}% so với tháng trước</span>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={16}>
              <Card
                title="📈 Doanh thu & Đơn hàng theo tháng"
                className="chart-card"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockData.revenueChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      strokeWidth={3}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      stroke="#82ca9d"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="🐾 Phân bố thú cưng" className="chart-card">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockData.petCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockData.petCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={12}>
              <Card title="🛠️ Dịch vụ phổ biến" className="chart-card">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={mockData.services}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="🏆 Khách hàng VIP" className="customer-list">
                <List
                  dataSource={mockData.topCustomers}
                  renderItem={(customer) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={customer.name}
                        description={
                          <Space direction="vertical" size="small">
                            <Text>
                              Đã chi:{" "}
                              {customer.totalSpent.toLocaleString("vi-VN")}đ
                            </Text>
                            <Text>Đơn hàng: {customer.orders}</Text>
                            <Badge
                              count={customer.loyaltyPoints}
                              showZero
                              color="#faad14"
                            />
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={14}>
              <Card title="📋 Đơn hàng gần đây" className="table-card">
                <Table
                  columns={orderColumns}
                  dataSource={mockData.recentOrders}
                  pagination={{ pageSize: 5 }}
                  rowKey="id"
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={24} lg={10}>
              <Card title="⏰ Hoạt động gần đây" className="activity-timeline">
                <Timeline>
                  {mockData.recentActivities.map((activity, index) => (
                    <Timeline.Item
                      key={index}
                      color={
                        activity.type === "order"
                          ? "green"
                          : activity.type === "customer"
                          ? "blue"
                          : "orange"
                      }
                    >
                      <Text strong>{activity.action}</Text>
                      <br />
                      <Text type="secondary">{activity.time}</Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="🎯 Sản phẩm bán chạy" className="table-card">
                <Table
                  columns={productColumns}
                  dataSource={mockData.topProducts}
                  pagination={false}
                  rowKey="id"
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  );
};

export default Dashboard;
