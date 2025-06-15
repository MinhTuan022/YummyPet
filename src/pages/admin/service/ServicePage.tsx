import React, { useState, useMemo, useEffect } from 'react';
import { 
  Table, 
  Input, 
  Button, 
  Tag, 
  Dropdown, 
  Avatar, 
  Checkbox,
  Space,
  Modal,
  Form,
  InputNumber,
  Switch,
  message,
  Popconfirm
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  MoreOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PoweroffOutlined
} from '@ant-design/icons';
import type { ColumnsType, MenuProps } from 'antd/es/table';
import { _request } from '../../../network/Api';

const { Search, TextArea } = Input;

interface Service {
  key: string;
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
}

const ServicePage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend');
  const [allServicesData, setAllServicesData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form] = Form.useForm();
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showCompact, setShowCompact] = useState(false);

  // Load services from API
  const loadServices = async () => {
    setLoading(true);
    try {
      await _request({
        path: "/services",
        method: "GET",
        onSuccess(data) {
          const servicesWithKeys = data.data.content.map((service: any) => ({
            ...service,
            key: service.id.toString()
          }));
          setAllServicesData(servicesWithKeys);
        },
        onError(error) {
          message.error('Không thể tải danh sách dịch vụ');
          console.error(error);
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = allServicesData;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchText.toLowerCase()) ||
        service.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus) {
      const isActive = filterStatus === 'active';
      filtered = filtered.filter(service => service.isActive === isActive);
    }

    // Sort
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;
        
        if (sortField === 'createdAt' || sortField === 'updatedAt') {
          aValue = new Date(a[sortField as keyof Service] as string).getTime();
          bValue = new Date(b[sortField as keyof Service] as string).getTime();
        } else if (sortField === 'price' || sortField === 'durationMinutes') {
          aValue = a[sortField as keyof Service] as number;
          bValue = b[sortField as keyof Service] as number;
        } else {
          aValue = a[sortField as keyof Service];
          bValue = b[sortField as keyof Service];
        }

        if (sortOrder === 'ascend') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [allServicesData, searchText, sortField, sortOrder, filterStatus]);

  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Handle service actions
  const handleEdit = (service: Service) => {
    setEditingService(service);
    form.setFieldsValue({
      name: service.name,
      description: service.description,
      price: service.price,
      durationMinutes: service.durationMinutes,
      isActive: service.isActive
    });
    setIsModalVisible(true);
  };

  const handleHardDelete = async (serviceId: number) => {
    try {
      await _request({
        path: `/services/${serviceId}/hard`,
        method: "DELETE",
        onSuccess() {
          message.success('Xóa vĩnh viễn dịch vụ thành công');
          loadServices();
        },
        onError(error) {
          message.error('Không thể xóa dịch vụ');
          console.error(error);
        },
      });
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa dịch vụ');
    }
  };

  const handleToggleStatus = async (serviceId: number) => {
    try {
      await _request({
        path: `/services/${serviceId}/toggle-status`,
        method: "PUT",
        onSuccess(data) {
          message.success('Cập nhật trạng thái dịch vụ thành công');
          loadServices();
        },
        onError(error) {
          message.error('Không thể cập nhật trạng thái dịch vụ');
          console.error(error);
        },
      });
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleViewDetails = (service: Service) => {
    Modal.info({
      title: 'Chi tiết dịch vụ',
      width: 600,
      content: (
        <div style={{ marginTop: 16 }}>
          <p><strong>Tên dịch vụ:</strong> {service.name}</p>
          <p><strong>Mô tả:</strong> {service.description}</p>
          <p><strong>Thời gian:</strong> {formatDuration(service.durationMinutes)}</p>
          <p><strong>Giá tiền:</strong> {formatPrice(service.price)}</p>
          <p><strong>Trạng thái:</strong> {service.isActive ? 'Hoạt động' : 'Tạm dừng'}</p>
          <p><strong>Ngày tạo:</strong> {formatDate(service.createdAt)}</p>
          <p><strong>Cập nhật lần cuối:</strong> {formatDate(service.updatedAt)}</p>
        </div>
      ),
    });
  };

  // Get action menu items for each service
  const getActionItems = (service: Service): MenuProps['items'] => [
    {
      key: 'edit',
      label: 'Chỉnh sửa',
      icon: <EditOutlined />,
      onClick: () => handleEdit(service),
    },
    {
      key: 'toggle-status',
      label: service.isActive ? 'Tạm dừng' : 'Kích hoạt',
      icon: <PoweroffOutlined />,
      onClick: () => {
        Modal.confirm({
          title: 'Xác nhận thay đổi trạng thái',
          content: `Bạn có chắc chắn muốn ${service.isActive ? 'tạm dừng' : 'kích hoạt'} dịch vụ "${service.name}"?`,
          okText: 'Xác nhận',
          cancelText: 'Hủy',
          onOk: () => handleToggleStatus(service.id),
        });
      },
    },
    {
      key: 'detail',
      label: 'Chi tiết',
      icon: <EyeOutlined />,
      onClick: () => handleViewDetails(service),
    },
    {
      key: 'delete',
      label: 'Xóa vĩnh viễn',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: 'Xác nhận xóa vĩnh viễn',
          content: (
            <div>
              <p>Bạn có chắc chắn muốn xóa vĩnh viễn dịch vụ "{service.name}"?</p>
              <p style={{ color: '#ff4d4f', fontSize: '12px' }}>
                ⚠️ Hành động này không thể hoàn tác!
              </p>
            </div>
          ),
          okText: 'Xóa vĩnh viễn',
          cancelText: 'Hủy',
          okType: 'danger',
          onOk: () => handleHardDelete(service.id),
        });
      },
    },
  ];

  // Handle form submission
  const handleSubmit = async (values: ServiceFormData) => {
    try {
      const isEdit = !!editingService;
      const path = isEdit ? `/services/${editingService.id}` : '/services';
      const method = isEdit ? 'PUT' : 'POST';

      await _request({
        path,
        method,
        body: {
          name: values.name,
          description: values.description,
          price: values.price,
          durationMinutes: values.durationMinutes,
          isActive: values.isActive,
        },
        onSuccess() {
          message.success(isEdit ? 'Cập nhật dịch vụ thành công' : 'Thêm dịch vụ thành công');
          setIsModalVisible(false);
          form.resetFields();
          setEditingService(null);
          loadServices();
        },
        onError(error) {
          message.error(isEdit ? 'Không thể cập nhật dịch vụ' : 'Không thể thêm dịch vụ');
          console.error(error);
        },
      });
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) return;

    Modal.confirm({
      title: 'Xác nhận xóa vĩnh viễn',
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa vĩnh viễn {selectedRowKeys.length} dịch vụ đã chọn?</p>
          <p style={{ color: '#ff4d4f', fontSize: '12px' }}>
            ⚠️ Hành động này không thể hoàn tác!
          </p>
        </div>
      ),
      okText: 'Xóa vĩnh viễn',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          // Delete services one by one using hard delete endpoint
          for (const key of selectedRowKeys) {
            await _request({
              path: `/services/${key}/hard`,
              method: "DELETE",
              onSuccess() {},
              onError(error) {
                console.error(`Failed to delete service ${key}:`, error);
              },
            });
          }
          message.success('Xóa vĩnh viễn các dịch vụ thành công');
          setSelectedRowKeys([]);
          loadServices();
        } catch (error) {
          message.error('Có lỗi xảy ra khi xóa dịch vụ');
        }
      },
    });
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours}h`;
      }
      return `${hours}h${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const columns: ColumnsType<Service> = [
    {
      title: 'Thông tin dịch vụ',
      dataIndex: 'service',
      width: showCompact ? '50%' : '45%',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar 
            size={showCompact ? 32 : 40} 
            style={{ 
              backgroundColor: '#f0f8ff',
              fontSize: showCompact ? '14px' : '18px'
            }}
          >
            🐾
          </Avatar>
          <div>
            <div style={{ 
              fontWeight: 500, 
              fontSize: showCompact ? '13px' : '14px',
              marginBottom: 2
            }}>
              {record.name}
            </div>
            <div style={{ 
              fontSize: showCompact ? '11px' : '12px', 
              color: '#666',
              lineHeight: 1.3
            }}>
              {record.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'durationMinutes',
      width: '12%',
      sorter: true,
      render: (minutes: number) => (
        <span style={{ fontSize: showCompact ? '12px' : '13px' }}>
          {formatDuration(minutes)}
        </span>
      ),
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      width: '15%',
      sorter: true,
      render: (price: number) => (
        <span style={{ 
          fontWeight: 500,
          color: '#d4380d',
          fontSize: showCompact ? '12px' : '13px'
        }}>
          {formatPrice(price)}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      width: '12%',
      render: (isActive: boolean) => (
        <Tag 
          color={isActive ? 'green' : 'red'}
          style={{ margin: 0, fontSize: showCompact ? '11px' : '12px' }}
        >
          {isActive ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: '15%',
      sorter: true,
      render: (date: string) => (
        <span style={{ fontSize: showCompact ? '12px' : '13px' }}>
          {formatDate(date)}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      width: '11%',
      render: (_, record) => (
        <Dropdown menu={{ items: getActionItems(record) }} trigger={['click']}>
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
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ 
              margin: 0, 
              color: '#1890ff',
              fontSize: '24px',
              fontWeight: 600
            }}>
              Quản lý dịch vụ cửa hàng thú cưng
            </h2>
            <p style={{ 
              margin: '4px 0 0 0', 
              color: '#666',
              fontSize: '14px'
            }}>
              Quản lý và theo dõi các dịch vụ của cửa hàng
            </p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingService(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
            style={{ 
              height: '40px',
              borderRadius: '6px'
            }}
          >
            Thêm dịch vụ mới
          </Button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Space size="middle" wrap>
            <Search
              placeholder="Tìm kiếm theo tên hoặc mô tả dịch vụ..."
              prefix={<SearchOutlined />}
              style={{ width: 400 }}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: 120,
                height: 32,
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                padding: '0 11px',
                fontSize: '14px'
              }}
            >
              <option value="">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm dừng</option>
            </select>
            {selectedRowKeys.length > 0 && (
              <Button danger onClick={handleBulkDelete}>
                Xóa vĩnh viễn đã chọn ({selectedRowKeys.length})
              </Button>
            )}
          </Space>
        </div>

        <div style={{ 
          border: '1px solid #f0f0f0',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <Table
            columns={columns}
            dataSource={currentPageData}
            pagination={false}
            size={showCompact ? "small" : "middle"}
            onChange={handleTableChange}
            rowSelection={rowSelection}
            loading={loading}
            style={{ backgroundColor: 'white' }}
          />
          
          <div style={{ 
            padding: '16px 24px',
            backgroundColor: '#fafafa',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {totalItems > 0 ? `${startItem}-${endItem} của ${totalItems} dịch vụ` : '0 của 0 dịch vụ'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>Hiển thị:</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  style={{
                    width: 60,
                    height: 24,
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    padding: '0 4px',
                    fontSize: '12px'
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Button 
                  type="text" 
                  disabled={currentPage === 1}
                  onClick={goToPreviousPage}
                  style={{ padding: '4px 8px' }}
                >
                  ‹
                </Button>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  {currentPage} / {totalPages || 1}
                </span>
                <Button 
                  type="text"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={goToNextPage}
                  style={{ padding: '4px 8px' }}
                >
                  ›
                </Button>
              </div>
            </div>
          </div>

          <div style={{ 
            padding: '12px 24px',
            backgroundColor: '#fafafa',
            borderTop: '1px solid #f0f0f0'
          }}>
            <Checkbox 
              checked={showCompact}
              onChange={(e) => setShowCompact(e.target.checked)}
              style={{ fontSize: '14px' }}
            >
              Hiển thị thu gọn
            </Checkbox>
          </div>
        </div>

        {selectedRowKeys.length > 0 && (
          <div style={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24, 
            background: '#1890ff', 
            color: 'white',
            padding: '12px 20px', 
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
            fontSize: '14px',
            fontWeight: 500
          }}>
            Đã chọn: {selectedRowKeys.length} dịch vụ
          </div>
        )}
      </div>

      {/* Add/Edit Service Modal */}
      <Modal
        title={editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingService(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isActive: true,
            durationMinutes: 30,
            price: 0
          }}
        >
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}
          >
            <Input placeholder="Nhập tên dịch vụ" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả dịch vụ' }]}
          >
            <TextArea rows={3} placeholder="Nhập mô tả chi tiết về dịch vụ" />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="durationMinutes"
              label="Thời gian (phút)"
              rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
              style={{ flex: 1 }}
            >
              <InputNumber 
                min={1} 
                max={480} 
                style={{ width: '100%' }}
                placeholder="30"
              />
            </Form.Item>

            <Form.Item
              name="price"
              label="Giá tiền (VND)"
              rules={[{ required: true, message: 'Vui lòng nhập giá tiền' }]}
              style={{ flex: 1 }}
            >
              <InputNumber 
                min={0} 
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                placeholder="100,000"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="isActive"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Hoạt động" 
              unCheckedChildren="Tạm dừng" 
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingService(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingService ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServicePage;