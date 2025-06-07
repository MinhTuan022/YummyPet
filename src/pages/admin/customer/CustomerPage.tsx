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
  MoreOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

interface Customer {
  key: string;
  id: number;
  customerCode: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: 'Nam' | 'Nữ';
  isActive: boolean;
  loyaltyPoints: number;
  createdAt: string;
  updatedAt: string;
}

const CustomerPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend');

  // Dữ liệu mẫu khách hàng
  const allCustomersData: Customer[] = [
    {
      key: '1',
      id: 1,
      customerCode: 'KH001',
      fullName: 'Nguyễn Văn Minh',
      email: 'minh.nguyen@email.com',
      phone: '0912345678',
      address: '123 Đường Láng, Đống Đa, Hà Nội',
      dateOfBirth: '1990-05-15',
      gender: 'Nam',
      isActive: true,
      loyaltyPoints: 1250,
      createdAt: '2024-01-15T09:30:00',
      updatedAt: '2024-06-01T14:20:00'
    },
    {
      key: '2',
      id: 2,
      customerCode: 'KH002',
      fullName: 'Trần Thị Hương',
      email: 'huong.tran@email.com',
      phone: '0987654321',
      address: '456 Phố Huế, Hai Bà Trưng, Hà Nội',
      dateOfBirth: '1985-08-22',
      gender: 'Nữ',
      isActive: true,
      loyaltyPoints: 2100,
      createdAt: '2024-02-20T10:15:00',
      updatedAt: '2024-06-05T16:45:00'
    },
    {
      key: '3',
      id: 3,
      customerCode: 'KH003',
      fullName: 'Lê Hoàng Anh',
      email: 'anh.le@email.com',
      phone: '0901234567',
      address: '789 Giải Phóng, Thanh Xuân, Hà Nội',
      dateOfBirth: '1992-12-08',
      gender: 'Nam',
      isActive: false,
      loyaltyPoints: 450,
      createdAt: '2024-03-10T08:45:00',
      updatedAt: '2024-05-20T11:30:00'
    },
    {
      key: '4',
      id: 4,
      customerCode: 'KH004',
      fullName: 'Phạm Thị Mai',
      email: 'mai.pham@email.com',
      phone: '0934567890',
      address: '321 Nguyễn Trãi, Thanh Xuân, Hà Nội',
      dateOfBirth: '1988-03-25',
      gender: 'Nữ',
      isActive: true,
      loyaltyPoints: 1800,
      createdAt: '2024-04-05T13:20:00',
      updatedAt: '2024-06-03T09:15:00'
    },
    {
      key: '5',
      id: 5,
      customerCode: 'KH005',
      fullName: 'Hoàng Văn Đức',
      email: 'duc.hoang@email.com',
      phone: '0945678901',
      address: '654 Cầu Giấy, Cầu Giấy, Hà Nội',
      dateOfBirth: '1995-07-12',
      gender: 'Nam',
      isActive: true,
      loyaltyPoints: 750,
      createdAt: '2024-04-18T15:30:00',
      updatedAt: '2024-06-06T12:00:00'
    },
    {
      key: '6',
      id: 6,
      customerCode: 'KH006',
      fullName: 'Vũ Thị Lan',
      email: 'lan.vu@email.com',
      phone: '0956789012',
      address: '987 Tây Sơn, Đống Đa, Hà Nội',
      dateOfBirth: '1991-11-30',
      gender: 'Nữ',
      isActive: true,
      loyaltyPoints: 1350,
      createdAt: '2024-05-02T11:45:00',
      updatedAt: '2024-06-04T14:30:00'
    },
    {
      key: '7',
      id: 7,
      customerCode: 'KH007',
      fullName: 'Đỗ Văn Hải',
      email: 'hai.do@email.com',
      phone: '0967890123',
      address: '147 Kim Mã, Ba Đình, Hà Nội',
      dateOfBirth: '1987-04-18',
      gender: 'Nam',
      isActive: true,
      loyaltyPoints: 920,
      createdAt: '2024-05-15T09:00:00',
      updatedAt: '2024-06-02T10:20:00'
    },
    {
      key: '8',
      id: 8,
      customerCode: 'KH008',
      fullName: 'Bùi Thị Thu',
      email: 'thu.bui@email.com',
      phone: '0978901234',
      address: '258 Xã Đàn, Đống Đa, Hà Nội',
      dateOfBirth: '1993-09-05',
      gender: 'Nữ',
      isActive: false,
      loyaltyPoints: 280,
      createdAt: '2024-05-20T16:15:00',
      updatedAt: '2024-05-25T08:45:00'
    },
    {
      key: '9',
      id: 9,
      customerCode: 'KH009',
      fullName: 'Ngô Văn Tùng',
      email: 'tung.ngo@email.com',
      phone: '0989012345',
      address: '369 Nguyễn Xiển, Thanh Xuân, Hà Nội',
      dateOfBirth: '1994-06-20',
      gender: 'Nam',
      isActive: true,
      loyaltyPoints: 1650,
      createdAt: '2024-05-25T12:30:00',
      updatedAt: '2024-06-07T15:10:00'
    },
    {
      key: '10',
      id: 10,
      customerCode: 'KH010',
      fullName: 'Đinh Thị Hoa',
      email: 'hoa.dinh@email.com',
      phone: '0990123456',
      address: '741 Trường Chinh, Thanh Xuân, Hà Nội',
      dateOfBirth: '1989-01-14',
      gender: 'Nữ',
      isActive: true,
      loyaltyPoints: 2250,
      createdAt: '2024-05-28T14:00:00',
      updatedAt: '2024-06-06T11:25:00'
    }
  ];

  const filteredData = useMemo(() => {
    let filtered = allCustomersData;

    if (searchText) {
      filtered = filtered.filter(customer =>
        customer.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.phone.includes(searchText) ||
        customer.customerCode.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;
        
        if (sortField === 'createdAt' || sortField === 'updatedAt') {
          aValue = new Date(a[sortField]).getTime();
          bValue = new Date(b[sortField]).getTime();
        } else if (sortField === 'loyaltyPoints') {
          aValue = a.loyaltyPoints;
          bValue = b.loyaltyPoints;
        } else {
          aValue = a[sortField as keyof Customer];
          bValue = b[sortField as keyof Customer];
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
      icon: <UserOutlined />
    },
    {
      key: '2',
      label: 'Xem chi tiết',
      icon: <SearchOutlined />
    },
    {
      key: '3',
      label: 'Lịch sử mua hàng',
    },
    {
      key: '4',
      label: 'Khóa tài khoản',
      danger: true
    },
  ];

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const columns: ColumnsType<Customer> = [
    {
      title: 'Thông tin khách hàng',
      dataIndex: 'customer',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar 
            size={45} 
            style={{ 
              backgroundColor: record.gender === 'Nam' ? '#1890ff' : '#ff69b4',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            {record.fullName.split(' ').pop()?.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px', color: '#262626' }}>
              {record.fullName}
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              {record.customerCode} • {getAge(record.dateOfBirth)} tuổi
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Liên hệ',
      dataIndex: 'contact',
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <PhoneOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
            <span style={{ fontSize: '13px' }}>{record.phone}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MailOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
            <span style={{ fontSize: '13px', color: '#595959' }}>{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      sorter: true,
      render: (gender: string) => (
        <Tag color={gender === 'Nam' ? 'blue' : 'pink'}>
          {gender}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      sorter: true,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      render: (isActive: boolean) => (
        <Tag 
          color={isActive ? 'green' : 'red'}
          style={{ fontWeight: '500' }}
        >
          {isActive ? 'Hoạt động' : 'Ngưng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Điểm tích lũy',
      dataIndex: 'loyaltyPoints',
      render: (points: number) => (
        <span style={{ 
          color: points > 1500 ? '#52c41a' : points > 1000 ? '#fa8c16' : '#8c8c8c',
          fontWeight: '600'
        }}>
          {points.toLocaleString()} điểm
        </span>
      ),
      sorter: true,
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      render: () => (
        <Dropdown menu={{ items: actionItems }} trigger={['click']}>
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
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          {/* <h2 style={{ margin: '0 0 16px 0', color: '#262626', fontSize: '24px', fontWeight: '600' }}>
            Quản lý khách hàng
          </h2> */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Search
              placeholder="Tìm kiếm theo tên, email, số điện thoại hoặc mã khách hàng"
              prefix={<SearchOutlined />}
              style={{ width: 400 }}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
            <Button icon={<FilterOutlined />} style={{ borderColor: '#d9d9d9' }}>
              Bộ lọc
            </Button>
            <Button type="primary">
              + Thêm khách hàng mới
            </Button>
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
            style={{ marginBottom: '16px' }}
          />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '16px 0'
          }}>
            <div style={{ color: '#8c8c8c', fontSize: '14px' }}>
              {totalItems > 0 ? `${startItem}-${endItem} trong tổng số ${totalItems}` : '0 trong tổng số 0'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#8c8c8c', fontSize: '14px' }}>Hiển thị:</span>
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
                disabled={currentPage === 1}
                onClick={goToPreviousPage}
                style={{ padding: '4px 8px' }}
              >
                ‹
              </Button>
              <span style={{ color: '#8c8c8c', fontSize: '14px' }}>
                Trang {currentPage} / {totalPages}
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

          <div style={{ paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
            <Checkbox>
              Hiển thị thu gọn
            </Checkbox>
          </div>
        </div>

        {selectedRowKeys.length > 0 && (
          <div style={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24, 
            backgroundColor: '#1890ff',
            color: 'white',
            padding: '12px 20px', 
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontWeight: '500'
          }}>
            Đã chọn: {selectedRowKeys.length} khách hàng
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerPage;