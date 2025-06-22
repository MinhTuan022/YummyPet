import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Tag,
  Dropdown,
  Avatar,
  Checkbox,
  Space,
  Select,
  MenuProps,
  Modal,
  message,
  Tabs,
  Card,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  MoreOutlined,
  PhoneOutlined,
  MailOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ShoppingOutlined,
  StopOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { _request } from "../../../network/Api";

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface Customer {
  id: number;
  customerCode: string;
  fullName: string;
  phone: string;
  email: string;
  address?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | null;
  loyaltyPoints: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  hasAccount: boolean;
}

interface OrderSummaryDTO {
  id: number;
  createdAt: string;
  deliveryMethod: string;
  totalAmount: number;
  status: string;
  totalItems: number;
}

interface ServiceOrderSummaryDTO {
  id: number;
  createdAt: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
}

interface CustomerPetSummaryDTO {
  id: number;
  breed: string;
  gender: string;
  age: number;
  weight: number;
  specialNotes: string;
}

interface CustomerDetail extends Customer {
  pets: CustomerPetSummaryDTO[];
  recentOrders: OrderSummaryDTO[];
  recentServiceOrders: ServiceOrderSummaryDTO[];
  loyaltyHistory: any[];
}

const CustomerPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-based indexing
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend">("ascend");
  
  // Data states
  const [customersData, setCustomersData] = useState<Customer[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [customerDetailModal, setCustomerDetailModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [orderHistoryModal, setOrderHistoryModal] = useState(false);
  const [orderHistoryLoading, setOrderHistoryLoading] = useState(false);
  const [selectedCustomerOrders, setSelectedCustomerOrders] = useState<{
    customer: Customer;
    orders: OrderSummaryDTO[];
    serviceOrders: ServiceOrderSummaryDTO[];
  } | null>(null);  useEffect(() => {
    fetchCustomers();
  }, [currentPage, pageSize, sortField, sortOrder, searchText]);

  const fetchCustomers = () => {
    setLoading(true);
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', currentPage.toString());
    queryParams.append('size', pageSize.toString());
    
    if (sortField) {
      queryParams.append('sortBy', sortField);
      queryParams.append('sortDir', sortOrder === 'ascend' ? 'asc' : 'desc');
    }
    
    let apiPath = '/customers';
    if (searchText) {
      apiPath = '/customers/search';
      queryParams.append('keyword', searchText);
    }
    
    const pathWithParams = `${apiPath}?${queryParams.toString()}`;
    
    _request({
      path: pathWithParams,
      method: "GET",
      onSuccess(response) {
        if (response.success && response.data) {
          const customers = response.data.content || [];
          setCustomersData(customers);
          setTotalElements(response.data.totalElements || 0);
          setTotalPages(response.data.totalPages || 0);
        }
        setLoading(false);
      },
      onError(error) {
        console.error("Error fetching customers:", error);
        setLoading(false);
        // Fallback data for demo with updated structure
        // const fallbackData = [
        //   {
        //     id: 1,
        //     customerCode: "CUS000001",
        //     fullName: "Nguyễn Văn An",
        //     phone: "0901234567",
        //     email: "an.nguyen@email.com",
        //     address: "123 Nguyễn Trãi, Hà Nội",
        //     gender: "male" as const,
        //     dateOfBirth: "1990-05-15",
        //     loyaltyPoints: 1250,
        //     isActive: true,
        //     createdAt: "2024-01-15T08:30:00.000Z",
        //     updatedAt: "2024-06-10T14:20:00.000Z",
        //     hasAccount: true,
        //   },
        //   {
        //     id: 2,
        //     customerCode: "CUS000002",
        //     fullName: "Trần Thị Bình",
        //     phone: "0912345678",
        //     email: "binh.tran@email.com",
        //     address: "456 Lê Lợi, TP.HCM",
        //     gender: "female" as const,
        //     dateOfBirth: "1985-08-22",
        //     loyaltyPoints: 2100,
        //     isActive: true,
        //     createdAt: "2024-02-20T10:15:00.000Z",
        //     updatedAt: "2024-06-12T16:45:00.000Z",
        //     hasAccount: true,
        //   },
        //   {
        //     id: 3,
        //     customerCode: "CUS000003",
        //     fullName: "Lê Minh Cường",
        //     phone: "0923456789",
        //     email: "cuong.le@email.com",
        //     address: "789 Trần Hưng Đạo, Đà Nẵng",
        //     gender: "male" as const,
        //     dateOfBirth: "1992-12-03",
        //     loyaltyPoints: 850,
        //     isActive: false,
        //     createdAt: "2024-03-10T14:20:00.000Z",
        //     updatedAt: "2024-06-05T09:30:00.000Z",
        //     hasAccount: false,
        //   },
        // ];
        // setCustomersData(fallbackData);
        // setTotalElements(fallbackData.length);
        // setTotalPages(1);
      },
    });
  };  // Since API handles pagination and search, we don't need client-side filtering
  const currentPageData = customersData;

  // Handle individual customer actions
  const handleEditCustomer = (customer: Customer) => {
    message.info(`Chỉnh sửa khách hàng: ${customer.fullName}`);
    // Implementation for edit functionality
  };

  const handleViewCustomer = (customer: Customer) => {
    setDetailLoading(true);
    setCustomerDetailModal(true);
    
    _request({
      path: `/customers/${customer.id}/details`,
      method: "GET",
      onSuccess(data) {
        setSelectedCustomer(data.data);
        setDetailLoading(false);
      },
      onError(error) {
        console.error("Error fetching customer details:", error);
        // Mock data for demo
        const mockCustomerDetail: CustomerDetail = {
          ...customer,
          pets: [
            {
              id: 1,
              breed: "Golden Retriever",
              gender: "Đực",
              age: 3,
              weight: 25.5,
              specialNotes: "Dị ứng với thức ăn chứa gà"
            },
            {
              id: 2,
              breed: "Mèo Ba Tư",
              gender: "Cái",
              age: 2,
              weight: 4.2,
              specialNotes: "Cần tắm thường xuyên"
            }
          ],
          recentOrders: [
            {
              id: 101,
              createdAt: "2024-06-10T14:30:00.000Z",
              deliveryMethod: "Giao hàng tận nơi",
              totalAmount: 450000,
              status: "Đã hoàn thành",
              totalItems: 3
            },
            {
              id: 98,
              createdAt: "2024-05-25T09:15:00.000Z",
              deliveryMethod: "Nhận tại cửa hàng",
              totalAmount: 280000,
              status: "Đã hoàn thành",
              totalItems: 2
            },
            {
              id: 87,
              createdAt: "2024-05-10T16:45:00.000Z",
              deliveryMethod: "Giao hàng tận nơi",
              totalAmount: 650000,
              status: "Đã hủy",
              totalItems: 5
            }
          ],
          recentServiceOrders: [
            {
              id: 201,
              createdAt: "2024-06-08T10:00:00.000Z",
              totalAmount: 300000,
              status: "Đã hoàn thành",
              paymentMethod: "Thẻ tín dụng"
            },
            {
              id: 195,
              createdAt: "2024-05-20T14:30:00.000Z",
              totalAmount: 150000,
              status: "Đã hoàn thành",
              paymentMethod: "Tiền mặt"
            }
          ],
          loyaltyHistory: []
        };
        setSelectedCustomer(mockCustomerDetail);
        setDetailLoading(false);
      },
    });
  };

  const handleViewOrderHistory = (customer: Customer) => {
  setOrderHistoryLoading(true);
  setOrderHistoryModal(true);
  
  _request({
    path: `/customers/${customer.id}/details`,
    method: "GET",
    onSuccess(data) {
      setSelectedCustomerOrders({
        customer: customer,
        orders: data.data.recentOrders || [],
        serviceOrders: data.data.recentServiceOrders || []
      });
      setOrderHistoryLoading(false);
    },
    onError(error) {
      console.error("Error fetching customer order history:", error);
      // Mock data for demo
      const mockOrderHistory = {
        customer: customer,
        orders: [
          {
            id: 101,
            createdAt: "2024-06-10T14:30:00.000Z",
            deliveryMethod: "Giao hàng tận nơi",
            totalAmount: 450000,
            status: "Đã hoàn thành",
            totalItems: 3
          },
          {
            id: 98,
            createdAt: "2024-05-25T09:15:00.000Z",
            deliveryMethod: "Nhận tại cửa hàng",
            totalAmount: 280000,
            status: "Đã hoàn thành",
            totalItems: 2
          },
          {
            id: 87,
            createdAt: "2024-05-10T16:45:00.000Z",
            deliveryMethod: "Giao hàng tận nơi",
            totalAmount: 650000,
            status: "Đã hủy",
            totalItems: 5
          },
          {
            id: 75,
            createdAt: "2024-04-20T11:20:00.000Z",
            deliveryMethod: "Nhận tại cửa hàng",
            totalAmount: 320000,
            status: "Đã hoàn thành",
            totalItems: 2
          },
          {
            id: 62,
            createdAt: "2024-04-05T16:10:00.000Z",
            deliveryMethod: "Giao hàng tận nơi",
            totalAmount: 580000,
            status: "Đã hoàn thành",
            totalItems: 4
          }
        ],
        serviceOrders: [
          {
            id: 201,
            createdAt: "2024-06-08T10:00:00.000Z",
            totalAmount: 300000,
            status: "Đã hoàn thành",
            paymentMethod: "Thẻ tín dụng"
          },
          {
            id: 195,
            createdAt: "2024-05-20T14:30:00.000Z",
            totalAmount: 150000,
            status: "Đã hoàn thành",
            paymentMethod: "Tiền mặt"
          },
          {
            id: 180,
            createdAt: "2024-04-15T09:45:00.000Z",
            totalAmount: 200000,
            status: "Đã hoàn thành",
            paymentMethod: "Chuyển khoản"
          }
        ]
      };
      setSelectedCustomerOrders(mockOrderHistory);
      setOrderHistoryLoading(false);
    },
  });
};
  const handleToggleAccountStatus = (customer: Customer) => {
    const newStatus = !customer.isActive;
    const action = newStatus ? "kích hoạt" : "tạm khóa";
    const apiPath = newStatus ? `/customers/${customer.id}/restore` : `/customers/${customer.id}/soft-delete`;
    
    Modal.confirm({
      title: `Xác nhận ${action} tài khoản`,
      content: `Bạn có chắc muốn ${action} tài khoản của ${customer.fullName}?`,
      onOk: () => {
        _request({
          path: apiPath,
          method: "PUT",
          onSuccess() {
            // Refresh data after status change
            fetchCustomers();
            message.success(`Đã ${action} tài khoản của ${customer.fullName}`);
          },
          onError(error) {
            console.error(`Error ${action} customer:`, error);
            message.error(`Không thể ${action} tài khoản`);
          },
        });
      },
    });
  };

  const handleDeleteCustomer = (customer: Customer) => {
    Modal.confirm({
      title: 'Xác nhận xóa vĩnh viễn',
      content: (
        <div>
          <p>Bạn có chắc muốn xóa vĩnh viễn khách hàng <strong>{customer.fullName}</strong>?</p>
          <p style={{ color: '#ff4d4f', fontSize: '13px' }}>
            ⚠️ Hành động này sẽ xóa hoàn toàn dữ liệu và không thể khôi phục.
          </p>
        </div>
      ),
      okText: 'Xóa vĩnh viễn',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        _request({
          path: `/customers/${customer.id}/hard-delete`,
          method: "DELETE",
          onSuccess() {
            // Refresh data after deletion
            fetchCustomers();
            message.success(`Đã xóa vĩnh viễn khách hàng ${customer.fullName}`);
            // Remove from selected if it was selected
            setSelectedRowKeys(prev => prev.filter(key => key !== customer.id));
          },
          onError(error) {
            console.error("Error deleting customer:", error);
            message.error("Không thể xóa khách hàng");
          },
        });
      },
    });
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    Modal.confirm({
      title: 'Xác nhận xóa vĩnh viễn hàng loạt',
      content: (
        <div>
          <p>Bạn có chắc muốn xóa vĩnh viễn <strong>{selectedRowKeys.length}</strong> khách hàng đã chọn?</p>
          <p style={{ color: '#ff4d4f', fontSize: '13px' }}>
            ⚠️ Hành động này sẽ xóa hoàn toàn dữ liệu và không thể khôi phục.
          </p>
        </div>
      ),
      okText: 'Xóa vĩnh viễn tất cả',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        const deletePromises = selectedRowKeys.map(id => 
          new Promise((resolve, reject) => {
            _request({
              path: `/customers/${id}/hard-delete`,
              method: "DELETE",
              onSuccess: resolve,
              onError: reject,
            });
          })
        );

        try {
          await Promise.all(deletePromises);
          // Refresh data after bulk deletion
          fetchCustomers();
          message.success(`Đã xóa vĩnh viễn ${selectedRowKeys.length} khách hàng`);
          setSelectedRowKeys([]);
        } catch (error) {
          console.error("Error bulk deleting customers:", error);
          message.error("Có lỗi xảy ra khi xóa một số khách hàng");
          // Refresh data to get current state
          fetchCustomers();
          setSelectedRowKeys([]);
        }
      },
    });
  };

  const getActionItems = (customer: Customer): MenuProps["items"] => [
    {
      key: "edit",
      label: "Chỉnh sửa",
      icon: <EditOutlined />,
      onClick: () => handleEditCustomer(customer),
    },
    {
      key: "view",
      label: "Xem chi tiết",
      icon: <EyeOutlined />,
      onClick: () => handleViewCustomer(customer),
    },
    {
      key: "history",
      label: "Lịch sử mua hàng",
      icon: <ShoppingOutlined />,
      onClick: () => handleViewOrderHistory(customer),
    },
    {
      key: "toggle-status",
      label: customer.isActive ? "Tạm khóa tài khoản" : "Kích hoạt tài khoản",
      icon: <StopOutlined />,
      onClick: () => handleToggleAccountStatus(customer),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Xóa vĩnh viễn",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDeleteCustomer(customer),
    },
  ];
  const handleTableChange = (_: any, __: any, sorter: any) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
  const getAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'đã hoàn thành':
        return 'green';
      case 'đang xử lý':
        return 'blue';
      case 'đã hủy':
        return 'red';
      case 'chờ thanh toán':
        return 'orange';
      default:
        return 'default';
    }
  };

  const orderColumns: ColumnsType<OrderSummaryDTO> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      render: (id: number) => `#${id}`,
      width: 120,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      render: formatDateTime,
      width: 160,
    },
    {
      title: 'Phương thức giao hàng',
      dataIndex: 'deliveryMethod',
      width: 180,
    },
    {
      title: 'Số lượng',
      dataIndex: 'totalItems',
      render: (items: number) => `${items} sản phẩm`,
      width: 120,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      render: formatCurrency,
      width: 140,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
      width: 120,
    },
  ];

  const serviceOrderColumns: ColumnsType<ServiceOrderSummaryDTO> = [
    {
      title: 'Mã dịch vụ',
      dataIndex: 'id',
      render: (id: number) => `#SV${id}`,
      width: 120,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      render: formatDateTime,
      width: 160,
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      width: 180,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      render: formatCurrency,
      width: 140,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
      width: 120,
    },
  ];

  const columns: ColumnsType<Customer> = [
    {
      title: "Thông tin khách hàng",
      dataIndex: "customer",
      render: (_, record) => (        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            size={45}
            style={{
              backgroundColor: record.gender === "male" ? "#1890ff" : record.gender === "female" ? "#ff69b4" : "#8c8c8c",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {record.fullName.split(" ").pop()?.charAt(0)}
          </Avatar>
          <div>
            <div
              style={{ fontWeight: "600", fontSize: "14px", color: "#262626" }}
            >
              {record.fullName}
            </div>
            <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
              {record.customerCode} • {getAge(record.dateOfBirth)} tuổi
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Liên hệ",
      dataIndex: "contact",
      render: (_, record) => (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "4px",
            }}
          >
            <PhoneOutlined style={{ color: "#52c41a", fontSize: "12px" }} />
            <span style={{ fontSize: "13px" }}>{record.phone}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <MailOutlined style={{ color: "#1890ff", fontSize: "12px" }} />
            <span style={{ fontSize: "13px", color: "#595959" }}>
              {record.email}
            </span>
          </div>
        </div>
      ),
    },    {
      title: "Giới tính",
      dataIndex: "gender",
      sorter: true,
      render: (gender: "male" | "female" | null) => (
        <Tag color={gender === "male" ? "blue" : gender === "female" ? "pink" : "default"}>
          {gender === "male" ? "Nam" : gender === "female" ? "Nữ" : "Chưa cập nhật"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: true,
      render: (date: string) => formatDate(date),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"} style={{ fontWeight: "500" }}>
          {isActive ? "Hoạt động" : "Ngưng hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Điểm tích lũy",
      dataIndex: "loyaltyPoints",
      render: (points: number) => (
        <span
          style={{
            color:
              points > 1500 ? "#52c41a" : points > 1000 ? "#fa8c16" : "#8c8c8c",
            fontWeight: "600",
          }}
        >
          {points.toLocaleString()} điểm
        </span>
      ),
      sorter: true,
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      render: (_, record) => (
        <Dropdown 
          menu={{ items: getActionItems(record) }} 
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    onSelectAll: (selected: boolean) => {
      if (selected) {
        // Select all current page items
        const allCurrentPageKeys = currentPageData.map(item => item.id);
        setSelectedRowKeys(prev => [...new Set([...prev, ...allCurrentPageKeys])]);
      } else {
        // Deselect all current page items
        const currentPageKeys = currentPageData.map(item => item.id);
        setSelectedRowKeys(prev => prev.filter(key => !currentPageKeys.includes(key as number)));
      }
    },
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(0); // Reset to first page for API
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0); // Reset to first page for API
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  // Calculate display values (API uses 0-based indexing, but display is 1-based)
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Search
                placeholder="Tìm kiếm theo tên, email, số điện thoại hoặc mã khách hàng"
                prefix={<SearchOutlined />}
                style={{ width: 400 }}
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
              <Button
                icon={<FilterOutlined />}
                style={{ borderColor: "#d9d9d9" }}
              >
                Bộ lọc
              </Button>
            </div>
            
            {selectedRowKeys.length > 0 && (
              <Button 
                danger 
                icon={<DeleteOutlined />}
                onClick={handleBulkDelete}
              >
                Xóa {selectedRowKeys.length} khách hàng
              </Button>
            )}
          </div>
        </div>

        <div>
          <Table
            columns={columns}
            dataSource={currentPageData}
            pagination={false}
            size="middle"
            onChange={handleTableChange}
            rowSelection={rowSelection}
            style={{ marginBottom: "16px" }}
            loading={loading}
            rowKey="id"
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 0",
            }}
          >            <div style={{ color: "#8c8c8c", fontSize: "14px" }}>
              {totalElements > 0
                ? `${startItem}-${endItem} trong tổng số ${totalElements}`
                : "0 trong tổng số 0"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                Hiển thị:
              </span>
              <Select
                value={pageSize}
                onChange={handlePageSizeChange}
                style={{ width: 70 }}
                size="small"
              >
                <Option value={5}>5</Option>
                <Option value={10}>10</Option>
                <Option value={20}>20</Option>
              </Select>
              <Button
                type="text"
                disabled={currentPage === 0}
                onClick={goToPreviousPage}
                style={{ padding: "4px 8px" }}
              >
                ‹
              </Button>
              <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                Trang {currentPage + 1} / {totalPages || 1}
              </span>
              <Button
                type="text"
                disabled={currentPage === totalPages - 1 || totalPages === 0}
                onClick={goToNextPage}
                style={{ padding: "4px 8px" }}
              >
                ›
              </Button>
            </div>
          </div>

          <div style={{ paddingTop: "16px", borderTop: "1px solid #f0f0f0" }}>
            <Checkbox>Hiển thị thu gọn</Checkbox>
          </div>
        </div>

        {selectedRowKeys.length > 0 && (
          <div
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              backgroundColor: "#1890ff",
              color: "white",
              padding: "12px 20px",
              borderRadius: "6px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              fontWeight: "500",
            }}
          >
            Đã chọn: {selectedRowKeys.length} khách hàng
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      <Modal
        title="Chi tiết khách hàng"
        open={customerDetailModal}
        onCancel={() => {
          setCustomerDetailModal(false);
          setSelectedCustomer(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setCustomerDetailModal(false);
            setSelectedCustomer(null);
          }}>
            Đóng
          </Button>,
          <Button key="edit" type="primary" onClick={() => {
            if (selectedCustomer) {
              handleEditCustomer(selectedCustomer);
              setCustomerDetailModal(false);
              setSelectedCustomer(null);
            }
          }} disabled={detailLoading}>
            Chỉnh sửa
          </Button>,
        ]}
        width={700}
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div>Đang tải chi tiết khách hàng...</div>
          </div>
        ) : selectedCustomer && (
          <div style={{ padding: "16px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>              <Avatar
                size={60}
                style={{
                  backgroundColor: selectedCustomer.gender === "male" ? "#1890ff" : selectedCustomer.gender === "female" ? "#ff69b4" : "#8c8c8c",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "24px"
                }}
              >
                {selectedCustomer.fullName.split(" ").pop()?.charAt(0)}
              </Avatar>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px" }}>{selectedCustomer.fullName}</h3>
                <p style={{ margin: "4px 0", color: "#8c8c8c" }}>
                  {selectedCustomer.customerCode} • {getAge(selectedCustomer.dateOfBirth)} tuổi
                </p>
                <Space>
                  <Tag color={selectedCustomer.isActive ? "green" : "red"}>
                    {selectedCustomer.isActive ? "Hoạt động" : "Tạm khóa"}
                  </Tag>
                  <Tag color={selectedCustomer.gender === "male" ? "blue" : selectedCustomer.gender === "female" ? "pink" : "default"}>
                    {selectedCustomer.gender === "male" ? "Nam" : selectedCustomer.gender === "female" ? "Nữ" : "Chưa cập nhật"}
                  </Tag>
                </Space>
              </div>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              <div>
                <h4 style={{ marginBottom: "16px", color: "#262626" }}>Thông tin liên hệ</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <PhoneOutlined style={{ color: "#52c41a" }} />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <MailOutlined style={{ color: "#1890ff" }} />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div style={{ marginTop: "8px" }}>
                    <strong>Địa chỉ:</strong>
                    <div style={{ marginTop: "4px", color: "#595959" }}>{selectedCustomer.address}</div>
                  </div>
                </div>
              </div>
              <div>                <h4 style={{ marginBottom: "16px", color: "#262626" }}>Thông tin cá nhân</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div><strong>Ngày sinh:</strong> {formatDate(selectedCustomer.dateOfBirth)}</div>
                  <div><strong>Tài khoản:</strong> {selectedCustomer.hasAccount ? "Có tài khoản" : "Khách vãng lai"}</div>
                  <div><strong>Điểm tích lũy:</strong> 
                    <span style={{ 
                      color: selectedCustomer.loyaltyPoints > 1500 ? "#52c41a" : selectedCustomer.loyaltyPoints > 1000 ? "#fa8c16" : "#8c8c8c",
                      fontWeight: "600",
                      marginLeft: "8px"
                    }}>
                      {selectedCustomer.loyaltyPoints.toLocaleString()} điểm
                    </span>
                  </div>
                  <div><strong>Ngày tạo:</strong> {formatDate(selectedCustomer.createdAt)}</div>
                  <div><strong>Cập nhật:</strong> {formatDate(selectedCustomer.updatedAt)}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 style={{ marginBottom: "16px", color: "#262626" }}>Thống kê hoạt động</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", textAlign: "center" }}>
                <div style={{ padding: "16px", backgroundColor: "#f0f9ff", borderRadius: "8px" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1890ff" }}>
                    {selectedCustomer.pets?.length || 0}
                  </div>
                  <div style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "4px" }}>Thú cưng</div>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#f6ffed", borderRadius: "8px" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#52c41a" }}>
                    {selectedCustomer.recentOrders?.length || 0}
                  </div>
                  <div style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "4px" }}>Đơn hàng gần đây</div>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#fff7e6", borderRadius: "8px" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fa8c16" }}>
                    {selectedCustomer.recentServiceOrders?.length || 0}
                  </div>
                  <div style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "4px" }}>Dịch vụ gần đây</div>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#f9f0ff", borderRadius: "8px" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#722ed1" }}>
                    {selectedCustomer.loyaltyHistory?.length || 0}
                  </div>
                  <div style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "4px" }}>Lịch sử tích điểm</div>
                </div>
              </div>
            </div>

            {/* Show arrays data if available */}
            {(selectedCustomer.pets?.length > 0 || selectedCustomer.recentOrders?.length > 0 || 
              selectedCustomer.recentServiceOrders?.length > 0 || selectedCustomer.loyaltyHistory?.length > 0) && (
              <div style={{ marginTop: "24px", borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}>
                <p style={{ color: "#8c8c8c", fontSize: "13px" }}>
                  💡 Dữ liệu chi tiết về thú cưng, đơn hàng, dịch vụ và lịch sử tích điểm có thể được xem trong các tab riêng biệt.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      
      {/* Order History Modal */}
<Modal
  title={
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <ShoppingOutlined style={{ color: "#1890ff" }} />
      <span>Lịch sử mua hàng</span>
      {selectedCustomerOrders && (
        <span style={{ fontWeight: "normal", color: "#8c8c8c" }}>
          - {selectedCustomerOrders.customer.fullName}
        </span>
      )}
    </div>
  }
  open={orderHistoryModal}
  onCancel={() => {
    setOrderHistoryModal(false);
    setSelectedCustomerOrders(null);
  }}
  footer={[
    <Button key="close" onClick={() => {
      setOrderHistoryModal(false);
      setSelectedCustomerOrders(null);
    }}>
      Đóng
    </Button>,
  ]}
  width={900}
  style={{ top: 20 }}
>
  {orderHistoryLoading ? (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <div>Đang tải lịch sử mua hàng...</div>
    </div>
  ) : selectedCustomerOrders && (
    <div style={{ padding: "16px 0" }}>
      {/* Customer Summary */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "16px", 
        marginBottom: "24px",
        padding: "16px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px"
      }}>        <Avatar
          size={50}
          style={{
            backgroundColor: selectedCustomerOrders.customer.gender === "male" ? "#1890ff" : 
                           selectedCustomerOrders.customer.gender === "female" ? "#ff69b4" : "#8c8c8c",
            color: "white",
            fontWeight: "bold"
          }}
        >
          {selectedCustomerOrders.customer.fullName.split(" ").pop()?.charAt(0)}
        </Avatar>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0 }}>{selectedCustomerOrders.customer.fullName}</h4>
          <p style={{ margin: "4px 0", color: "#8c8c8c" }}>
            {selectedCustomerOrders.customer.customerCode} • 
            {selectedCustomerOrders.customer.phone} • 
            {selectedCustomerOrders.customer.email}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "16px", fontWeight: "bold", color: "#52c41a" }}>
            {selectedCustomerOrders.customer.loyaltyPoints.toLocaleString()} điểm
          </div>
          <div style={{ fontSize: "12px", color: "#8c8c8c" }}>Điểm tích lũy</div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col span={8}>
          <Card size="small" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1890ff" }}>
              {selectedCustomerOrders.orders.length}
            </div>
            <div style={{ color: "#8c8c8c" }}>Tổng đơn hàng</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fa8c16" }}>
              {selectedCustomerOrders.serviceOrders.length}
            </div>
            <div style={{ color: "#8c8c8c" }}>Tổng dịch vụ</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#52c41a" }}>
              {formatCurrency(
                selectedCustomerOrders.orders.reduce((sum, order) => sum + order.totalAmount, 0) +
                selectedCustomerOrders.serviceOrders.reduce((sum, service) => sum + service.totalAmount, 0)
              )}
            </div>
            <div style={{ color: "#8c8c8c" }}>Tổng chi tiêu</div>
          </Card>
        </Col>
      </Row>

      {/* Tabs for Orders and Services */}
      <Tabs defaultActiveKey="orders" style={{ marginTop: "16px" }}>
        <TabPane 
          tab={
            <span>
              <ShoppingOutlined />
              Đơn hàng ({selectedCustomerOrders.orders.length})
            </span>
          } 
          key="orders"
        >
          {selectedCustomerOrders.orders.length > 0 ? (
            <Table
              columns={orderColumns}
              dataSource={selectedCustomerOrders.orders}
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                showTotal: (total) => `Tổng ${total} đơn hàng`
              }}
              size="small"
              rowKey="id"
              scroll={{ y: 300 }}
            />
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 0', 
              color: '#8c8c8c' 
            }}>
              <ShoppingOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <div>Chưa có đơn hàng nào</div>
            </div>
          )}
        </TabPane>
        <TabPane 
          tab={
            <span>
              <CalendarOutlined />
              Dịch vụ ({selectedCustomerOrders.serviceOrders.length})
            </span>
          } 
          key="services"
        >
          {selectedCustomerOrders.serviceOrders.length > 0 ? (
            <Table
              columns={serviceOrderColumns}
              dataSource={selectedCustomerOrders.serviceOrders}
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                showTotal: (total) => `Tổng ${total} dịch vụ`
              }}
              size="small"
              rowKey="id"
              scroll={{ y: 300 }}
            />
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 0', 
              color: '#8c8c8c' 
            }}>
              <CalendarOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <div>Chưa có dịch vụ nào</div>
            </div>
          )}
        </TabPane>
      </Tabs>
    </div>
  )}
</Modal>
    </div>
  );
};

export default CustomerPage;