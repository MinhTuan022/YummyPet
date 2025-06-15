import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Tag, 
  Space,
  Tooltip,
  Checkbox,
  Select,
  DatePicker,
  Modal,
  Form,
  InputNumber,
  message,
  Descriptions,
  Divider,
  Dropdown
} from 'antd';
import { 
  SearchOutlined, 
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
  SwapOutlined
} from '@ant-design/icons';
import { _request } from '../../../network/Api';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

interface Order {
  id: number;
  createdAt: string;
  updatedAt: string;
  discountAmount: number;
  finalAmount: number;
  notes: string;
  orderCode: string;
  orderType: 'ONLINE' | 'OFFLINE';
  paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'E_WALLET';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  shippingAddress: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  customer: {
    id: number;
    fullName: string;
    phone: string;
    email: string;
  };
  employee: any;
  orderItems: Array<{
    id: number;
    quantity: number;
    totalPrice: number;
    unitPrice: number;
    product: {
      name: string;
      breed: string;
      category: {
        name: string;
      };
    };
  }>;
}

const OrderPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [form] = Form.useForm();
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    _request({
      path: "/orders",
      method: "GET",
      onSuccess(data) {
        setOrderData(data.data.content || data.data || []);
        setLoading(false);
      },
      onError(error) {
        message.error('Không thể tải danh sách đơn hàng');
        setLoading(false);
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'orange';
      case 'PROCESSING': return 'blue';
      case 'SHIPPED': return 'cyan';
      case 'DELIVERED': return 'green';
      case 'CANCELLED': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <ClockCircleOutlined />;
      case 'PROCESSING': return <ExclamationCircleOutlined />;
      case 'SHIPPED': return <TruckOutlined />;
      case 'DELIVERED': return <CheckCircleOutlined />;
      case 'CANCELLED': return <DeleteOutlined />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'PROCESSING': return 'Đang xử lý';
      case 'SHIPPED': return 'Đã giao';
      case 'DELIVERED': return 'Đã giao';
      case 'COMPLETED': return 'Hoàn thành';

      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const getOrderTypeText = (type: string) => {
    switch (type) {
      case 'ONLINE': return 'Đặt hàng online';
      case 'IN_STORE': return 'Mua tại cửa hàng';
      default: return type;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'CASH': return 'Tiền mặt';
      case 'CARD': return 'Thẻ tín dụng';
      case 'BANK_TRANSFER': return 'Chuyển khoản ngân hàng';
      case 'E_WALLET': return 'Ví điện tử';
      default: return method;
    }
  };

  const totalOrders = orderData.length;
  const pendingOrders = orderData.filter(order => order.status === 'PENDING').length;
  const processingOrders = orderData.filter(order => order.status === 'PROCESSING').length;
  const shippedOrders = orderData.filter(order => order.status === 'DELIVERED').length;
  const deliveredOrders = orderData.filter(order => order.status === 'COMPLETED').length;

  const handleEdit = (record: Order) => {
    setEditingOrder(record);
    form.setFieldsValue({
      ...record,
      customerName: record.customer.fullName,
      customerPhone: record.customer.phone,
      customerEmail: record.customer.email
    });
    setIsModalVisible(true);
  };

  const handleViewDetail = (record: Order) => {
    setViewingOrder(record);
    setIsDetailModalVisible(true);
  };

  const handleDelete = (record: Order) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa đơn hàng này?',
      content: `Mã đơn hàng: ${record.orderCode}`,
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      onOk() {
        _request({
          path: `/orders/${record.id}`,
          method: "DELETE",
          onSuccess() {
            message.success('Đã xóa đơn hàng thành công');
            fetchOrders(); // Refresh data
          },
          onError(error) {
            message.error('Không thể xóa đơn hàng');
          },
        });
      },
    });
  };

  const handleStatusChange = (record: Order, newStatus: string) => {
    confirm({
      title: 'Xác nhận thay đổi trạng thái',
      content: `Bạn có muốn chuyển đơn hàng ${record.orderCode} sang trạng thái "${getStatusText(newStatus)}"?`,
      okText: 'Có',
      cancelText: 'Không',
      onOk() {
        _request({
          path: `/orders/${record.id}/status`,
          method: "PUT",
          body: { newStatus: newStatus, notes: "" },
          onSuccess() {
            message.success('Đã cập nhật trạng thái đơn hàng thành công');
            fetchOrders(); // Refresh data
          },
          onError(error) {
            message.error('Không thể cập nhật trạng thái đơn hàng');
          },
        });
      },
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const orderData = {
        ...values,
        orderType: values.orderType || 'ONLINE',
        paymentMethod: values.paymentMethod || 'CASH',
        customer: {
          fullName: values.customerName,
          phone: values.customerPhone,
          email: values.customerEmail
        }
      };

      const apiCall = editingOrder 
        ? _request({
            path: `/orders/${editingOrder.id}`,
            method: "PUT",
            body: orderData,
            onSuccess() {
              message.success('Đã cập nhật đơn hàng thành công');
              fetchOrders();
            },
            onError(error) {
              message.error('Không thể cập nhật đơn hàng');
            },
          })
        : _request({
            path: "/orders",
            method: "POST",
            body: orderData,
            onSuccess() {
              message.success('Đã tạo đơn hàng thành công');
              fetchOrders();
            },
            onError(error) {
              message.error('Không thể tạo đơn hàng');
            },
          });

      setIsModalVisible(false);
      setEditingOrder(null);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleNewOrder = () => {
    setEditingOrder(null);
    form.resetFields();
    form.setFieldsValue({
      orderCode: `DH${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(orderData.length + 1).padStart(3, '0')}`,
      status: 'PENDING',
      orderType: 'ONLINE',
      paymentMethod: 'CASH',
      paymentStatus: 'PENDING',
      discountAmount: 0
    });
    setIsModalVisible(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusActions = (record: Order) => {
    if (record.status !== 'PENDING') return [];

    const actions = [
      {
        key: 'processing',
        label: 'Chuyển sang xử lý',
        onClick: () => handleStatusChange(record, 'PROCESSING')
      },
      {
        key: 'cancelled',
        label: 'Hủy đơn hàng',
        onClick: () => handleStatusChange(record, 'CANCELLED')
      }
    ];

    return actions;
  };

  const columns = [
    // {
    //   title: '',
    //   dataIndex: 'checkbox',
    //   width: 50,
    //   render: (_: any, record: Order) => (
    //     <Checkbox 
    //       checked={selectedRowKeys.includes(record.id)}
    //       onChange={(e) => {
    //         if (e.target.checked) {
    //           setSelectedRowKeys([...selectedRowKeys, record.id]);
    //         } else {
    //           setSelectedRowKeys(selectedRowKeys.filter(key => key !== record.id));
    //         }
    //       }}
    //     />
    //   ),
    // },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      key: 'orderCode',
      width: 140,
      render: (text: string) => <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</span>
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 180,
      render: (record: Order) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.customer.fullName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.customer.phone}</div>
        </div>
      )
    },
    {
      title: 'Loại đơn hàng',
      dataIndex: 'orderType',
      key: 'orderType',
      width: 120,
      render: (text: string) => (
        <Tag color={text === 'OFFLINE' ? 'orange' : 'blue'}>
          {getOrderTypeText(text)}
        </Tag>
      )
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 150,
      render: (text: string) => getPaymentMethodText(text)
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => (
        <span style={{ fontWeight: 'bold' }}>{formatCurrency(amount)}</span>
      )
    },
    {
      title: 'Thành tiền',
      dataIndex: 'finalAmount',
      key: 'finalAmount',
      width: 120,
      render: (amount: number) => (
        <span style={{ fontWeight: 'bold', color: '#52c41a' }}>{formatCurrency(amount)}</span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag 
          color={getStatusColor(status)}
          icon={getStatusIcon(status)}
        >
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (date: string) => formatDate(date)
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: Order) => {
        const statusActions = getStatusActions(record);
        
        return (
          <Space size="small">
            <Tooltip title="Xem chi tiết">
              <Button 
                type="text" 
                icon={<EyeOutlined />} 
                size="small"
                onClick={() => handleViewDetail(record)}
              />
            </Tooltip>
            {/* <Tooltip title="Chỉnh sửa">
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                size="small"
                onClick={() => handleEdit(record)}
              />
            </Tooltip> */}
            {/* <Tooltip title="Xóa">
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                size="small"
                danger
                onClick={() => handleDelete(record)}
              />
            </Tooltip> */}
            {statusActions.length > 0 && (
              <Dropdown
                menu={{
                  items: statusActions.map(action => ({
                    key: action.key,
                    label: action.label,
                    onClick: action.onClick,
                    icon: <SwapOutlined />
                  }))
                }}
                trigger={['click']}
              >
                <Button 
                  type="text" 
                  icon={<MoreOutlined />} 
                  size="small"
                />
              </Dropdown>
            )}
          </Space>
        );
      },
    },
  ];

  const filteredData = orderData.filter(order => {
    const matchesSearch = 
      order.orderCode.toLowerCase().includes(searchText.toLowerCase()) ||
      order.customer.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      order.customer.phone.includes(searchText) ||
      order.shippingAddress.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Tổng đơn hàng</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>{totalOrders}</div>
            </div>
            <ShoppingCartOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
          </div>
        </Card>

        <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Chờ xử lý</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>{pendingOrders}</div>
            </div>
            <ClockCircleOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />
          </div>
        </Card>

        <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Đang xử lý</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>{processingOrders}</div>
            </div>
            <ExclamationCircleOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
          </div>
        </Card>

        <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Đã giao</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#13c2c2' }}>{shippedOrders}</div>
            </div>
            <TruckOutlined style={{ fontSize: '32px', color: '#13c2c2' }} />
          </div>
        </Card>

        <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Hoàn thành</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>{deliveredOrders}</div>
            </div>
            <CheckCircleOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
          </div>
        </Card>
      </div>

      <Card style={{ borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Search
              placeholder="Tìm kiếm đơn hàng..."
              allowClear
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="PENDING">Chờ xử lý</Option>
              <Option value="PROCESSING">Đang xử lý</Option>
              <Option value="SHIPPED">Đã giao</Option>
              <Option value="DELIVERED">Hoàn thành</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </div>
          {/* <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleNewOrder}
          >
            Tạo đơn hàng mới
          </Button> */}
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} trong ${total} đơn hàng`,
          }}
          style={{ marginTop: '16px' }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={`Chi tiết đơn hàng - ${viewingOrder?.orderCode}`}
        open={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setViewingOrder(null);
        }}
        width={800}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {viewingOrder && (
          <div>
            <Descriptions title="Thông tin đơn hàng" bordered column={2}>
              <Descriptions.Item label="Mã đơn hàng" span={1}>
                <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                  {viewingOrder.orderCode}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={1}>
                <Tag 
                  color={getStatusColor(viewingOrder.status)}
                  icon={getStatusIcon(viewingOrder.status)}
                >
                  {getStatusText(viewingOrder.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Loại đơn hàng" span={1}>
                <Tag color={viewingOrder.orderType === 'OFFLINE' ? 'orange' : 'blue'}>
                  {getOrderTypeText(viewingOrder.orderType)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán" span={1}>
                {getPaymentMethodText(viewingOrder.paymentMethod)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo" span={1}>
                {formatDate(viewingOrder.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày cập nhật" span={1}>
                {formatDate(viewingOrder.updatedAt)}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="Thông tin khách hàng" bordered column={2}>
              <Descriptions.Item label="Họ tên" span={1}>
                <span style={{ fontWeight: 'bold' }}>
                  {viewingOrder.customer.fullName}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại" span={1}>
                {viewingOrder.customer.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>
                {viewingOrder.customer.email || 'Chưa có'}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
                {viewingOrder.shippingAddress}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="Thông tin thanh toán" bordered column={2}>
              <Descriptions.Item label="Tổng tiền" span={1}>
                <span style={{ fontWeight: 'bold' }}>
                  {formatCurrency(viewingOrder.totalAmount)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Giảm giá" span={1}>
                <span style={{ color: '#f5222d' }}>
                  -{formatCurrency(viewingOrder.discountAmount)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Thành tiền" span={2}>
                <span style={{ fontWeight: 'bold', color: '#52c41a', fontSize: '16px' }}>
                  {formatCurrency(viewingOrder.finalAmount)}
                </span>
              </Descriptions.Item>
            </Descriptions>

            {viewingOrder.notes && (
              <>
                <Divider />
                <Descriptions title="Ghi chú" bordered>
                  <Descriptions.Item label="Ghi chú" span={3}>
                    {viewingOrder.notes}
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}

            {viewingOrder.orderItems && viewingOrder.orderItems.length > 0 && (
              <>
                <Divider />
                <h4>Sản phẩm trong đơn hàng</h4>
                <Table
                  dataSource={viewingOrder.orderItems}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: 'Sản phẩm',
                      key: 'product',
                      render: (item: any) => (
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{item.product.name}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {item.product.category.name} - {item.product.breed}
                          </div>
                        </div>
                      )
                    },
                    {
                      title: 'Đơn giá',
                      dataIndex: 'unitPrice',
                      render: (price: number) => formatCurrency(price)
                    },
                    {
                      title: 'Số lượng',
                      dataIndex: 'quantity',
                    },
                    {
                      title: 'Thành tiền',
                      dataIndex: 'totalPrice',
                      render: (price: number) => (
                        <span style={{ fontWeight: 'bold' }}>
                          {formatCurrency(price)}
                        </span>
                      )
                    }
                  ]}
                />
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Edit/Create Modal */}
      <Modal
        title={editingOrder ? 'Chỉnh sửa đơn hàng' : 'Tạo đơn hàng mới'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingOrder(null);
          form.resetFields();
        }}
        width={800}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="orderCode"
              label="Mã đơn hàng"
              rules={[{ required: true, message: 'Vui lòng nhập mã đơn hàng!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select>
                <Option value="PENDING">Chờ xử lý</Option>
                <Option value="PROCESSING">Đang xử lý</Option>
                <Option value="SHIPPED">Đã giao</Option>
                <Option value="DELIVERED">Hoàn thành</Option>
                <Option value="CANCELLED">Đã hủy</Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="customerName"
              label="Tên khách hàng"
              rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="customerPhone"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            name="customerEmail"
            label="Email khách hàng"
          >
            <Input />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="orderType"
              label="Loại đơn hàng"
              rules={[{ required: true, message: 'Vui lòng chọn loại đơn hàng!' }]}
            >
              <Select>
                <Option value="Đặt hàng online">Đặt hàng online</Option>
                <Option value="Mua tại cửa hàng">Mua tại cửa hàng</Option>
                <Option value="Đặt hàng qua điện thoại">Đặt hàng qua điện thoại</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="paymentMethod"
              label="Phương thức thanh toán"
              rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
            >
              <Select>
                <Option value="Tiền mặt">Tiền mặt</Option>
                <Option value="Thẻ tín dụng">Thẻ tín dụng</Option>
                <Option value="Thẻ ATM">Thẻ ATM</Option>
                <Option value="Chuyển khoản ngân hàng">Chuyển khoản ngân hàng</Option>
                <Option value="Ví điện tử">Ví điện tử</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="deliveryMethod"
            label="Phương thức giao hàng"
            rules={[{ required: true, message: 'Vui lòng chọn phương thức giao hàng!' }]}
          >
            <Select>
              <Option value="Giao hàng tiêu chuẩn">Giao hàng tiêu chuẩn</Option>
              <Option value="Giao hàng hỏa tốc">Giao hàng hỏa tốc</Option>
              <Option value="Giao trong ngày">Giao trong ngày</Option>
              <Option value="Nhận tại cửa hàng">Nhận tại cửa hàng</Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="totalAmount"
              label="Tổng tiền (VNĐ)"
              rules={[{ required: true, message: 'Vui lòng nhập tổng tiền!' }]}
            >
              <InputNumber
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                // parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>
            <Form.Item
              name="discountAmount"
              label="Số tiền giảm giá (VNĐ)"
            >
              <InputNumber
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                // parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>
            <Form.Item
              name="finalAmount"
              label="Thành tiền (VNĐ)"
              rules={[{ required: true, message: 'Vui lòng nhập thành tiền!' }]}
            >
              <InputNumber
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                // parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="shippingAddress"
            label="Địa chỉ giao hàng"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng!' }]}
          >
            <Input.TextArea rows={2} placeholder="Nhập địa chỉ đầy đủ..." />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <Input.TextArea rows={3} placeholder="Ghi chú thêm về đơn hàng..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderPage;