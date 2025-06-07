import React, { useState, useMemo } from 'react';
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
  MenuProps
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  MoreOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

interface Service {
  key: string;
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: string;
}

const ServiceManagement: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend');

  // Dữ liệu mẫu về dịch vụ cửa hàng thú cưng
  const allServicesData: Service[] = [
    {
      key: '1',
      id: '1',
      name: 'Tắm và cắt tỉa lông chó',
      description: 'Dịch vụ tắm rửa và cắt tỉa lông chuyên nghiệp cho chó',
      durationMinutes: 90,
      price: 250000,
      isActive: true,
      createdAt: '2025-06-01',
      updatedAt: '2025-06-05',
      category: 'Chăm sóc sắc đẹp'
    },
    {
      key: '2',
      id: '2',
      name: 'Khám sức khỏe tổng quát',
      description: 'Kiểm tra sức khỏe định kỳ và tư vấn chăm sóc thú cưng',
      durationMinutes: 45,
      price: 150000,
      isActive: true,
      createdAt: '2025-05-28',
      updatedAt: '2025-06-03',
      category: 'Y tế thú y'
    },
    {
      key: '3',
      id: '3',
      name: 'Tiêm phòng vaccine',
      description: 'Tiêm các loại vaccine phòng bệnh cho chó mèo',
      durationMinutes: 30,
      price: 200000,
      isActive: true,
      createdAt: '2025-05-25',
      updatedAt: '2025-06-01',
      category: 'Y tế thú y'
    },
    {
      key: '4',
      id: '4',
      name: 'Cắt móng và vệ sinh tai',
      description: 'Cắt móng chân và vệ sinh tai cho thú cưng',
      durationMinutes: 20,
      price: 50000,
      isActive: true,
      createdAt: '2025-05-20',
      updatedAt: '2025-05-30',
      category: 'Chăm sóc sắc đẹp'
    },
    {
      key: '5',
      id: '5',
      name: 'Tắm cho mèo',
      description: 'Dịch vụ tắm rửa chuyên dụng cho mèo',
      durationMinutes: 60,
      price: 180000,
      isActive: true,
      createdAt: '2025-05-18',
      updatedAt: '2025-05-28',
      category: 'Chăm sóc sắc đẹp'
    },
    {
      key: '6',
      id: '6',
      name: 'Khám và điều trị bệnh ngoài da',
      description: 'Chẩn đoán và điều trị các bệnh về da cho thú cưng',
      durationMinutes: 60,
      price: 300000,
      isActive: true,
      createdAt: '2025-05-15',
      updatedAt: '2025-05-25',
      category: 'Y tế thú y'
    },
    {
      key: '7',
      id: '7',
      name: 'Vệ sinh răng miệng',
      description: 'Làm sạch cao răng và vệ sinh răng miệng cho thú cưng',
      durationMinutes: 40,
      price: 120000,
      isActive: false,
      createdAt: '2025-05-12',
      updatedAt: '2025-05-20',
      category: 'Chăm sóc sắc đẹp'
    },
    {
      key: '8',
      id: '8',
      name: 'Gửi thú cưng theo ngày',
      description: 'Dịch vụ trông giữ thú cưng trong ngày',
      durationMinutes: 480,
      price: 100000,
      isActive: true,
      createdAt: '2025-05-10',
      updatedAt: '2025-05-18',
      category: 'Chăm sóc'
    },
    {
      key: '9',
      id: '9',
      name: 'Huấn luyện cơ bản',
      description: 'Huấn luyện những kỹ năng cơ bản cho chó con',
      durationMinutes: 120,
      price: 500000,
      isActive: true,
      createdAt: '2025-05-08',
      updatedAt: '2025-05-15',
      category: 'Huấn luyện'
    },
    {
      key: '10',
      id: '10',
      name: 'Phẫu thuật triệt sản',
      description: 'Phẫu thuật triệt sản cho chó mèo',
      durationMinutes: 180,
      price: 800000,
      isActive: true,
      createdAt: '2025-05-05',
      updatedAt: '2025-05-12',
      category: 'Y tế thú y'
    },
    {
      key: '11',
      id: '11',
      name: 'Spa thư giãn cho thú cưng',
      description: 'Dịch vụ spa và massage thư giãn cao cấp',
      durationMinutes: 150,
      price: 400000,
      isActive: false,
      createdAt: '2025-05-03',
      updatedAt: '2025-05-10',
      category: 'Chăm sóc sắc đẹp'
    },
    {
      key: '12',
      id: '12',
      name: 'Tư vấn dinh dưỡng',
      description: 'Tư vấn chế độ dinh dưỡng phù hợp cho từng loại thú cưng',
      durationMinutes: 30,
      price: 80000,
      isActive: true,
      createdAt: '2025-05-01',
      updatedAt: '2025-05-08',
      category: 'Tư vấn'
    }
  ];

  const filteredData = useMemo(() => {
    let filtered = allServicesData;

    if (searchText) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchText.toLowerCase()) ||
        service.description.toLowerCase().includes(searchText.toLowerCase()) ||
        service.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }

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
  }, [searchText, sortField, sortOrder]);

  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const actionItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Chỉnh sửa',
    },
    {
      key: '2',
      label: 'Xóa',
    },
    {
      key: '3',
      label: 'Chi tiết',
    },
    {
      key: '4',
      label: 'Sao chép',
    },
  ];

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);
    }
  };

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'Y tế thú y': return '🏥';
      case 'Chăm sóc sắc đẹp': return '✂️';
      case 'Chăm sóc': return '🤗';
      case 'Huấn luyện': return '🎾';
      case 'Tư vấn': return '💡';
      default: return '🐾';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Y tế thú y': return 'red';
      case 'Chăm sóc sắc đẹp': return 'purple';
      case 'Chăm sóc': return 'blue';
      case 'Huấn luyện': return 'orange';
      case 'Tư vấn': return 'green';
      default: return 'default';
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
      width: '35%',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar 
            size={40} 
            style={{ 
              backgroundColor: '#f0f8ff',
              fontSize: '18px'
            }}
          >
            {getServiceIcon(record.category)}
          </Avatar>
          <div>
            <div style={{ 
              fontWeight: 500, 
              fontSize: '14px',
              marginBottom: 2
            }}>
              {record.name}
            </div>
            <div style={{ 
              fontSize: '12px', 
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
      title: 'Danh mục',
      dataIndex: 'category',
      width: '12%',
      sorter: true,
      render: (category: string) => (
        <Tag color={getCategoryColor(category)} style={{ margin: 0 }}>
          {category}
        </Tag>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'durationMinutes',
      width: '10%',
      sorter: true,
      render: (minutes: number) => (
        <span style={{ fontSize: '13px' }}>
          {formatDuration(minutes)}
        </span>
      ),
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      width: '12%',
      sorter: true,
      render: (price: number) => (
        <span style={{ 
          fontWeight: 500,
          color: '#d4380d'
        }}>
          {formatPrice(price)}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      width: '10%',
      render: (isActive: boolean) => (
        <Tag 
          color={isActive ? 'green' : 'red'}
          style={{ margin: 0 }}
        >
          {isActive ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: '12%',
      sorter: true,
      render: (date: string) => (
        <span style={{ fontSize: '13px' }}>
          {formatDate(date)}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      width: '9%',
      render: () => (
        <Dropdown menu={{ items: actionItems }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
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
            style={{ 
              height: '40px',
              borderRadius: '6px'
            }}
          >
            + Thêm dịch vụ mới
          </Button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Space size="middle">
            <Search
              placeholder="Tìm kiếm theo tên, mô tả hoặc danh mục dịch vụ..."
              prefix={<SearchOutlined />}
              style={{ width: 400 }}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
            <Button 
              icon={<FilterOutlined />} 
              style={{ height: '32px' }}
            >
              Bộ lọc
            </Button>
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
            size="middle"
            onChange={handleTableChange}
            rowSelection={rowSelection}
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
                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  style={{ width: 60 }}
                  size="small"
                >
                  <Option value={5}>5</Option>
                  <Option value={10}>10</Option>
                  <Option value={20}>20</Option>
                </Select>
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
                  {currentPage} / {totalPages}
                </span>
                <Button 
                  type="text"
                  disabled={currentPage === totalPages}
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
            <Checkbox style={{ fontSize: '14px' }}>
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
    </div>
  );
};

export default ServiceManagement;