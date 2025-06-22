import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Select,
  Button,
  Typography,
  message,
  Spin,
  Empty,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  HeartOutlined,
  DollarOutlined,
  RiseOutlined,
  ReloadOutlined,
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
import { _request } from "../../../network/Api";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

interface SalesStatistics {
  totalRevenue: number;
  totalOrders: number;
  monthlyRevenue: number;
  monthlyOrders: number;
  dailyRevenue: number;
  dailyOrders: number;
  averageOrderValue: number;
  growthRate?: number;
  conversionRate?: number;
}

interface CustomerStatistics {
  totalCustomers: number;
  newCustomersThisMonth: number;
  activeCustomers: number;
  loyalCustomers: number;
  averageLoyaltyPoints: number;
  totalLoyaltyPointsIssued: number;
  totalLoyaltyPointsRedeemed: number;
}

interface TopProduct {
  productId: number;
  productName: string;
  categoryName: string;
  totalSold: number;
  stockQuantity: number;
  revenue: number;
  profit: number;
}

interface Service {
  serviceId: number;
  serviceName: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  completionRate: number;
  totalRevenue: number;
}

interface DashboardData {
  salesStatistics: SalesStatistics;
  customerStatistics: CustomerStatistics;
  totalProducts: number;
  totalServices: number;
  totalEmployees: number;
  todayRevenue: number;
  todayOrders: number;
  todayNewCustomers: number;
  topSellingProduct: TopProduct;
  mostBookedService: Service;
}

interface MonthlySalesData {
  month: number;
  monthName: string;
  year: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

interface TopProductData {
  productId: number;
  productName: string;
  categoryName: string;
  totalSold: number;
  stockQuantity: number;
  revenue: number;
  profit: number;
}

interface GrowthData {
  revenueGrowthPercentage: number;
  revenueGrowthAmount: number;
  orderGrowthPercentage: number;
  orderGrowthAmount: number;
  customerGrowthPercentage: number;
  customerGrowthAmount: number;
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  currentMonthOrders: number;
  previousMonthOrders: number;
  currentMonthCustomers: number;
  previousMonthCustomers: number;
}

interface PetCategory {
  name: string;
  value: number;
  color: string;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [monthlySalesData, setMonthlySalesData] = useState<MonthlySalesData[]>(
    []
  );
  const [topSellingProducts, setTopSellingProducts] = useState<
    TopProductData[]
  >([]);
  const [services, setServices] = useState<Service[]>([]);
  const [growthData, setGrowthData] = useState<GrowthData | null>(null);
  const [petCategories, setPetCategories] = useState<PetCategory[]>([]);

  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [error, setError] = useState<string | null>(null);
  const fetchDashboardData = () => {
    setLoading(true);
    _request({
      path: "/statistics/dashboard",
      method: "GET",
      onSuccess: (response) => {
        if (response.success) {
          setDashboardData(response.data);
        } else {
          message.error(response.message || "Lỗi khi tải dữ liệu dashboard");
          setError("Không thể tải dữ liệu dashboard");
        }
        setLoading(false);
      },
      onError: () => {
        message.error("Lỗi khi tải dữ liệu dashboard");
        setError("Không thể kết nối với API");
        setLoading(false);
      },
    });
  };
  const fetchMonthlySales = (year: number) => {
    _request({
      path: `/statistics/sales/monthly?year=${year}`,
      method: "GET",
      onSuccess: (response) => {
        if (response.success) {
          setMonthlySalesData(response.data);
        } else {
          message.error(
            response.message || "Lỗi khi tải dữ liệu doanh thu hàng tháng"
          );
        }
      },
      onError: () => {
        message.error("Lỗi khi tải dữ liệu doanh thu hàng tháng");
      },
    });
  };
  const fetchTopSellingProducts = (limit: number = 10) => {
    _request({
      path: `/statistics/products/top-selling?limit=${limit}`,
      method: "GET",
      onSuccess: (response) => {
        if (response.success) {
          setTopSellingProducts(response.data);
        } else {
          message.error(
            response.message || "Lỗi khi tải dữ liệu sản phẩm bán chạy"
          );
        }
      },
      onError: () => {
        message.error("Lỗi khi tải dữ liệu sản phẩm bán chạy");
      },
    });
  };
  const fetchServices = () => {
    _request({
      path: "/statistics/services",
      method: "GET",
      onSuccess: (response) => {
        if (response.success) {
          setServices(response.data);
        } else {
          message.error(response.message || "Lỗi khi tải dữ liệu dịch vụ");
        }
      },
      onError: () => {
        message.error("Lỗi khi tải dữ liệu dịch vụ");
      },
    });
  };
  const fetchGrowthData = () => {
    _request({
      path: "/statistics/growth",
      method: "GET",
      onSuccess: (response) => {
        if (response.success) {
          setGrowthData(response.data);
        } else {
          message.error(response.message || "Lỗi khi tải dữ liệu tăng trưởng");
        }
      },
      onError: () => {
        message.error("Lỗi khi tải dữ liệu tăng trưởng");
      },
    });
  }; 
  const refreshAllData = () => {
    fetchDashboardData();
    fetchMonthlySales(selectedYear);
    fetchTopSellingProducts();
    fetchServices();
    fetchGrowthData();

    _request({
      path: "/pets?page=0&size=100&onlyActive=true",
      method: "GET",
      onSuccess: (response) => {
        if (
          response.success &&
          response.data &&
          response.data.content &&
          Array.isArray(response.data.content)
        ) {
          const pets = response.data.content;

          const petTypeStats = new Map<string, number>();

          pets.forEach((pet: any) => {
            if (pet.category && pet.category.name) {
              const categoryName = pet.category.name;
              petTypeStats.set(
                categoryName,
                (petTypeStats.get(categoryName) || 0) + 1
              );
            }
          });

          const colors = [
            "#FF6B6B",
            "#4ECDC4",
            "#45B7D1",
            "#96CEB4",
            "#F9DC5C",
            "#7986CB",
          ];
          const petCats: PetCategory[] = [];

          let index = 0;
          petTypeStats.forEach((count, name) => {
            petCats.push({
              name: name,
              value: count,
              color: colors[index % colors.length],
            });
            index++;
          });

          if (petCats.length > 0) {
            setPetCategories(petCats);
          }
        } else {
          message.error("Không thể tải dữ liệu phân loại thú cưng");
        }
      },
      onError: () => {
        message.error("Không thể tải dữ liệu phân loại thú cưng");
      },
    });

    message.success("Đã làm mới dữ liệu dashboard");
  }; 
  useEffect(() => {
    fetchDashboardData();
    fetchMonthlySales(selectedYear);
    fetchTopSellingProducts();
    fetchServices();
    fetchGrowthData();

    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    _request({
      path: "/pets?page=0&size=100&onlyActive=true", 
      method: "GET",
      onSuccess: (response) => {
        if (
          response.success &&
          response.data &&
          response.data.content &&
          Array.isArray(response.data.content)
        ) {
          const pets = response.data.content;

          const petTypeStats = new Map<string, number>();

          pets.forEach((pet: any) => {
            if (pet.category && pet.category.name) {
              const categoryName = pet.category.name;
              petTypeStats.set(
                categoryName,
                (petTypeStats.get(categoryName) || 0) + 1
              );
            }
          });

          const colors = [
            "#FF6B6B",
            "#4ECDC4",
            "#45B7D1",
            "#96CEB4",
            "#F9DC5C",
            "#7986CB",
          ];
          const petCats: PetCategory[] = [];

          let index = 0;
          petTypeStats.forEach((count, name) => {
            petCats.push({
              name: name,
              value: count,
              color: colors[index % colors.length],
            });
            index++;
          });

          if (petCats.length > 0) {
            setPetCategories(petCats);
          }
        } else {
          message.error("Không thể tải dữ liệu phân loại thú cưng");
        }
      },
      onError: () => {
        message.error("Không thể tải dữ liệu thú cưng");
      },
    });
  }, []);
  useEffect(() => {
    if (selectedYear) {
      fetchMonthlySales(selectedYear);
    }
  }, [selectedYear]);

