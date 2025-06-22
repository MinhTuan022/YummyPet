import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  DatePicker,
  Button,
  Select,
  Table,
  message,
  Spin,
  Divider,
  Space,
  Statistic
} from "antd";
import {
  FilePdfOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { _request } from "../../../network/Api";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./ReportPage.scss";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

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

interface ProductData {
  productId: number;
  productName: string;
  categoryName: string;
  totalSold: number;
  stockQuantity: number;
  revenue: number;
  profit: number;
}

interface ServiceData {
  serviceId: number;
  serviceName: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  completionRate: number;
  totalRevenue: number;
}

interface MonthlySalesData {
  month: number;
  monthName: string;
  year: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
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

interface ReportFilter {
  startDate: string;
  endDate: string;
  reportType: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ReportPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [salesData, setSalesData] = useState<SalesStatistics | null>(null);
  const [customerData, setCustomerData] = useState<CustomerStatistics | null>(null);
  const [topProducts, setTopProducts] = useState<ProductData[]>([]);
  const [servicesData, setServicesData] = useState<ServiceData[]>([]);
  const [monthlySalesData, setMonthlySalesData] = useState<MonthlySalesData[]>([]);
  const [growthData, setGrowthData] = useState<GrowthData | null>(null);
  
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf('month'),
    dayjs()
  ]);
  const [reportType, setReportType] = useState<string>("sales");
  const [loadingPdf, setLoadingPdf] = useState<boolean>(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const fetchSalesData = () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return;
    
    setLoading(true);
    const startDate = dateRange[0].format('YYYY-MM-DD');
    const endDate = dateRange[1].format('YYYY-MM-DD');
    
    _request({
      path: `/statistics/sales?startDate=${startDate}&endDate=${endDate}`,
      method: "GET",
      onSuccess: (response) => {
        if (response.success) {
          setSalesData(response.data);
        } else {
          message.error(response.message || "Lỗi khi tải dữ liệu doanh thu");
        }
        setLoading(false);
      },
      onError: () => {
        message.error("Lỗi khi tải dữ liệu doanh thu");
        setLoading(false);
      }
    });
  };

  const fetchCustomerData = () => {
    setLoading(true);
    _request({
      path: "/statistics/customers",
      method: "GET",
      onSuccess: (response) => {
        if (response.success) {
          setCustomerData(response.data);
        } else {
          message.error(response.message || "Lỗi khi tải dữ liệu khách hàng");
        }
        setLoading(false);
      },
      onError: () => {
        message.error("Lỗi khi tải dữ liệu khách hàng");
        setLoading(false);
      }
    });
  };

  const fetchTopProducts = () => {
    setLoading(true);
    _request({
      path: "/statistics/products/top-selling?limit=10",
      method: "GET",
      onSuccess: (response) => {
        if (response.success) {
          setTopProducts(response.data);
        } else {
          message.error(response.message || "Lỗi khi tải dữ liệu sản phẩm bán chạy");
        }
        setLoading(false);
      },
      onError: () => {
        message.error("Lỗi khi tải dữ liệu sản phẩm bán chạy");
        setLoading(false);
      }
    });
  };

  const fetchServicesData = () => {
    setLoading(true);
    _request({
      path: "/statistics/services",
      method: "GET",
      onSuccess: (response) => {
        if (response.success) {
          setServicesData(response.data);
        } else {
          message.error(response.message || "Lỗi khi tải dữ liệu dịch vụ");
        }
        setLoading(false);
      },
      onError: () => {
        message.error("Lỗi khi tải dữ liệu dịch vụ");
        setLoading(false);
      }
    });
  };

  const fetchMonthlySales = () => {
    const year = new Date().getFullYear();
    setLoading(true);
    _request({
      path: `/statistics/sales/monthly?year=${year}`,
      method: "GET",
      onSuccess: (response) => {
        if (response.success) {
          setMonthlySalesData(response.data);
        } else {
          message.error(response.message || "Lỗi khi tải dữ liệu doanh thu hàng tháng");
        }
        setLoading(false);
      },
      onError: () => {
        message.error("Lỗi khi tải dữ liệu doanh thu hàng tháng");
        setLoading(false);
      }
    });
  };

  const fetchGrowthData = () => {
    setLoading(true);
    _request({
      path: "/statistics/growth",
      method: "GET",
      onSuccess: (response) => {
        if (response.success) {
          setGrowthData(response.data);
        } else {
          message.error(response.message || "Lỗi khi tải dữ liệu tăng trưởng");
        }
        setLoading(false);
      },
      onError: () => {
        message.error("Lỗi khi tải dữ liệu tăng trưởng");
        setLoading(false);
      }
    });
  };
  const generatePdfReport = () => {
    setLoadingPdf(true);
    message.info("Đang chuẩn bị xuất báo cáo PDF...");
    
    try {
      const doc = new jsPDF();
      const title = getReportTitle();
      
      doc.setFontSize(18);
      doc.text(title, 14, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      const today = new Date().toLocaleDateString('vi-VN');
      doc.text(`Ngày xuất báo cáo: ${today}`, 14, 30);
 
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      
      let startY = 40;
      
      switch (reportType) {
        case "sales":
          if (salesData) {
            if (dateRange && dateRange[0] && dateRange[1]) {
              const start = dateRange[0].format('DD/MM/YYYY');
              const end = dateRange[1].format('DD/MM/YYYY');
              doc.text(`Khoảng thời gian: ${start} - ${end}`, 14, startY);
              startY += 10;
            }
            
            const salesSummary = [
              ['Tổng doanh thu', formatCurrency(salesData.totalRevenue)],
              ['Tổng đơn hàng', salesData.totalOrders.toString()],
              ['Giá trị trung bình đơn hàng', formatCurrency(salesData.averageOrderValue)],
              ['Doanh thu tháng này', formatCurrency(salesData.monthlyRevenue)],
              ['Đơn hàng tháng này', salesData.monthlyOrders.toString()],
              ['Doanh thu hôm nay', formatCurrency(salesData.dailyRevenue)],
              ['Đơn hàng hôm nay', salesData.dailyOrders.toString()]
            ];
            
            autoTable(doc, {
              head: [['Chỉ tiêu', 'Giá trị']],
              body: salesSummary,
              startY: startY,
              theme: 'striped'
            });
          }
          break;
          
        case "customer":
          if (customerData) {
            const customerSummary = [
              ['Tổng số khách hàng', customerData.totalCustomers.toString()],
              ['Khách hàng mới tháng này', customerData.newCustomersThisMonth.toString()],
              ['Khách hàng đang hoạt động', customerData.activeCustomers.toString()],
              ['Khách hàng trung thành', customerData.loyalCustomers.toString()],
              ['Điểm tích lũy trung bình', customerData.averageLoyaltyPoints.toString()],
              ['Tổng điểm tích lũy đã phát hành', customerData.totalLoyaltyPointsIssued.toString()],
              ['Tổng điểm tích lũy đã sử dụng', customerData.totalLoyaltyPointsRedeemed.toString()]
            ];
            
            autoTable(doc, {
              head: [['Chỉ tiêu', 'Giá trị']],
              body: customerSummary,
              startY: startY,
              theme: 'striped'
            });
          }
          break;
          
        case "product":
          if (topProducts.length > 0) {
            doc.text('Top 10 sản phẩm bán chạy', 14, startY);
            startY += 10;
            
            const productsTableData = topProducts.map(product => [
              product.productName,
              product.categoryName,
              product.totalSold.toString(),
              product.stockQuantity.toString(),
              formatCurrency(product.revenue),
              formatCurrency(product.profit)
            ]);
            
            autoTable(doc, {
              head: [['Sản phẩm', 'Danh mục', 'Đã bán', 'Tồn kho', 'Doanh thu', 'Lợi nhuận']],
              body: productsTableData,
              startY: startY,
              theme: 'striped',
              styles: { fontSize: 9 }
            });
          }
          break;
          
        case "service":
          if (servicesData.length > 0) {
            doc.text('Thống kê dịch vụ', 14, startY);
            startY += 10;
            
            const servicesTableData = servicesData.map(service => [
              service.serviceName,
              service.totalBookings.toString(),
              service.completedBookings.toString(),
              service.cancelledBookings.toString(),
              `${service.completionRate.toFixed(2)}%`,
              formatCurrency(service.totalRevenue)
            ]);
            
            autoTable(doc, {
              head: [['Dịch vụ', 'Tổng đặt', 'Hoàn thành', 'Hủy', 'Tỷ lệ hoàn thành', 'Doanh thu']],
              body: servicesTableData,
              startY: startY,
              theme: 'striped',
              styles: { fontSize: 9 }
            });
          }
          break;
          
        case "monthly":
          if (monthlySalesData.length > 0) {
            doc.text(`Doanh thu hàng tháng năm ${new Date().getFullYear()}`, 14, startY);
            startY += 10;
            
            const monthlyTableData = monthlySalesData.map(month => [
              month.monthName,
              month.year.toString(),
              month.totalOrders.toString(),
              formatCurrency(month.totalRevenue),
              formatCurrency(month.averageOrderValue)
            ]);
            
            autoTable(doc, {
              head: [['Tháng', 'Năm', 'Số đơn hàng', 'Doanh thu', 'Giá trị TB đơn hàng']],
              body: monthlyTableData,
              startY: startY,
              theme: 'striped',
              styles: { fontSize: 9 }
            });
          }
          break;
          
        case "growth":
          if (growthData) {
            const growthSummary = [
              ['Tăng trưởng doanh thu', `${growthData.revenueGrowthPercentage.toFixed(2)}%`, formatCurrency(growthData.revenueGrowthAmount)],
              ['Tăng trưởng đơn hàng', `${growthData.orderGrowthPercentage.toFixed(2)}%`, `${growthData.orderGrowthAmount} đơn`],
              ['Tăng trưởng khách hàng', `${growthData.customerGrowthPercentage.toFixed(2)}%`, `${growthData.customerGrowthAmount} khách hàng`]
            ];
            
            autoTable(doc, {
              head: [['Chỉ tiêu', 'Tỷ lệ phần trăm', 'Giá trị tuyệt đối']],
              body: growthSummary,
              startY: startY,
              theme: 'striped'
            });
            
            startY = (doc as any).lastAutoTable.finalY + 15;
            
            const comparisonData = [
              ['Doanh thu tháng trước', formatCurrency(growthData.previousMonthRevenue)],
              ['Doanh thu tháng hiện tại', formatCurrency(growthData.currentMonthRevenue)],
              ['Số đơn hàng tháng trước', growthData.previousMonthOrders.toString()],
              ['Số đơn hàng tháng hiện tại', growthData.currentMonthOrders.toString()],
              ['Khách hàng mới tháng trước', growthData.previousMonthCustomers.toString()],
              ['Khách hàng mới tháng hiện tại', growthData.currentMonthCustomers.toString()]
            ];
            
            autoTable(doc, {
              head: [['Chỉ tiêu', 'Giá trị']],
              body: comparisonData,
              startY: startY,
              theme: 'striped'
            });
          }
          break;
      }
      
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Trang ${i} / ${pageCount} - YummyPet Report`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }
      
      const fileName = `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      message.success("Đã xuất báo cáo PDF thành công.");
    } catch (error) {
      console.error('Error generating PDF:', error);
      message.error("Lỗi khi xuất báo cáo PDF. Vui lòng thử lại.");
    } finally {
      setLoadingPdf(false);
    }
  };

  const refreshData = () => {
    switch (reportType) {
      case "sales":
        fetchSalesData();
        break;
      case "customer":
        fetchCustomerData();
        break;
      case "product":
        fetchTopProducts();
        break;
      case "service":
        fetchServicesData();
        break;
      case "monthly":
        fetchMonthlySales();
        break;
      case "growth":
        fetchGrowthData();
        break;
      default:
        fetchSalesData();
    }
  };

  useEffect(() => {
    refreshData();
  }, [reportType]);

  useEffect(() => {
    if (reportType === "sales") {
      fetchSalesData();
    }
  }, [dateRange]);

  const productColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Đã bán',
      dataIndex: 'totalSold',
      key: 'totalSold',
      sorter: (a: ProductData, b: ProductData) => a.totalSold - b.totalSold,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (text: number) => formatCurrency(text),
      sorter: (a: ProductData, b: ProductData) => a.revenue - b.revenue,
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'profit',
      key: 'profit',
      render: (text: number) => formatCurrency(text),
    },
  ];

  const serviceColumns = [
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: 'Tổng đặt',
      dataIndex: 'totalBookings',
      key: 'totalBookings',
      sorter: (a: ServiceData, b: ServiceData) => a.totalBookings - b.totalBookings,
    },
    {
      title: 'Hoàn thành',
      dataIndex: 'completedBookings',
      key: 'completedBookings',
    },
    {
      title: 'Hủy',
      dataIndex: 'cancelledBookings',
      key: 'cancelledBookings',
    },
    {
      title: 'Tỷ lệ hoàn thành',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (text: number) => `${text.toFixed(2)}%`,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (text: number) => formatCurrency(text),
      sorter: (a: ServiceData, b: ServiceData) => a.totalRevenue - b.totalRevenue,
    },
  ];

  const monthlyColumns = [
    {
      title: 'Tháng',
      dataIndex: 'monthName',
      key: 'monthName',
    },
    {
      title: 'Năm',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Số đơn hàng',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (text: number) => formatCurrency(text),
    },
    {
      title: 'Giá trị trung bình đơn hàng',
      dataIndex: 'averageOrderValue',
      key: 'averageOrderValue',
      render: (text: number) => formatCurrency(text),
    },
  ];

  const getReportTitle = () => {
    switch (reportType) {
      case "sales":
        return "Báo cáo doanh thu";
      case "customer":
        return "Báo cáo khách hàng";
      case "product":
        return "Báo cáo sản phẩm bán chạy";
      case "service":
        return "Báo cáo dịch vụ";
      case "monthly":
        return "Báo cáo doanh thu hàng tháng";
      case "growth":
        return "Báo cáo tăng trưởng";
      default:
        return "Báo cáo thống kê";
    }
  };

  return (
    <Content className="report-page">
      <div className="report-header">
        <Title level={2}>{getReportTitle()}</Title>
        <Space>
          {reportType === "sales" && (
            <RangePicker
              value={dateRange}
              onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              format="DD/MM/YYYY"
            />
          )}
          <Select
            value={reportType}
            onChange={(value) => setReportType(value)}
            style={{ width: 200 }}
          >
            <Option value="sales">Doanh thu</Option>
            <Option value="customer">Khách hàng</Option>
            <Option value="product">Sản phẩm bán chạy</Option>
            <Option value="service">Dịch vụ</Option>
            <Option value="monthly">Doanh thu hàng tháng</Option>
            <Option value="growth">Tăng trưởng</Option>
          </Select>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={refreshData} 
            loading={loading}
          >
            Làm mới
          </Button>
          <Button 
            type="primary" 
            icon={<FilePdfOutlined />} 
            onClick={generatePdfReport}
            loading={loadingPdf}
          >
            Xuất báo cáo PDF
          </Button>
        </Space>
      </div>
      
      <Divider />
      
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
          <Text>Đang tải dữ liệu...</Text>
        </div>
      ) : (
        <div className="report-content">
          {reportType === "sales" && salesData && (
            <div className="sales-report">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Tổng doanh thu"
                      value={salesData.totalRevenue}
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Tổng số đơn hàng"
                      value={salesData.totalOrders}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Giá trị trung bình đơn hàng"
                      value={salesData.averageOrderValue}
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  </Card>
                </Col>
              </Row>
              
              <Card title="Thống kê doanh thu" className="chart-card">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { name: 'Tổng', value: salesData.totalRevenue },
                      { name: 'Tháng này', value: salesData.monthlyRevenue },
                      { name: 'Hôm nay', value: salesData.dailyRevenue },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Doanh thu" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              
              <Card title="Thống kê đơn hàng" className="chart-card">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { name: 'Tổng', value: salesData.totalOrders },
                      { name: 'Tháng này', value: salesData.monthlyOrders },
                      { name: 'Hôm nay', value: salesData.dailyOrders },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d" name="Đơn hàng" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {reportType === "customer" && customerData && (
            <div className="customer-report">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Tổng số khách hàng"
                      value={customerData.totalCustomers}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Khách hàng mới tháng này"
                      value={customerData.newCustomersThisMonth}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Khách hàng đang hoạt động"
                      value={customerData.activeCustomers}
                    />
                  </Card>
                </Col>
              </Row>
              
              <Card title="Thống kê điểm tích lũy khách hàng" className="chart-card">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Đã sử dụng', value: customerData.totalLoyaltyPointsRedeemed },
                        { name: 'Còn lại', value: customerData.totalLoyaltyPointsIssued - customerData.totalLoyaltyPointsRedeemed }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
                    >
                      {[
                        { name: 'Đã sử dụng', value: customerData.totalLoyaltyPointsRedeemed },
                        { name: 'Còn lại', value: customerData.totalLoyaltyPointsIssued - customerData.totalLoyaltyPointsRedeemed }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toLocaleString()} điểm`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
              
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Khách hàng trung thành"
                      value={customerData.loyalCustomers}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Tổng điểm tích lũy đã phát hành"
                      value={customerData.totalLoyaltyPointsIssued}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Điểm tích lũy trung bình"
                      value={customerData.averageLoyaltyPoints}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {reportType === "product" && topProducts && (
            <div className="product-report">
              <Card title="Top 10 sản phẩm bán chạy">
                <Table
                  dataSource={topProducts}
                  columns={productColumns}
                  rowKey="productId"
                  pagination={false}
                />
              </Card>
              
              <Card title="Biểu đồ doanh thu sản phẩm" className="chart-card">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={topProducts.slice(0, 5)}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="productName" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => {
                      return name === "revenue" ? formatCurrency(Number(value)) : formatCurrency(Number(value));
                    }} />
                    <Legend />
                    <Bar dataKey="revenue" name="Doanh thu" fill="#8884d8" />
                    <Bar dataKey="profit" name="Lợi nhuận" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {reportType === "service" && servicesData && (
            <div className="service-report">
              <Card title="Thống kê dịch vụ">
                <Table
                  dataSource={servicesData}
                  columns={serviceColumns}
                  rowKey="serviceId"
                  pagination={false}
                />
              </Card>
              
              <Card title="Tỷ lệ đặt dịch vụ" className="chart-card">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={servicesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalBookings"
                      nameKey="serviceName"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
                    >
                      {servicesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => `${value} lượt đặt`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
              
              <Card title="Tỷ lệ hoàn thành dịch vụ" className="chart-card">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={servicesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="serviceName" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="completionRate" name="Tỷ lệ hoàn thành" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {reportType === "monthly" && monthlySalesData && (
            <div className="monthly-report">
              <Card title={`Doanh thu hàng tháng năm ${new Date().getFullYear()}`}>
                <Table
                  dataSource={monthlySalesData}
                  columns={monthlyColumns}
                  rowKey={(record) => `${record.month}-${record.year}`}
                  pagination={false}
                />
              </Card>
              
              <Card title={`Biểu đồ doanh thu hàng tháng năm ${new Date().getFullYear()}`} className="chart-card">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={monthlySalesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthName" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => {
                      if (name === "totalRevenue") return formatCurrency(Number(value));
                      if (name === "averageOrderValue") return formatCurrency(Number(value));
                      return value;
                    }} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalRevenue"
                      name="Doanh thu"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalOrders"
                      name="Số đơn hàng"
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {reportType === "growth" && growthData && (
            <div className="growth-report">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Tăng trưởng doanh thu"
                      value={growthData.revenueGrowthPercentage}
                      suffix="%"
                      valueStyle={{ color: growthData.revenueGrowthPercentage >= 0 ? '#3f8600' : '#cf1322' }}
                    />
                    <Text type="secondary">{formatCurrency(growthData.revenueGrowthAmount)}</Text>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Tăng trưởng đơn hàng"
                      value={growthData.orderGrowthPercentage}
                      suffix="%"
                      valueStyle={{ color: growthData.orderGrowthPercentage >= 0 ? '#3f8600' : '#cf1322' }}
                    />
                    <Text type="secondary">{growthData.orderGrowthAmount} đơn hàng</Text>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Tăng trưởng khách hàng"
                      value={growthData.customerGrowthPercentage}
                      suffix="%"
                      valueStyle={{ color: growthData.customerGrowthPercentage >= 0 ? '#3f8600' : '#cf1322' }}
                    />
                    <Text type="secondary">{growthData.customerGrowthAmount} khách hàng</Text>
                  </Card>
                </Col>
              </Row>
              
              <Card title="So sánh doanh thu" className="chart-card">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { name: 'Tháng trước', value: growthData.previousMonthRevenue },
                      { name: 'Tháng hiện tại', value: growthData.currentMonthRevenue },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Doanh thu" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              
              <Card title="So sánh đơn hàng và khách hàng" className="chart-card">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      {
                        name: 'Tháng trước',
                        orders: growthData.previousMonthOrders,
                        customers: growthData.previousMonthCustomers,
                      },
                      {
                        name: 'Tháng hiện tại',
                        orders: growthData.currentMonthOrders,
                        customers: growthData.currentMonthCustomers,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#82ca9d" name="Đơn hàng" />
                    <Bar dataKey="customers" fill="#ffc658" name="Khách hàng mới" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}
        </div>
      )}
    </Content>
  );
};

export default ReportPage;
