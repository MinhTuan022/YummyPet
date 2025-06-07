import React, { useState } from 'react';
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
  message
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
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

interface Order {
  id: number;
  createdAt: string;
  deliveryMethod: string;
  discountAmount: number;
  finalAmount: number;
  notes: string;
  orderCode: string;
  orderType: string;
  paymentMethod: string;
  shippingAddress: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  updatedAt: string;
  customer: {
    id: number;
    fullName: string;
    phone: string;
    email: string;
  };
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
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [form] = Form.useForm();

  const [orderData, setOrderData] = useState<Order[]>([
    {
      id: 1,
      createdAt: '2024-12-15T10:30:00Z',
      deliveryMethod: 'Giao hàng tiêu chuẩn',
      discountAmount: 50000,
      finalAmount: 950000,
      notes: 'Khách yêu cầu giao trong giờ hành chính',
      orderCode: 'DH-2024-001',
      orderType: 'Đặt hàng online',
      paymentMethod: 'Chuyển khoản ngân hàng',
      shippingAddress: '123 Đường Nguyễn Trãi, Quận 1, TP.HCM',
      status: 'shipped',
      totalAmount: 1000000,
      updatedAt: '2024-12-15T14:20:00Z',
      customer: {
        id: 1,
        fullName: 'Nguyễn Văn An',
        phone: '0901234567',
        email: 'nguyenvanan@email.com'
      },
      orderItems: [
        {
          id: 1,
          quantity: 2,
          totalPrice: 600000,
          unitPrice: 300000,
          product: {
            name: 'Thức ăn cho chó Golden Retriever',
            breed: 'Golden Retriever',
            category: { name: 'Thức ăn' }
          }
        },
        {
          id: 2,
          quantity: 1,
          totalPrice: 400000,
          unitPrice: 400000,
          product: {
            name: 'Vitamin tổng hợp cho thú cưng',
            breed: 'Tất cả giống',
            category: { name: 'Thuốc & Vitamin' }
          }
        }
      ]
    },
    {
      id: 2,
      createdAt: '2024-12-14T09:15:00Z',
      deliveryMethod: 'Giao hàng hỏa tốc',
      discountAmount: 0,
      finalAmount: 750000,
      notes: 'Thuốc khẩn cấp cho thú cưng bị bệnh',
      orderCode: 'DH-2024-002',
      orderType: 'Mua tại cửa hàng',
      paymentMethod: 'Tiền mặt',
      shippingAddress: '456 Đường Lê Văn Sỹ, Quận 3, TP.HCM',
      status: 'delivered',
      totalAmount: 750000,
      updatedAt: '2024-12-16T11:45:00Z',
      customer: {
        id: 2,
        fullName: 'Trần Thị Bình',
        phone: '0912345678',
        email: 'tranthibinh@email.com'
      },
      orderItems: [
        {
          id: 3,
          quantity: 1,
          totalPrice: 350000,
          unitPrice: 350000,
          product: {
            name: 'Thuốc trị giun sán cho mèo',
            breed: 'Mèo Ba Tư',
            category: { name: 'Thuốc & Vitamin' }
          }
        },
        {
          id: 4,
          quantity: 1,
          totalPrice: 400000,
          unitPrice: 400000,
          product: {
            name: 'Sữa tắm chuyên dụng cho mèo',
            breed: 'Mèo Ba Tư',
            category: { name: 'Vệ sinh' }
          }
        }
      ]
    },
    {
      id: 3,
      createdAt: '2024-12-16T16:22:00Z',
      deliveryMethod: 'Giao trong ngày',
      discountAmount: 100000,
      finalAmount: 1400000,
      notes: 'Đơn hàng khẩn cấp cho ca phẫu thuật thú cưng',
      orderCode: 'DH-2024-003',
      orderType: 'Đặt hàng online',
      paymentMethod: 'Thẻ tín dụng',
      shippingAddress: '789 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM',
      status: 'processing',
      totalAmount: 1500000,
      updatedAt: '2024-12-16T16:22:00Z',
      customer: {
        id: 3,
        fullName: 'Lê Minh Cường',
        phone: '0923456789',
        email: 'leminhcuong@email.com'
      },
      orderItems: [
        {
          id: 5,
          quantity: 1,
          totalPrice: 800000,
          unitPrice: 800000,
          product: {
            name: 'Thuốc mê cho phẫu thuật thú cưng',
            breed: 'Chó Husky',
            category: { name: 'Thuốc & Vitamin' }
          }
        },
        {
          id: 6,
          quantity: 1,
          totalPrice: 700000,
          unitPrice: 700000,
          product: {
            name: 'Dụng cụ phẫu thuật thú y',
            breed: 'Tất cả giống',
            category: { name: 'Dụng cụ y tế' }
          }
        }
      ]
    },
    {
      id: 4,
      createdAt: '2024-12-17T08:45:00Z',
      deliveryMethod: 'Giao hàng tiêu chuẩn',
      discountAmount: 25000,
      finalAmount: 475000,
      notes: 'Đơn hàng định kỳ hàng tháng',
      orderCode: 'DH-2024-004',
      orderType: 'Mua tại cửa hàng',
      paymentMethod: 'Thẻ ATM',
      shippingAddress: '321 Đường Võ Văn Tần, Quận 3, TP.HCM',
      status: 'pending',
      totalAmount: 500000,
      updatedAt: '2024-12-17T08:45:00Z',
      customer: {
        id: 4,
        fullName: 'Phạm Thị Dung',
        phone: '0934567890',
        email: 'phamthidung@email.com'
      },
      orderItems: [
        {
          id: 7,
          quantity: 3,
          totalPrice: 450000,
          unitPrice: 150000,
          product: {
            name: 'Thức ăn hạt cho chó Poodle',
            breed: 'Poodle',
            category: { name: 'Thức ăn' }
          }
        },
        {
          id: 8,
          quantity: 1,
          totalPrice: 50000,
          unitPrice: 50000,
          product: {
            name: 'Xương gặm sạch răng',
            breed: 'Tất cả giống',
            category: { name: 'Đồ chơi' }
          }
        }
      ]
    },
    {
      id: 5,
      createdAt: '2024-12-18T13:30:00Z',
      deliveryMethod: 'Giao hàng hỏa tốc',
      discountAmount: 200000,
      finalAmount: 1800000,
      notes: 'Đơn hàng số lượng lớn được giảm giá đặc biệt',
      orderCode: 'DH-2024-005',
      orderType: 'Đặt hàng online',
      paymentMethod: 'Chuyển khoản ngân hàng',
      shippingAddress: '654 Đường Pasteur, Quận 1, TP.HCM',
      status: 'cancelled',
      totalAmount: 2000000,
      updatedAt: '2024-12-18T15:10:00Z',
      customer: {
        id: 5,
        fullName: 'Võ Hoàng Ế',
        phone: '0945678901',
        email: 'vohoange@email.com'
      },
      orderItems: [
        {
          id: 9,
          quantity: 5,
          totalPrice: 1500000,
          unitPrice: 300000,
          product: {
            name: 'Thức ăn cao cấp cho mèo Anh lông ngắn',
            breed: 'Mèo Anh lông ngắn',
            category: { name: 'Thức ăn' }
          }
        },
        {
          id: 10,
          quantity: 2,
          totalPrice: 500000,
          unitPrice: 250000,
          product: {
            name: 'Cát vệ sinh cao cấp',
            breed: 'Tất cả giống',
            category: { name: 'Vệ sinh' }
          }
        }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'processing': return 'blue';
      case 'shipped': return 'cyan';
      case 'delivered': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ClockCircleOutlined />;
      case 'processing': return <ExclamationCircleOutlined />;
      case 'shipped': return <TruckOutlined />;
      case 'delivered': return <CheckCircleOutlined />;
      case 'cancelled': return <DeleteOutlined />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đã giao';
      case 'delivered': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const totalOrders = orderData.length;
  const pendingOrders = orderData.filter(order => order.status === 'pending').length;
  const processingOrders = orderData.filter(order => order.status === 'processing').length;
  const shippedOrders = orderData.filter(order => order.status === 'shipped').length;
  const deliveredOrders = orderData.filter(order => order.status === 'delivered').length;

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

  const handleDelete = (record: Order) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa đơn hàng này?',
      content: `Mã đơn hàng: ${record.orderCode}`,
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      onOk() {
        setOrderData(orderData.filter(order => order.id !== record.id));
        message.success('Đã xóa đơn hàng thành công');
      },
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updatedOrder = {
        ...values,
        id: editingOrder?.id || Date.now(),
        createdAt: editingOrder?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        customer: {
          id: editingOrder?.customer.id || Date.now(),
          fullName: values.customerName,
          phone: values.customerPhone,
          email: values.customerEmail
        },
        orderItems: editingOrder?.orderItems || []
      };

      if (editingOrder) {
        setOrderData(orderData.map(order => 
          order.id === editingOrder.id ? updatedOrder : order
        ));
        message.success('Đã cập nhật đơn hàng thành công');
      } else {
        setOrderData([...orderData, updatedOrder]);
        message.success('Đã tạo đơn hàng thành công');
      }

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
      orderCode: `DH-${new Date().getFullYear()}-${String(orderData.length + 1).padStart(3, '0')}`,
      status: 'pending',
      orderType: 'Đặt hàng online',
      paymentMethod: 'Chuyển khoản ngân hàng',
      deliveryMethod: 'Giao hàng tiêu chuẩn',
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
      year: 'numeric'
    });
  };

  const columns = [
    {
      title: '',
      dataIndex: 'checkbox',
      width: 50,
      render: (_: any, record: Order) => (
        <Checkbox 
          checked={selectedRowKeys.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record.id]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter(key => key !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      key: 'orderCode',
      width: 120,
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
        <Tag color={text === 'Mua tại cửa hàng' ? 'orange' : 'blue'}>
          {text}
        </Tag>
      )
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 150,
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
      width: 120,
      render: (date: string) => formatDate(date)
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: Order) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              size="small"
              danger
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
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
              <Option value="pending">Chờ xử lý</Option>
              <Option value="processing">Đang xử lý</Option>
              <Option value="shipped">Đã giao</Option>
              <Option value="delivered">Hoàn thành</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleNewOrder}
          >
            Tạo đơn hàng mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
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
                <Option value="pending">Chờ xử lý</Option>
                <Option value="processing">Đang xử lý</Option>
                <Option value="shipped">Đã giao</Option>
                <Option value="delivered">Hoàn thành</Option>
                <Option value="cancelled">Đã hủy</Option>
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