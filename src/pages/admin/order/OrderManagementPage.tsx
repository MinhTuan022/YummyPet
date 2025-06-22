import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Tag,
  Space,
  Select,
  DatePicker,
  Modal,
  Form,
  message,
  Descriptions,
  Row,
  Col,
  Statistic,
  Dropdown,
  Typography,
  Divider,
  Tabs,
  InputNumber,
  Radio,
  List,
  Avatar,
  Popconfirm,
  Progress,
  Badge,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  TruckOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  PrinterOutlined,
  UserOutlined,
  ReloadOutlined,
  DollarCircleOutlined,
  SwapOutlined,
  UndoOutlined,
  FileTextOutlined,
  ShopOutlined,
  GlobalOutlined,
  WalletOutlined,
  CreditCardOutlined,
  BankOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { _request } from "../../../network/Api";
import "./OrderManagementPage.scss";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;
const { TabPane } = Tabs;

// Enhanced interfaces based on API documentation
interface Customer {
  id: number;
  customerCode: string;
  fullName: string;
  phone: string;
  email?: string;
  loyaltyPoints?: number;
}

interface Employee {
  id: number;
  fullName: string;
  employeeCode?: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  price?: number;
}

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  price?: number;
}

interface Service {
  id: number;
  name: string;
  duration?: string;
  price?: number;
}

interface OrderItem {
  id: number;
  itemType: "product" | "pet" | "service";
  product?: Product;
  pet?: Pet;
  service?: Service;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  completionDate?: number;
  serviceNotes?: string;
  serviceStatus?: "pending" | "in_progress" | "completed" | "cancelled";
  assignedEmployee?: Employee;
}

interface Order {
  id: number;
  orderCode: string;
  customer?: Customer;
  isGuestOrder: boolean;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  loyaltyPointsUsed?: number;
  paymentMethod: "cash" | "card" | "bank_transfer" | "wallet";
  paymentStatus: "pending" | "paid" | "refunded" | "partially_refunded";
  deliveryAddress?: string;
  deliveryMethod?: "shipping" | "pickup";
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "ready"
    | "completed"
    | "cancelled";
  orderSource: "online" | "in_store";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  voucherId?: number;
  voucherCode?: string;
  orderItems: OrderItem[];
  employee?: Employee;
}

interface ReturnItem {
  id: number;
  orderItemId: number;
  itemType: "product" | "pet";
  product?: Product;
  pet?: Pet;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  conditionStatus: "new_" | "good" | "damaged" | "defective";
  notes?: string;
}

interface Return {
  id: number;
  returnCode: string;
  orderId: number;
  orderCode: string;
  customer?: Customer;
  type: "return_" | "exchange";
  reason: string;
  totalAmount: number;
  refundAmount?: number;
  status: "pending" | "approved" | "completed" | "rejected";
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  items: ReturnItem[];
  processedBy?: Employee;
  rejectionReason?: string;
}

const OrderManagementPage: React.FC = () => {
  // State management
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<Return[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [isOrderDetailModalVisible, setIsOrderDetailModalVisible] =
    useState(false);
  const [isReturnModalVisible, setIsReturnModalVisible] = useState(false);
  const [isCreateReturnModalVisible, setIsCreateReturnModalVisible] =
    useState(false);
  const [isStatusUpdateModalVisible, setIsStatusUpdateModalVisible] =
    useState(false);
  const [activeTab, setActiveTab] = useState("orders");

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  // Forms
  const [statusForm] = Form.useForm();
  const [returnForm] = Form.useForm(); // Statistics
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalCustomers: 0,
    serviceOrders: 0,
    productOrders: 0,
    petOrders: 0,
    todayOrders: 0,
    returnsCount: 0,
  });

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  useEffect(() => {
    fetchOrders();
    fetchReturns();
    fetchStatistics();
  }, []);
  // Fetch orders from API with filters
  const fetchOrders = async (params?: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
    source?: string;
    paymentStatus?: string;
    formDate?: string;
    toDate?: string;
  }) => {
    setLoading(true);
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params?.page !== undefined)
        queryParams.append("page", (params.page - 1).toString()); // Convert to 0-based
      if (params?.size !== undefined)
        queryParams.append("size", params.size.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.status && params.status !== "all")
        queryParams.append("status", params.status);
      if (params?.source && params.source !== "all")
        queryParams.append("source", params.source);
      if (params?.paymentStatus && params.paymentStatus !== "all")
        queryParams.append("paymentStatus", params.paymentStatus);
      if (params?.formDate) queryParams.append("fromDate", params.formDate);
      if (params?.toDate) queryParams.append("toDate", params.toDate);

      const queryString = queryParams.toString();
      const apiPath = `/orders${queryString ? `?${queryString}` : ""}`;

      _request({
        path: apiPath,
        method: "GET",
        onSuccess: (response) => {
          console.log("Raw API response:", response);

          if (!response.success) {
            console.error("API returned success = false:", response);
            message.error(response.message || "Lỗi từ server");
            setLoading(false);
            return;
          }

          const data = response.data || response;
          const ordersData = data.content || data;

          if (!Array.isArray(ordersData)) {
            console.error("Orders data is not an array:", ordersData);
            message.error("Định dạng dữ liệu không hợp lệ");
            setLoading(false);
            return;
          }

          console.log("Orders data from API:", ordersData);
          const transformedOrders = ordersData.map((order: any) => ({
            id: order.id,
            orderCode: order.orderCode,
            customer: order.customer
              ? {
                  id: order.customer.id,
                  customerCode: order.customer.customerCode,
                  fullName: order.customer.fullName,
                  phone: order.customer.phone,
                  email: order.customer.email,
                  loyaltyPoints: order.customer.loyaltyPoints,
                }
              : undefined,
            isGuestOrder: order.isGuestOrder || false,
            guestName: order.guestName,
            guestPhone: order.guestPhone,
            guestEmail: order.guestEmail,
            subtotal: order.subtotal || 0,
            discountAmount: order.discountAmount || 0,
            totalAmount: order.totalAmount || 0,
            loyaltyPointsUsed: order.loyaltyPointsUsed || 0,
            paymentMethod: order.paymentMethod?.toLowerCase() || "cash",
            paymentStatus: order.paymentStatus || "pending",
            deliveryAddress: order.deliveryAddress,
            deliveryMethod: order.deliveryMethod,
            status: order.status || "pending",
            orderSource: order.orderSource || "in_store",
            notes: order.notes,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            voucherId: order.voucherId,
            voucherCode: order.voucherCode,
            orderItems: (order.orderItems || []).map((item: any) => ({
              id: item.id,
              itemType: item.itemType,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              product: item.productId
                ? {
                    id: item.productId,
                    name: item.productName,
                    sku: item.productSku,
                  }
                : undefined,
              pet: item.petId
                ? {
                    id: item.petId,
                    name: item.petName,
                    species: "",
                    breed: "",
                  }
                : undefined,
              service: item.serviceId
                ? {
                    id: item.serviceId,
                    name: item.serviceName,
                    duration: "",
                  }
                : undefined,
              petIdServiced: item.petServicedId,
              serviceNotes: item.serviceNotes,
              serviceStatus: item.serviceStatus,
              assignedEmployee: item.assignedEmployeeId
                ? {
                    id: item.assignedEmployeeId,
                    fullName: item.assignedEmployeeName,
                  }
                : undefined,
            })),
            employee: order.employee,
          }));
          console.log("Transformed orders:", transformedOrders);
          setOrders(
            transformedOrders.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
          );

          if (data.totalElements !== undefined) {
            setPagination({
              current: data.number + 1,
              pageSize: data.size,
              total: data.totalElements,
            });
          }
        },
        onError: (error) => {
          console.error("Error fetching orders:", error);
          message.error("Không thể tải danh sách đơn hàng");
        },
      });
    } finally {
      setLoading(false);
    }
  }; // Fetch returns from API
  const fetchReturns = async () => {
    try {
      _request({
        path: "/returns",
        method: "GET",
        onSuccess: (response) => {
          console.log("Raw Returns API response:", response);

          // Kiểm tra cấu trúc response
          if (!response.success) {
            console.error("Returns API returned success = false:", response);
            message.error(response.message || "Lỗi từ server");
            return;
          }

          // Xử lý cấu trúc response từ API
          const data = response.data || response;
          const returnsData = data.content || data;

          if (!Array.isArray(returnsData)) {
            console.error("Returns data is not an array:", returnsData);
            message.error("Định dạng dữ liệu đổi trả không hợp lệ");
            return;
          }

          console.log("Returns data from API:", returnsData);

          // Transform returns data để match interface
          const transformedReturns = returnsData.map((returnItem: any) => ({
            id: returnItem.id,
            returnCode: returnItem.returnCode,
            orderId: returnItem.orderId,
            orderCode: returnItem.orderCode,
            customer: returnItem.customer
              ? {
                  id: returnItem.customer.id,
                  customerCode: returnItem.customer.customerCode,
                  fullName: returnItem.customer.fullName,
                  phone: returnItem.customer.phone,
                  email: returnItem.customer.email,
                  loyaltyPoints: returnItem.customer.loyaltyPoints,
                }
              : undefined,
            type: returnItem.type,
            reason: returnItem.reason,
            totalAmount: returnItem.totalAmount,
            refundAmount: returnItem.refundAmount,
            status: returnItem.status,
            notes: returnItem.notes,
            createdAt: returnItem.createdAt,
            updatedAt: returnItem.updatedAt,
            items: (returnItem.items || []).map((item: any) => ({
              id: item.id,
              orderItemId: item.orderItemId,
              itemType: item.itemType,
              product: item.product,
              pet: item.pet,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              conditionStatus: item.conditionStatus,
              notes: item.notes,
            })),
          }));
          console.log("Transformed returns:", transformedReturns);
          setReturns(transformedReturns);

          // Cập nhật statistics với số lượng returns
          setStats((prevStats) => ({
            ...prevStats,
            returnsCount: transformedReturns.length,
          }));
        },
        onError: (error) => {
          console.error("Error fetching returns:", error);
        },
      });
    } catch (error) {
      console.error("Error fetching returns:", error);
    }
  };
  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      _request({
        path: "/orders/statistics",
        method: "GET",
        onSuccess: (response) => {
          console.log("Raw Statistics API response:", response);

          // Kiểm tra cấu trúc response
          if (!response.success) {
            console.error("Statistics API returned success = false:", response);
            message.error(response.message || "Lỗi từ server");
            return;
          }

          // Xử lý cấu trúc response từ API
          const data = response.data || response;
          const statsData = data.content || data;

          console.log("Statistics data from API:", statsData);

          // Transform statistics data để phù hợp với state
          const transformedStats = {
            totalOrders: statsData.totalOrders || 0,
            pendingOrders: statsData.pendingOrders || 0,
            completedOrders: statsData.completedOrders || 0,
            cancelledOrders: statsData.cancelledOrders || 0,
            totalRevenue: statsData.totalRevenue || 0,
            averageOrderValue: statsData.averageOrderValue || 0,
            totalCustomers: statsData.totalCustomers || 0,
            serviceOrders: statsData.serviceOrders || 0,
            productOrders: statsData.productOrders || 0,
            petOrders: statsData.petOrders || 0,
            todayOrders: statsData.todayOrders || 0, // Có thể API chưa có, giữ giá trị cũ
            returnsCount: statsData.returnsCount || 0, // Sẽ được cập nhật khi fetch returns
          };

          console.log("Transformed statistics:", transformedStats);
          setStats(transformedStats);
        },
        onError: (error) => {
          console.error("Error fetching statistics:", error);
          message.error("Không thể tải thống kê");
        },
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };
  // Handle search and filter changes
  const handleFiltersChange = useCallback(() => {
    const filterParams = {
      page: 1, // Reset to first page when filters change
      size: pagination.pageSize,
      search: searchText || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      source: sourceFilter !== "all" ? sourceFilter : undefined,
      paymentStatus:
        paymentStatusFilter !== "all" ? paymentStatusFilter : undefined,
      formDate: dateRange?.[0]?.format("YYYY-MM-DD") || undefined,
      toDate: dateRange?.[1]?.format("YYYY-MM-DD") || undefined,
    };
    fetchOrders(filterParams);
  }, [
    searchText,
    statusFilter,
    sourceFilter,
    paymentStatusFilter,
    dateRange,
    pagination.pageSize,
  ]);

  const handlePaginationChange = (page: number, pageSize?: number) => {
    const filterParams = {
      page,
      size: pageSize || pagination.pageSize,
      search: searchText || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      source: sourceFilter !== "all" ? sourceFilter : undefined,
      paymentStatus:
        paymentStatusFilter !== "all" ? paymentStatusFilter : undefined,
      fromDate: dateRange?.[0]?.format("YYYY-MM-DD") || undefined,
      toDate: dateRange?.[1]?.format("YYYY-MM-DD") || undefined,
    };
    setPagination({
      current: page,
      pageSize: pageSize || pagination.pageSize,
      total: pagination.total,
    });
    fetchOrders(filterParams);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleFiltersChange();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  useEffect(() => {
    handleFiltersChange();
  }, [statusFilter, sourceFilter, paymentStatusFilter, dateRange]);

  const filteredOrders = orders;

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      // For status 'completed', we need to check if there are incomplete services
      if (status === "completed" && selectedOrder) {
        // Check if there are any service items in the order
        const serviceItems = selectedOrder.orderItems.filter(
          (item) => item.itemType === "service"
        );

        // If there are services, check if all are completed
        if (serviceItems.length > 0) {
          const incompleteServices = serviceItems.filter(
            (service) => service.serviceStatus !== "completed"
          );

          if (incompleteServices.length > 0) {
            Modal.warning({
              title: "Không thể hoàn thành đơn hàng",
              content: (
                <div>
                  <p>
                    Đơn hàng có dịch vụ chưa hoàn thành. Vui lòng hoàn thành tất
                    cả dịch vụ trước khi hoàn thành đơn hàng.
                  </p>
                  <ul>
                    {incompleteServices.map((service, index) => (
                      <li key={index}>
                        {service.service?.name || `Dịch vụ #${service.id}`} -
                        Trạng thái:{" "}
                        {getServiceStatusText(service.serviceStatus)}
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            });
            return;
          }
        }
      }

      _request({
        path: `/orders/${orderId}/status?status=${status}`,
        method: "PUT",
        onSuccess: () => {
          message.success("Cập nhật trạng thái đơn hàng thành công");
          fetchOrders();
          setIsStatusUpdateModalVisible(false);
        },
        onError: (error) => {
          console.error("Error updating order status:", error);

          // Handle specific error cases from API
          if (error.code === "ORDER_SERVICE_INCOMPLETE") {
            Modal.error({
              title: "Không thể hoàn thành đơn hàng",
              content:
                "Có dịch vụ chưa hoàn thành. Vui lòng hoàn thành tất cả dịch vụ trước.",
            });
            return;
          }

          message.error("Không thể cập nhật trạng thái đơn hàng");
        },
      });
    } catch (error) {
      message.error("Không thể cập nhật trạng thái đơn hàng");
    }
  };

  const updatePaymentStatus = async (
    orderId: number,
    status: string = "paid"
  ) => {
    try {
      _request({
        path: `/orders/${orderId}/payment`,
        method: "POST",
        onSuccess: () => {
          message.success("Xác nhận thanh toán đơn hàng thành công");
          fetchOrders();
        },
        onError: (error) => {
          console.error("Error updating payment status:", error);
          message.error("Không thể cập nhật trạng thái thanh toán đơn hàng");
        },
      });
    } catch (error) {
      message.error("Không thể cập nhật trạng thái thanh toán đơn hàng");
    }
  };

  const createReturn = async (values: any) => {
    try {
      _request({
        path: "/returns",
        method: "POST",
        body: values,
        onSuccess: () => {
          message.success("Tạo yêu cầu đổi trả thành công");
          fetchReturns();
          setIsCreateReturnModalVisible(false);
          returnForm.resetFields();
        },
        onError: (error) => {
          console.error("Error creating return:", error);
          message.error("Không thể tạo yêu cầu đổi trả");
        },
      });
    } catch (error) {
      message.error("Không thể tạo yêu cầu đổi trả");
    }
  };

  const processReturn = async (
    returnId: number,
    action: "approve" | "reject" | "complete",
    params?: any
  ) => {
    try {
      const endpoint = `/returns/${returnId}/${action}`;
      const queryParams = new URLSearchParams(params).toString();

      _request({
        path: `${endpoint}${queryParams ? `?${queryParams}` : ""}`,
        method: "PUT",
        onSuccess: () => {
          message.success(
            `${
              action === "approve"
                ? "Phê duyệt"
                : action === "reject"
                ? "Từ chối"
                : "Hoàn thành"
            } đơn đổi trả thành công`
          );
          fetchReturns();
        },
        onError: (error) => {
          console.error(`Error ${action} return:`, error);
          message.error(
            `Không thể ${
              action === "approve"
                ? "phê duyệt"
                : action === "reject"
                ? "từ chối"
                : "hoàn thành"
            } đơn đổi trả`
          );
        },
      });
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };
  const updateServiceStatus = async (orderItemId: number, status: string) => {
    try {
      _request({
        path: `/order-items/${orderItemId}/service-status?status=${status}`,
        method: "PUT",
        onSuccess: async (response) => {
          message.success("Cập nhật trạng thái dịch vụ thành công");

          // Get the order ID - either from selectedOrder or from the API response
          let orderId = selectedOrder?.id;
          if (!orderId && response?.data?.orderId) {
            orderId = response.data.orderId;
          }

          if (orderId) {
            // Fetch updated order details to get latest service statuses
            await fetchOrderDetails(orderId);

            // If service status is completed, check if all services in the order are completed
            if (status === "completed") {
              // Check if all services are completed
              const isAllServicesCompleted = checkAllServicesCompleted();

              // If all services are completed and the order is not completed yet, automatically complete the order
              if (
                isAllServicesCompleted &&
                selectedOrder &&
                selectedOrder.status !== "completed"
              ) {
                Modal.confirm({
                  title: "Hoàn thành đơn hàng",
                  content:
                    "Tất cả dịch vụ đã hoàn thành. Bạn có muốn chuyển trạng thái đơn hàng sang hoàn thành không?",
                  okText: "Hoàn thành đơn hàng",
                  cancelText: "Để sau",
                  onOk: () => {
                    updateOrderStatus(orderId as number, "completed");
                  },
                });
              }
            }

            // Refresh orders list and detail view
            fetchOrders();
            fetchOrderDetails(orderId);
          } else {
            // Just refresh the orders list if no order ID is available
            fetchOrders();
          }
        },
        onError: (error) => {
          console.error("Error updating service status:", error);
          message.error("Không thể cập nhật trạng thái dịch vụ");
        },
      });
    } catch (error) {
      console.error("Error in updateServiceStatus:", error);
      message.error("Không thể cập nhật trạng thái dịch vụ");
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        color: "orange",
        icon: <ClockCircleOutlined />,
        text: "Chờ xử lý",
      },
      confirmed: {
        color: "blue",
        icon: <CheckCircleOutlined />,
        text: "Đã xác nhận",
      },
      processing: {
        color: "cyan",
        icon: <ExclamationCircleOutlined />,
        text: "Đang xử lý",
      },
      ready: {
        color: "purple",
        icon: <TruckOutlined />,
        text: "Sẵn sàng giao",
      },
      completed: {
        color: "green",
        icon: <CheckCircleOutlined />,
        text: "Hoàn thành",
      },
      cancelled: { color: "red", icon: <DeleteOutlined />, text: "Đã hủy" },
    };
    return (
      configs[status as keyof typeof configs] || {
        color: "default",
        icon: null,
        text: status,
      }
    );
  };

  const getPaymentStatusConfig = (status: string) => {
    const configs = {
      pending: { color: "orange", text: "Chờ thanh toán" },
      paid: { color: "green", text: "Đã thanh toán" },
      refunded: { color: "red", text: "Đã hoàn tiền" },
      partially_refunded: { color: "orange", text: "Hoàn tiền một phần" },
    };
    return (
      configs[status as keyof typeof configs] || {
        color: "default",
        text: status,
      }
    );
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons = {
      cash: <WalletOutlined />,
      card: <CreditCardOutlined />,
      bank_transfer: <BankOutlined />,
      wallet: <WalletOutlined />,
    };
    return icons[method as keyof typeof icons] || <WalletOutlined />;
  };

  const getOrderSourceConfig = (source: string) => {
    return source === "online"
      ? { icon: <GlobalOutlined />, text: "Online", color: "blue" }
      : { icon: <ShopOutlined />, text: "Tại cửa hàng", color: "green" };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const orderColumns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      key: "orderCode",
      fixed: "left" as const,
      width: 120,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 200,
      render: (_: any, record: Order) => (
        <div className="customer-info">
          <div className="customer-name">
            {record.isGuestOrder
              ? record.guestName || "Khách vãng lai"
              : record.customer?.fullName}
          </div>
          <div className="customer-contact">
            {record.isGuestOrder ? record.guestPhone : record.customer?.phone}
          </div>
        </div>
      ),
    },
    {
      title: "Nguồn",
      dataIndex: "orderSource",
      key: "orderSource",
      width: 100,
      render: (source: string) => {
        const config = getOrderSourceConfig(source);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      render: (amount: number) => (
        <Text strong style={{ color: "#1890ff" }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: "Thanh toán",
      key: "payment",
      width: 150,
      render: (_: any, record: Order) => {
        const statusConfig = getPaymentStatusConfig(record.paymentStatus);
        return (
          <div className="payment-status">
            <Tag color={statusConfig.color} className={record.paymentStatus}>
              {statusConfig.text}
            </Tag>
            <div className="payment-method">
              {getPaymentMethodIcon(record.paymentMethod)}
              <span style={{ marginLeft: "4px" }}>
                {record.paymentMethod === "cash"
                  ? "Tiền mặt"
                  : record.paymentMethod === "card"
                  ? "Thẻ"
                  : record.paymentMethod === "bank_transfer"
                  ? "Chuyển khoản"
                  : "Ví điện tử"}
              </span>
            </div>
            {record.paymentStatus === "pending" && (
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                className="confirm-payment-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  Modal.confirm({
                    title: "Xác nhận thanh toán",
                    content: `Bạn có chắc chắn muốn xác nhận thanh toán cho đơn hàng ${record.orderCode}?`,
                    okText: "Xác nhận",
                    cancelText: "Hủy",
                    onOk: () => updatePaymentStatus(record.id, "paid"),
                  });
                }}
              >
                Xác nhận
              </Button>
            )}
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string, record: Order) => {
        const hasServices =
          record.orderItems &&
          record.orderItems.some((item) => item.itemType === "service");

        // For orders with services, show the service status as the main status
        if (hasServices) {
          const serviceItems = record.orderItems.filter(
            (item) => item.itemType === "service"
          );
          const completedServices = serviceItems.filter(
            (service) => service.serviceStatus === "completed"
          ).length;
          const totalServices = serviceItems.length;

          // Get the dominant service status to display
          let serviceStatus = "pending";
          if (completedServices === totalServices) {
            serviceStatus = "completed";
          } else if (completedServices > 0) {
            serviceStatus = "in_progress";
          } else {
            // Check if any service has specific status
            const inProgressServices = serviceItems.filter(
              (s) => s.serviceStatus === "in_progress"
            ).length;
            if (inProgressServices > 0) {
              serviceStatus = "in_progress";
            }
          } // Get config for the service status
          const serviceConfig = getServiceStatusConfig(serviceStatus);

          const progressPercent = Math.round(
            (completedServices / totalServices) * 100
          );

          return (
            <div>
              {" "}
              <Tag color={serviceConfig.color} icon={serviceConfig.icon}>
                {`Dịch vụ ${serviceConfig.text.toLowerCase()}`}
              </Tag>
              <div style={{ marginTop: 8 }}>
                <Progress percent={progressPercent} size="small" />
                <Text
                  type="secondary"
                  style={{ fontSize: "12px", display: "block" }}
                >
                  {`${completedServices}/${totalServices} dịch vụ hoàn thành`}
                </Text>
              </div>
              {record.orderItems.every(
                (item) =>
                  item.serviceStatus !== "completed" &&
                  item.serviceStatus !== "cancelled"
              ) && (
                <div style={{ marginTop: 8 }}>
                  <Button
                    type="link"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchOrderDetails(record.id);
                      setSelectedOrder(record);
                      Modal.info({
                        title: "Cập nhật trạng thái dịch vụ",
                        width: 600,
                        content: (
                          <div>
                            <h3>Đơn hàng: {record.orderCode}</h3>
                            <List
                              size="small"
                              bordered
                              dataSource={serviceItems}
                              renderItem={(item) => (
                                <List.Item
                                  actions={[
                                    <Select
                                      defaultValue={
                                        item.serviceStatus || "pending"
                                      }
                                      style={{ width: 150 }}
                                      onChange={(newStatus) => {
                                        Modal.confirm({
                                          title: "Xác nhận thay đổi trạng thái",
                                          content: `Bạn có chắc chắn muốn cập nhật trạng thái dịch vụ "${
                                            item.service?.name
                                          }" sang "${
                                            newStatus === "pending"
                                              ? "Chờ xử lý"
                                              : newStatus === "in_progress"
                                              ? "Đang xử lý"
                                              : newStatus === "completed"
                                              ? "Hoàn thành"
                                              : "Hủy"
                                          }"?`,
                                          okText: "Xác nhận",
                                          cancelText: "Hủy",
                                          onOk: () =>
                                            updateServiceStatus(
                                              item.id,
                                              newStatus
                                            ),
                                        });
                                      }}
                                    >
                                      <Select.Option value="pending">
                                        Chờ xử lý
                                      </Select.Option>
                                      <Select.Option value="in_progress">
                                        Đang xử lý
                                      </Select.Option>
                                      <Select.Option value="completed">
                                        Hoàn thành
                                      </Select.Option>
                                      <Select.Option value="cancelled">
                                        Hủy
                                      </Select.Option>
                                    </Select>,
                                  ]}
                                >
                                  <div>
                                    <div>
                                      <strong>{item.service?.name}</strong>
                                    </div>
                                    <div>
                                      {item.serviceNotes && (
                                        <small>
                                          Ghi chú: {item.serviceNotes}
                                        </small>
                                      )}
                                    </div>
                                  </div>
                                </List.Item>
                              )}
                            />
                          </div>
                        ),
                        onOk() {},
                      });
                    }}
                  >
                    Cập nhật trạng thái
                  </Button>
                </div>
              )}
            </div>
          );
        }

        // For orders without services, show normal status
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      fixed: "right" as const,
      render: (_: any, record: Order) => {
        const menuItems = [
          {
            key: "view",
            label: "Xem chi tiết",
            icon: <EyeOutlined />,
            onClick: () => {
              fetchOrderDetails(record.id);
              setIsOrderDetailModalVisible(true);
            },
          },
          {
            key: "status",
            label: "Cập nhật trạng thái",
            icon: <EditOutlined />,
            disabled:
              record.status === "completed" ||
              record.status === "cancelled" ||
              record.orderItems.find((item) => item.itemType === "service"),
            onClick: () => {
              setSelectedOrder(record);
              setIsStatusUpdateModalVisible(true);
            },
          },
          {
            key: "confirmPayment",
            label: "Xác nhận thanh toán",
            icon: <DollarCircleOutlined />,
            disabled: record.paymentStatus !== "pending",
            onClick: () => {
              Modal.confirm({
                title: "Xác nhận thanh toán",
                content: `Bạn có chắc chắn muốn xác nhận thanh toán cho đơn hàng ${record.orderCode}?`,
                okText: "Xác nhận",
                cancelText: "Hủy",
                onOk: () => updatePaymentStatus(record.id, "paid"),
              });
            },
          },
          {
            key: "return",
            label: "Tạo đổi trả",
            icon: <SwapOutlined />,
            disabled: record.status !== "completed",
            onClick: () => {
              setSelectedOrder(record);
              setIsCreateReturnModalVisible(true);
            },
          },
          {
            key: "print",
            label: "In hóa đơn",
            icon: <PrinterOutlined />,
            onClick: () => {
              message.info("Chức năng in hóa đơn đang phát triển");
            },
          },
        ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  const returnColumns = [
    {
      title: "Mã đổi trả",
      dataIndex: "returnCode",
      key: "returnCode",
      width: 120,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      key: "orderCode",
      width: 120,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 200,
      render: (_: any, record: Return) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.customer?.fullName}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.customer?.phone}
          </div>
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: string) => (
        <Tag color={type === "return_" ? "red" : "blue"}>
          {type === "return_" ? "Đổi trả" : "Đổi hàng"}
        </Tag>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const configs = {
          pending: { color: "orange", text: "Chờ xử lý" },
          approved: { color: "blue", text: "Đã phê duyệt" },
          completed: { color: "green", text: "Hoàn thành" },
          rejected: { color: "red", text: "Từ chối" },
        };
        const config = configs[status as keyof typeof configs] || {
          color: "default",
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_: any, record: Return) => (
        <div className="action-buttons">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedReturn(record);
              setIsReturnModalVisible(true);
            }}
          />
          {record.status === "pending" && (
            <>
              <Popconfirm
                title="Phê duyệt đơn đổi trả?"
                onConfirm={() => processReturn(record.id, "approve")}
              >
                <Button
                  icon={<CheckCircleOutlined />}
                  size="small"
                  type="primary"
                />
              </Popconfirm>
              <Popconfirm
                title="Từ chối đơn đổi trả?"
                onConfirm={() => {
                  const reason = prompt("Lý do từ chối:");
                  if (reason) {
                    processReturn(record.id, "reject", { reason });
                  }
                }}
              >
                <Button icon={<DeleteOutlined />} size="small" danger />
              </Popconfirm>
            </>
          )}
          {record.status === "approved" && (
            <Popconfirm
              title="Hoàn thành đơn đổi trả?"
              onConfirm={() => {
                const refundAmount = prompt("Số tiền hoàn trả:");
                if (refundAmount) {
                  processReturn(record.id, "complete", { refundAmount });
                }
              }}
            >
              <Button
                icon={<CheckCircleOutlined />}
                size="small"
                type="primary"
              >
                Hoàn thành
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];
  const getServiceStatusText = (status?: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "in_progress":
        return "Đang thực hiện";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Chờ xử lý";
    }
  };

  const getServiceStatusConfig = (status?: string) => {
    const configs = {
      pending: {
        color: "orange",
        icon: <ClockCircleOutlined />,
        text: "Chờ xử lý",
      },
      in_progress: {
        color: "blue",
        icon: <ExclamationCircleOutlined />,
        text: "Đang thực hiện",
      },
      completed: {
        color: "green",
        icon: <CheckCircleOutlined />,
        text: "Đã hoàn thành",
      },
      cancelled: {
        color: "red",
        icon: <DeleteOutlined />,
        text: "Đã hủy",
      },
    };

    return (
      configs[(status || "pending") as keyof typeof configs] || configs.pending
    );
  };

  // Fetch order details by ID
  const fetchOrderDetails = async (orderId: number) => {
    if (!orderId) return;

    try {
      _request({
        path: `/orders/${orderId}`,
        method: "GET",
        onSuccess: (response) => {
          console.log("Order details API response:", response);

          if (!response.success) {
            console.error(
              "Order details API returned success = false:",
              response
            );
            message.error(response.message || "Lỗi từ server");
            return;
          }

          const orderData = response.data || response;

          const transformedOrder = {
            id: orderData.id,
            orderCode: orderData.orderCode,
            customer: orderData.customer
              ? {
                  id: orderData.customer.id,
                  customerCode: orderData.customer.customerCode,
                  fullName: orderData.customer.fullName,
                  phone: orderData.customer.phone,
                  email: orderData.customer.email,
                  loyaltyPoints: orderData.customer.loyaltyPoints,
                }
              : undefined,
            isGuestOrder: orderData.isGuestOrder || false,
            guestName: orderData.guestName,
            guestPhone: orderData.guestPhone,
            guestEmail: orderData.guestEmail,
            subtotal: orderData.subtotal || 0,
            discountAmount: orderData.discountAmount || 0,
            totalAmount: orderData.totalAmount || 0,
            loyaltyPointsUsed: orderData.loyaltyPointsUsed || 0,
            paymentMethod: orderData.paymentMethod?.toLowerCase() || "cash",
            paymentStatus: orderData.paymentStatus || "pending",
            deliveryAddress: orderData.deliveryAddress,
            deliveryMethod: orderData.deliveryMethod,
            status: orderData.status || "pending",
            orderSource: orderData.orderSource || "in_store",
            notes: orderData.notes,
            createdAt: orderData.createdAt,
            updatedAt: orderData.updatedAt,
            voucherId: orderData.voucherId,
            voucherCode: orderData.voucherCode,
            orderItems: (orderData.orderItems || []).map((item: any) => ({
              id: item.id,
              itemType: item.itemType,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              product: item.productId
                ? {
                    id: item.productId,
                    name: item.productName,
                    sku: item.productSku,
                  }
                : undefined,
              pet: item.petId
                ? {
                    id: item.petId,
                    name: item.petName,
                    species: "",
                    breed: "",
                  }
                : undefined,
              service: item.serviceId
                ? {
                    id: item.serviceId,
                    name: item.serviceName,
                    duration: "",
                  }
                : undefined,
              completionDate: item.completionDate,
              serviceNotes: item.serviceNotes,
              serviceStatus: item.serviceStatus,
              assignedEmployee: item.assignedEmployeeId
                ? {
                    id: item.assignedEmployeeId,
                    fullName: item.assignedEmployeeName,
                  }
                : undefined,
            })),
            employee: orderData.employee,
          };

          setSelectedOrder(transformedOrder);
        },
        onError: (error) => {
          console.error("Error fetching order details:", error);
          message.error("Không thể tải thông tin chi tiết đơn hàng");
        },
      });
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Không thể tải thông tin chi tiết đơn hàng");
    }
  };

  const checkAllServicesCompleted = () => {
    if (!selectedOrder) return false;

    const serviceItems = selectedOrder.orderItems.filter(
      (item) => item.itemType === "service"
    );

    if (serviceItems.length === 0) return true;

    return serviceItems.every(
      (service) => service.serviceStatus === "completed"
    );
  };
  const getServicesProgressSummary = (order = selectedOrder) => {
    if (!order) return null;

    const serviceItems = order.orderItems.filter(
      (item) => item.itemType === "service"
    );

    if (serviceItems.length === 0) return null;

    const completedServices = serviceItems.filter(
      (service) => service.serviceStatus === "completed"
    ).length;
    const inProgressServices = serviceItems.filter(
      (service) => service.serviceStatus === "in_progress"
    ).length;
    const pendingServices = serviceItems.filter(
      (service) => !service.serviceStatus || service.serviceStatus === "pending"
    ).length;
    const cancelledServices = serviceItems.filter(
      (service) => service.serviceStatus === "cancelled"
    ).length;
    const totalServices = serviceItems.length;

    const progressPercent = Math.round(
      (completedServices / totalServices) * 100
    );

    let dominantStatus = "pending";
    if (completedServices === totalServices) {
      dominantStatus = "completed";
    } else if (completedServices > 0 || inProgressServices > 0) {
      dominantStatus = "in_progress";
    }

    return {
      completedServices,
      inProgressServices,
      pendingServices,
      cancelledServices,
      totalServices,
      progressPercent,
      dominantStatus,
      isCompleted: completedServices === totalServices,
    };
  };

  return (
    <div className="order-management-page">
      <div className="statistics-section">
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={4}>
            <Card>
              <Statistic
                title="Tổng đơn hàng"
                value={stats?.totalOrders}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Chờ xử lý"
                value={stats?.pendingOrders}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Hoàn thành"
                value={stats?.completedOrders}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Đơn sản phẩm"
                value={stats?.productOrders}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Khách hàng"
                value={stats?.totalCustomers}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#13c2c2" }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Đổi trả"
                value={stats?.returnsCount}
                prefix={<UndoOutlined />}
                valueStyle={{ color: "#eb2f96" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Additional Statistics Row */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Giá trị đơn hàng TB"
                value={stats?.averageOrderValue}
                prefix={<DollarCircleOutlined />}
                valueStyle={{ color: "#1890ff" }}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Doanh thu"
                value={stats?.totalRevenue}
                prefix={<DollarCircleOutlined />}
                valueStyle={{ color: "#722ed1" }}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <Statistic
                title="Đơn thú cưng"
                value={stats?.petOrders}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đơn dịch vụ"
                value={stats?.serviceOrders}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>{" "}
          </Col>
        </Row>
      </div>
      {/* Main Content */}
      <div className="main-content-card">
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            {" "}
            <TabPane tab="Đơn hàng" key="orders">
              {/* Filters */}
              <div className="filters-section">
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={6}>
                    <Search
                      placeholder="Tìm theo mã đơn, tên khách hàng, SĐT..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      allowClear
                    />
                  </Col>
                  <Col span={3}>
                    <Select
                      value={statusFilter}
                      onChange={setStatusFilter}
                      style={{ width: "100%" }}
                      placeholder="Trạng thái"
                    >
                      <Option value="all">Tất cả trạng thái</Option>
                      <Option value="pending">Chờ xử lý</Option>
                      <Option value="confirmed">Đã xác nhận</Option>
                      <Option value="processing">Đang xử lý</Option>
                      <Option value="ready">Sẵn sàng giao</Option>
                      <Option value="completed">Hoàn thành</Option>
                      <Option value="cancelled">Đã hủy</Option>
                    </Select>
                  </Col>
                  {/* <Col span={3}>
                    <Select
                      value={sourceFilter}
                      onChange={setSourceFilter}
                      style={{ width: "100%" }}
                      placeholder="Nguồn đơn"
                    >
                      <Option value="all">Tất cả nguồn</Option>
                      <Option value="online">Online</Option>
                      <Option value="in_store">Tại cửa hàng</Option>
                    </Select>
                  </Col> */}
                  {/* <Col span={3}>
                    <Select
                      value={paymentStatusFilter}
                      onChange={setPaymentStatusFilter}
                      style={{ width: "100%" }}
                      placeholder="Thanh toán"
                    >
                      <Option value="all">Tất cả thanh toán</Option>
                      <Option value="pending">Chờ thanh toán</Option>
                      <Option value="paid">Đã thanh toán</Option>
                      <Option value="refunded">Đã hoàn tiền</Option>
                    </Select>
                  </Col> */}
                  <Col span={4}>
                    <RangePicker
                      value={dateRange}
                      onChange={(dates) =>
                        setDateRange(dates as [Dayjs, Dayjs] | null)
                      }
                      style={{ width: "100%" }}
                      placeholder={["Từ ngày", "Đến ngày"]}
                    />
                  </Col>
                  {/* <Col span={5}>
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={handleFiltersChange} />
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={() =>
                      message.info("Chức năng tạo đơn hàng đang phát triển")
                    }
                  >
                    Tạo đơn hàng
                  </Button>
                </Space>              </Col> */}
                </Row>
              </div>{" "}
              {/* Orders Table */}
              <div className="orders-table">
                <Table
                  columns={orderColumns}
                  dataSource={filteredOrders}
                  rowKey="id"
                  loading={loading}
                  scroll={{ x: 1200 }}
                  pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Tổng ${total} đơn hàng`,
                    onChange: handlePaginationChange,
                  }}
                />
              </div>
            </TabPane>{" "}
            <TabPane tab="Đổi trả" key="returns">
              <div className="filters-section">
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={18}>
                    <Search
                      placeholder="Tìm theo mã đổi trả, mã đơn hàng..."
                      allowClear
                    />
                  </Col>
                  <Col span={6}>
                    <Space>
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={() => fetchReturns()}
                      />
                    </Space>
                  </Col>
                </Row>
              </div>

              <div className="returns-table">
                <Table
                  columns={returnColumns}
                  dataSource={returns}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    total: returns?.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Tổng ${total} đơn đổi trả`,
                  }}
                />
              </div>
            </TabPane>{" "}
          </Tabs>
        </Card>
      </div>{" "}
      {/* Order Detail Modal */}{" "}
      <Modal
        title={`Chi tiết đơn hàng ${selectedOrder?.orderCode}`}
        open={isOrderDetailModalVisible}
        onCancel={() => setIsOrderDetailModalVisible(false)}
        afterClose={() => setSelectedOrder(null)}
        width={800}
        className="order-detail-modal"
        footer={[
          <Button
            key="close"
            onClick={() => setIsOrderDetailModalVisible(false)}
          >
            Đóng
          </Button>,
          <Button key="print" icon={<PrinterOutlined />}>
            In hóa đơn
          </Button>,
        ]}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Mã đơn hàng">
                {selectedOrder.orderCode}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusConfig(selectedOrder.status).color}>
                  {getStatusConfig(selectedOrder.status).text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">
                {selectedOrder.isGuestOrder
                  ? selectedOrder.guestName || "Khách vãng lai"
                  : selectedOrder.customer?.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.isGuestOrder
                  ? selectedOrder.guestPhone
                  : selectedOrder.customer?.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Nguồn đơn hàng">
                <Tag
                  color={getOrderSourceConfig(selectedOrder.orderSource).color}
                >
                  {getOrderSourceConfig(selectedOrder.orderSource).text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thanh toán">
                <Tag
                  color={
                    getPaymentStatusConfig(selectedOrder.paymentStatus).color
                  }
                >
                  {getPaymentStatusConfig(selectedOrder.paymentStatus).text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {getPaymentMethodIcon(selectedOrder.paymentMethod)}
                <span style={{ marginLeft: 8 }}>
                  {selectedOrder.paymentMethod === "cash"
                    ? "Tiền mặt"
                    : selectedOrder.paymentMethod === "card"
                    ? "Thẻ"
                    : selectedOrder.paymentMethod === "bank_transfer"
                    ? "Chuyển khoản"
                    : "Ví điện tử"}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {dayjs(selectedOrder.createdAt).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>
              {selectedOrder.deliveryAddress && (
                <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
                  {selectedOrder.deliveryAddress}
                </Descriptions.Item>
              )}
              {selectedOrder.notes && (
                <Descriptions.Item label="Ghi chú" span={2}>
                  {selectedOrder.notes}
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedOrder.orderItems.some(
              (item) => item.itemType === "service"
            ) && (
              <div
                style={{
                  marginBottom: 16,
                  padding: 16,
                  background: "#f5f5f5",
                  borderRadius: 8,
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Trạng thái dịch vụ:</Text>
                </div>
                {(() => {
                  const summary = getServicesProgressSummary();
                  if (!summary) return null;

                  return (
                    <>
                      <Progress
                        percent={summary.progressPercent}
                        status={summary.isCompleted ? "success" : "active"}
                        style={{ marginBottom: 8 }}
                      />
                      <div>
                        <Tag
                          color={summary.isCompleted ? "green" : "processing"}
                        >
                          {summary.completedServices}/{summary.totalServices}{" "}
                          dịch vụ đã hoàn thành
                        </Tag>

                        {selectedOrder.status !== "completed" &&
                          summary.isCompleted && (
                            <Button
                              type="primary"
                              size="small"
                              style={{ marginLeft: 8 }}
                              onClick={() => {
                                Modal.confirm({
                                  title: "Hoàn thành đơn hàng",
                                  content:
                                    "Tất cả dịch vụ đã hoàn thành. Bạn có muốn chuyển trạng thái đơn hàng sang hoàn thành không?",
                                  okText: "Hoàn thành đơn hàng",
                                  cancelText: "Để sau",
                                  onOk: () =>
                                    updateOrderStatus(
                                      selectedOrder.id,
                                      "completed"
                                    ),
                                });
                              }}
                            >
                              Hoàn thành đơn hàng
                            </Button>
                          )}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            <Divider>Chi tiết sản phẩm</Divider>
            <List
              dataSource={selectedOrder.orderItems}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={
                          item.itemType === "product" ? (
                            <ShoppingCartOutlined />
                          ) : item.itemType === "pet" ? (
                            <UserOutlined />
                          ) : (
                            <FileTextOutlined />
                          )
                        }
                      />
                    }
                    title={
                      item.itemType === "product"
                        ? item.product?.name
                        : item.itemType === "pet"
                        ? item.pet?.name
                        : item.service?.name
                    }
                    description={
                      <div>
                        {" "}
                        <div>Số lượng: {item.quantity}</div>
                        <div>Đơn giá: {formatCurrency(item.unitPrice)}</div>
                        {item.serviceNotes && (
                          <>
                            <div>Ghi chú: {item.serviceNotes}</div>
                            <div>Thời gian hoàn thành dự kiến: {item.completionDate}</div>
                          </>
                        )}
                        {item.itemType === "service" && (
                          <div>
                            <div style={{ marginTop: "8px" }}>
                              <Tag
                                color={
                                  item.serviceStatus === "completed"
                                    ? "green"
                                    : item.serviceStatus === "in_progress"
                                    ? "blue"
                                    : item.serviceStatus === "cancelled"
                                    ? "red"
                                    : "orange"
                                }
                              >
                                Trạng thái:{" "}
                                {getServiceStatusText(item.serviceStatus)}
                              </Tag>
                              {/* {selectedOrder?.status !== "completed" &&
                                selectedOrder?.status !== "cancelled" && (
                                  <div style={{ marginTop: "6px" }}>
                                    {" "}
                                    <Button
                                      type={
                                        item.serviceStatus === "completed"
                                          ? "default"
                                          : "primary"
                                      }
                                      size="small"
                                      icon={
                                        item.serviceStatus === "completed" ? (
                                          <CheckCircleOutlined />
                                        ) : (
                                          <EditOutlined />
                                        )
                                      }
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        Modal.confirm({
                                          title: "Cập nhật trạng thái dịch vụ",
                                          content: (
                                            <div>
                                              <p>
                                                Dịch vụ:{" "}
                                                <strong>
                                                  {item.service?.name}
                                                </strong>
                                              </p>
                                              <Radio.Group
                                                defaultValue={
                                                  item.serviceStatus ||
                                                  "pending"
                                                }
                                                onChange={(e) => {
                                                  const newStatus =
                                                    e.target.value;
                                                  Modal.confirm({
                                                    title:
                                                      "Xác nhận thay đổi trạng thái",
                                                    content: `Bạn có chắc chắn muốn thay đổi trạng thái dịch vụ thành "${getServiceStatusText(
                                                      newStatus
                                                    )}"?`,
                                                    onOk: () =>
                                                      updateServiceStatus(
                                                        item.id,
                                                        newStatus
                                                      ),
                                                  });
                                                }}
                                              >
                                                <Radio.Button value="pending">
                                                  Chờ xử lý
                                                </Radio.Button>
                                                <Radio.Button value="in_progress">
                                                  Đang xử lý
                                                </Radio.Button>
                                                <Radio.Button value="completed">
                                                  Hoàn thành
                                                </Radio.Button>
                                              </Radio.Group>
                                            </div>
                                          ),
                                          footer: null,
                                        });
                                      }}
                                    >
                                      {item.serviceStatus === "completed"
                                        ? "Đã hoàn thành"
                                        : "Cập nhật trạng thái"}
                                    </Button>
                                  </div>
                                )} */}
                            </div>
                          </div>
                        )}
                      </div>
                    }
                  />
                  <div style={{ fontWeight: "bold" }}>
                    {formatCurrency(item.totalPrice)}
                  </div>
                </List.Item>
              )}
            />

            <Divider />
            <Row justify="end">
              <Col span={8}>
                <div style={{ textAlign: "right" }}>
                  <div>Tạm tính: {formatCurrency(selectedOrder.subtotal)}</div>
                  {selectedOrder.discountAmount > 0 && (
                    <div style={{ color: "#ff4d4f" }}>
                      Giảm giá: -{formatCurrency(selectedOrder.discountAmount)}
                    </div>
                  )}
                  {selectedOrder.loyaltyPointsUsed &&
                    selectedOrder.loyaltyPointsUsed > 0 && (
                      <div style={{ color: "#ff4d4f" }}>
                        Điểm tích lũy: -
                        {formatCurrency(selectedOrder.loyaltyPointsUsed * 1000)}
                      </div>
                    )}
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    Tổng cộng: {formatCurrency(selectedOrder.totalAmount)}
                  </div>
                </div>
              </Col>
            </Row>

            {/* Service status summary */}
            {getServicesProgressSummary() && (
              <div
                style={{
                  marginTop: 16,
                  padding: 10,
                  background: "#f6ffed",
                  border: "1px solid #b7eb8f",
                  borderRadius: 4,
                }}
              >
                <Text strong>Tiến độ dịch vụ:</Text>
                <div style={{ marginTop: 8 }}>
                  <Progress
                    percent={getServicesProgressSummary()?.progressPercent}
                    status={
                      getServicesProgressSummary()?.isCompleted
                        ? "success"
                        : "active"
                    }
                    strokeColor={
                      getServicesProgressSummary()?.isCompleted
                        ? "#52c41a"
                        : "#1890ff"
                    }
                    trailColor="#f0f0f0"
                    showInfo={true}
                  />
                </div>
                <div style={{ marginTop: 8, fontSize: 14, color: "#333" }}>
                  {getServicesProgressSummary()?.completedServices} /{" "}
                  {getServicesProgressSummary()?.totalServices} dịch vụ đã hoàn
                  thành
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>{" "}
      {/* Status Update Modal */}
      <Modal
        title="Cập nhật trạng thái đơn hàng"
        open={isStatusUpdateModalVisible}
        onOk={() => statusForm.submit()}
        onCancel={() => setIsStatusUpdateModalVisible(false)}
        className="status-update-modal"
      >
        <Form
          form={statusForm}
          onFinish={(values) => {
            if (selectedOrder) {
              updateOrderStatus(selectedOrder.id, values.status);
            }
          }}
        >
          {" "}
          {selectedOrder &&
            selectedOrder.orderItems.some(
              (item) => item.itemType === "service"
            ) && (
              <div
                style={{
                  marginBottom: 16,
                  padding: 10,
                  background: "#fffbe6",
                  border: "1px solid #ffe58f",
                  borderRadius: 4,
                }}
              >
                <Text strong>Lưu ý:</Text> Đơn hàng này có dịch vụ.
                <div style={{ marginTop: 8 }}>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    <li>
                      Đơn hàng có dịch vụ không thể chuyển trực tiếp từ trạng
                      thái "Chờ xử lý" sang "Hoàn thành"
                    </li>
                    <li>
                      Đơn hàng chỉ có thể hoàn thành khi tất cả các dịch vụ đều
                      đã được hoàn thành
                    </li>
                  </ul>
                </div>
              </div>
            )}
          <Form.Item
            label="Trạng thái mới"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select
              placeholder="Chọn trạng thái"
              onChange={(value) => {
                if (value === "completed" && selectedOrder) {
                  const serviceItems = selectedOrder.orderItems.filter(
                    (item) => item.itemType === "service"
                  );
                  if (serviceItems.length > 0) {
                    const incompleteServices = serviceItems.filter(
                      (service) => service.serviceStatus !== "completed"
                    );
                    if (incompleteServices.length > 0) {
                      message.warning(
                        "Cảnh báo: Có dịch vụ chưa hoàn thành trong đơn hàng"
                      );
                    }
                  }
                }
              }}
            >
              <Option value="pending">Chờ xử lý</Option>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="processing">Đang xử lý</Option>
              <Option value="ready">Sẵn sàng giao</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="cancelled">Hủy đơn</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>{" "}
      {/* Create Return Modal */}
      <Modal
        title="Tạo yêu cầu đổi trả"
        open={isCreateReturnModalVisible}
        onOk={() => returnForm.submit()}
        onCancel={() => setIsCreateReturnModalVisible(false)}
        width={600}
        className="create-return-modal"
      >
        <Form
          form={returnForm}
          layout="vertical"
          onFinish={createReturn}
          className="return-form"
        >
          <Form.Item
            label="Loại yêu cầu"
            name="type"
            rules={[{ required: true, message: "Vui lòng chọn loại yêu cầu" }]}
          >
            <Radio.Group>
              <Radio value="return_">Đổi trả (hoàn tiền)</Radio>
              <Radio value="exchange">Đổi hàng</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Lý do"
            name="reason"
            rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập lý do đổi trả" />
          </Form.Item>
          <Form.Item label="Ghi chú" name="notes">
            <Input.TextArea rows={2} placeholder="Ghi chú thêm (tùy chọn)" />
          </Form.Item>{" "}
          <Form.Item label="Sản phẩm đổi trả">
            <div className="return-items">
              {selectedOrder?.orderItems.map((item, index) => (
                <div key={item.id} className="return-item">
                  <Row gutter={8} align="middle">
                    <Col span={1}>
                      <Form.Item
                        name={["items", index, "selected"]}
                        valuePropName="checked"
                        style={{ marginBottom: 0 }}
                      >
                        <input type="checkbox" />
                      </Form.Item>{" "}
                    </Col>
                    <Col span={12}>
                      <div className="item-info">
                        {item.itemType === "product"
                          ? item.product?.name
                          : item.itemType === "pet"
                          ? item.pet?.name
                          : item.service?.name}
                      </div>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name={["items", index, "quantity"]}
                        style={{ marginBottom: 0 }}
                      >
                        <InputNumber
                          min={1}
                          max={item.quantity}
                          placeholder="SL"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        name={["items", index, "conditionStatus"]}
                        style={{ marginBottom: 0 }}
                      >
                        <Select
                          placeholder="Tình trạng"
                          style={{ width: "100%" }}
                        >
                          <Option value="new_">Mới</Option>
                          <Option value="good">Tốt</Option>
                          <Option value="damaged">Hỏng</Option>
                          <Option value="defective">Lỗi</Option>
                        </Select>
                      </Form.Item>
                    </Col>{" "}
                  </Row>
                </div>
              ))}
            </div>
          </Form.Item>
        </Form>
      </Modal>{" "}
      {/* Return Detail Modal */}
      <Modal
        title={`Chi tiết đơn đổi trả ${selectedReturn?.returnCode}`}
        open={isReturnModalVisible}
        onCancel={() => setIsReturnModalVisible(false)}
        width={600}
        className="return-detail-modal"
        footer={[
          <Button key="close" onClick={() => setIsReturnModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedReturn && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mã đổi trả">
              {selectedReturn.returnCode}
            </Descriptions.Item>
            <Descriptions.Item label="Mã đơn hàng">
              {selectedReturn.orderCode}
            </Descriptions.Item>
            <Descriptions.Item label="Khách hàng">
              {selectedReturn.customer?.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Loại">
              <Tag color={selectedReturn.type === "return_" ? "red" : "blue"}>
                {selectedReturn.type === "return_" ? "Đổi trả" : "Đổi hàng"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Lý do">
              {selectedReturn.reason}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              {formatCurrency(selectedReturn.totalAmount)}
            </Descriptions.Item>
            {selectedReturn.refundAmount && (
              <Descriptions.Item label="Số tiền hoàn trả">
                {formatCurrency(selectedReturn.refundAmount)}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={
                  selectedReturn.status === "pending"
                    ? "orange"
                    : selectedReturn.status === "approved"
                    ? "blue"
                    : selectedReturn.status === "completed"
                    ? "green"
                    : "red"
                }
              >
                {selectedReturn.status === "pending"
                  ? "Chờ xử lý"
                  : selectedReturn.status === "approved"
                  ? "Đã phê duyệt"
                  : selectedReturn.status === "completed"
                  ? "Hoàn thành"
                  : "Từ chối"}
              </Tag>
            </Descriptions.Item>
            {selectedReturn.rejectionReason && (
              <Descriptions.Item label="Lý do từ chối">
                {selectedReturn.rejectionReason}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Ngày tạo">
              {dayjs(selectedReturn.createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagementPage;