  const productColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (category: string) => <Tag>{category}</Tag>,
    },
    {
      title: "Đã bán",
      dataIndex: "totalSold",
      key: "totalSold",
    },
    {
      title: "Kho còn",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
      render: (quantity: number) => {
        let color = "green";
        if (quantity < 10) color = "red";
        else if (quantity < 30) color = "orange";
        return <Tag color={color}>{quantity}</Tag>;
      },
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue: number) => `${revenue.toLocaleString("vi-VN")}đ`,
    },
  ];

  const transformMonthlyDataForChart = () => {
    return monthlySalesData.map((item) => ({
      month: item.monthName,
      revenue: item.totalRevenue,
      orders: item.totalOrders,
    }));
  };

  const transformServicesForChart = () => {
    return services.map((service) => ({
      name: service.serviceName,
      bookings: service.totalBookings,
      revenue: service.totalRevenue,
    }));
  };

  if (loading && !dashboardData) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="dashboard-error">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              {error}.{" "}
              <Button type="link" onClick={refreshAllData}>
                Thử lại
              </Button>
            </span>
          }
        />
      </div>
    );
  }

  return (
    <div className="pet-store-dashboard">
      <Layout>
        <Content className="dashboard-content">
          <Row
            className="dashboard-header-row"
            gutter={[16, 16]}
            style={{ marginBottom: 16 }}
          >
            <Col flex="auto">
              <Title level={4} className="dashboard-title">
                Tổng quan cửa hàng
              </Title>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={refreshAllData}
                className="refresh-button"
              >
                Làm mới
              </Button>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stats-card">
                <Statistic
                  title="Tổng doanh thu"
                  value={dashboardData?.salesStatistics.totalRevenue || 0}
                  precision={0}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<DollarOutlined />}
                  suffix="đ"
                />
                {growthData && (
                  <div className="growth-indicator">
                    <RiseOutlined />
                    <span>
                      +{growthData.revenueGrowthPercentage.toFixed(1)}% so với
                      tháng trước
                    </span>
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stats-card">
                <Statistic
                  title="Tổng đơn hàng"
                  value={dashboardData?.salesStatistics.totalOrders || 0}
                  valueStyle={{ color: "#1890ff" }}
                  prefix={<ShoppingCartOutlined />}
                />
                {growthData && (
                  <div className="growth-indicator">
                    <RiseOutlined />
                    <span>
                      +{growthData.orderGrowthPercentage.toFixed(1)}% so với
                      tháng trước
                    </span>
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stats-card">
                <Statistic
                  title="Khách hàng"
                  value={dashboardData?.customerStatistics.totalCustomers || 0}
                  valueStyle={{ color: "#722ed1" }}
                  prefix={<UserOutlined />}
                />
                {growthData && (
                  <div className="growth-indicator">
                    <RiseOutlined />
                    <span>
                      +{growthData.customerGrowthPercentage.toFixed(1)}% so với
                      tháng trước
                    </span>
                  </div>
                )}
              </Card>
            </Col>{" "}
            <Col xs={24} sm={12} lg={6}>
              <Card className="stats-card">
                <Statistic
                  title="Thú cưng"
                  value={petCategories.reduce(
                    (sum, category) => sum + category.value,
                    0
                  )}
                  valueStyle={{ color: "#eb2f96" }}
                  prefix={<HeartOutlined />}
                />
                <div className="growth-indicator">
                  <RiseOutlined />
                  <span>Tổng số thú cưng đang có</span>
                </div>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={16}>
              <Card
                title="📈 Doanh thu & Đơn hàng theo tháng"
                className="chart-card"
                extra={
                  <Select
                    defaultValue={selectedYear}
                    onChange={setSelectedYear}
                  >
                    <Option value={2023}>2023</Option>
                    <Option value={2024}>2024</Option>
                    <Option value={2025}>2025</Option>
                  </Select>
                }
              >
                {monthlySalesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={transformMonthlyDataForChart()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        name="Doanh thu"
                        stroke="#8884d8"
                        strokeWidth={3}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        name="Đơn hàng"
                        stroke="#82ca9d"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-chart">
                    <Empty description="Không có dữ liệu doanh thu theo tháng" />
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="🐾 Phân bố thú cưng" className="chart-card">
                {petCategories.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={petCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => {
                          // Calculate percentage based on actual values
                          const total = petCategories.reduce(
                            (sum, category) => sum + category.value,
                            0
                          );
                          const percent =
                            total > 0 ? ((value / total) * 100).toFixed(0) : 0;
                          return `${name}: ${value} (${percent}%)`;
                        }}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {petCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-chart">
                    <Empty description="Không có dữ liệu phân loại thú cưng" />
                  </div>
                )}
              </Card>
            </Col>
          </Row>{" "}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={12}>
              <Card title="🛠️ Dịch vụ phổ biến" className="chart-card">
                {services.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={transformServicesForChart()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="bookings"
                        name="Số lượt đặt"
                        fill="#8884d8"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-chart">
                    <Empty description="Không có dữ liệu dịch vụ" />
                  </div>
                )}
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="🎯 Sản phẩm bán chạy" className="table-card">
                {topSellingProducts.length > 0 ? (
                  <Table
                    columns={productColumns}
                    dataSource={topSellingProducts}
                    pagination={false}
                    rowKey="productId"
                    size="small"
                  />
                ) : (
                  <Empty description="Không có dữ liệu sản phẩm bán chạy" />
                )}
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  );
};

export default Dashboard;
