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
  UserOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

interface Employee {
  key: string;
  id: number;
  fullName: string;
  email: string;
  phone: string;
  employeeCode: string;
  password: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role: string;
  gender: 'Nam' | 'Nữ';
  address: string;
  dateOfBirth: string;
}

const EmployeePage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend');

  const allEmployeeData: Employee[] = [
    {
      key: '1',
      id: 1,
      fullName: 'Nguyễn Văn An',
      email: 'nguyenvanan@petshop.com',
      phone: '0912345678',
      employeeCode: 'NV001',
      password: '********',
      isActive: true,
      createdAt: '2024-01-15',
      updatedAt: '2025-06-07',
      role: 'Quản lý',
      gender: 'Nam',
      address: '123 Đường ABC, Hà Nội',
      dateOfBirth: '1990-05-15'
    },
    {
      key: '2',
      id: 2,
      fullName: 'Trần Thị Bình',
      email: 'tranthibinh@petshop.com',
      phone: '0987654321',
      employeeCode: 'NV002',
      password: '********',
      isActive: true,
      createdAt: '2024-02-20',
      updatedAt: '2025-06-06',
      role: 'Nhân viên bán hàng',
      gender: 'Nữ',
      address: '456 Đường XYZ, Hà Nội',
      dateOfBirth: '1995-08-22'
    },
    {
      key: '3',
      id: 3,
      fullName: 'Lê Minh Cường',
      email: 'leminhcuong@petshop.com',
      phone: '0901234567',
      employeeCode: 'NV003',
      password: '********',
      isActive: true,
      createdAt: '2024-03-10',
      updatedAt: '2025-06-05',
      role: 'Chăm sóc thú cưng',
      gender: 'Nam',
      address: '789 Đường DEF, Hà Nội',
      dateOfBirth: '1992-12-03'
    },
    {
      key: '4',
      id: 4,
      fullName: 'Phạm Thị Dung',
      email: 'phamthidung@petshop.com',
      phone: '0934567890',
      employeeCode: 'NV004',
      password: '********',
      isActive: false,
      createdAt: '2024-04-05',
      updatedAt: '2025-05-20',
      role: 'Nhân viên bán hàng',
      gender: 'Nữ',
      address: '321 Đường GHI, Hà Nội',
      dateOfBirth: '1988-07-18'
    },
    {
      key: '5',
      id: 5,
      fullName: 'Hoàng Văn Em',
      email: 'hoangvanem@petshop.com',
      phone: '0945678901',
      employeeCode: 'NV005',
      password: '********',
      isActive: true,
      createdAt: '2024-05-12',
      updatedAt: '2025-06-04',
      role: 'Kế toán',
      gender: 'Nam',
      address: '654 Đường JKL, Hà Nội',
      dateOfBirth: '1985-11-28'
    },
    {
      key: '6',
      id: 6,
      fullName: 'Vũ Thị Phương',
      email: 'vuthiphuong@petshop.com',
      phone: '0956789012',
      employeeCode: 'NV006',
      password: '********',
      isActive: true,
      createdAt: '2024-06-18',
      updatedAt: '2025-06-03',
      role: 'Bác sĩ thú y',
      gender: 'Nữ',
      address: '987 Đường MNO, Hà Nội',
      dateOfBirth: '1987-04-10'
    },
    {
      key: '7',
      id: 7,
      fullName: 'Đỗ Minh Giang',
      email: 'dominhhgiang@petshop.com',
      phone: '0967890123',
      employeeCode: 'NV007',
      password: '********',
      isActive: true,
      createdAt: '2024-07-22',
      updatedAt: '2025-06-02',
      role: 'Nhân viên kho',
      gender: 'Nam',
      address: '147 Đường PQR, Hà Nội',
      dateOfBirth: '1993-09-14'
    },
    {
      key: '8',
      id: 8,
      fullName: 'Bùi Thị Hoa',
      email: 'buithihoa@petshop.com',
      phone: '0978901234',
      employeeCode: 'NV008',
      password: '********',
      isActive: true,
      createdAt: '2024-08-15',
      updatedAt: '2025-06-01',
      role: 'Nhân viên bán hàng',
      gender: 'Nữ',
      address: '258 Đường STU, Hà Nội',
      dateOfBirth: '1996-01-25'
    },
    {
      key: '9',
      id: 9,
      fullName: 'Lý Văn Inh',
      email: 'lyvaninh@petshop.com',
      phone: '0989012345',
      employeeCode: 'NV009',
      password: '********',
      isActive: false,
      createdAt: '2024-09-08',
      updatedAt: '2025-05-15',
      role: 'Chăm sóc thú cưng',
      gender: 'Nam',
      address: '369 Đường VWX, Hà Nội',
      dateOfBirth: '1991-06-07'
    },
    {
      key: '10',
      id: 10,
      fullName: 'Ngô Thị Kim',
      email: 'ngothikim@petshop.com',
      phone: '0990123456',
      employeeCode: 'NV010',
      password: '********',
      isActive: true,
      createdAt: '2024-10-12',
      updatedAt: '2025-05-30',
      role: 'Tiếp tân',
      gender: 'Nữ',
      address: '741 Đường YZ, Hà Nội',
      dateOfBirth: '1994-03-19'
    }
  ];

  const filteredData = useMemo(() => {
    let filtered = allEmployeeData;

    if (searchText) {
      filtered = filtered.filter(employee =>
        employee.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.employeeCode.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;
        
        if (sortField === 'createdAt' || sortField === 'updatedAt') {
          aValue = new Date(a[sortField as keyof Employee] as string).getTime();
          bValue = new Date(b[sortField as keyof Employee] as string).getTime();
        } else {
          aValue = a[sortField as keyof Employee];
          bValue = b[sortField as keyof Employee];
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
      label: 'Xem chi tiết',
    },
    {
      key: '4', 
      label: 'Đặt lại mật khẩu',
    },
  ];

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);
    }
  };

  const columns: ColumnsType<Employee> = [
    {
      title: '',
      dataIndex: 'checkbox',
      width: 50,
    },
    {
      title: 'Thông tin nhân viên',
      dataIndex: 'employee',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar 
            size={40} 
            icon={<UserOutlined />}
            style={{ 
              backgroundColor: record.isActive ? '#1890ff' : '#d9d9d9',
              color: record.isActive ? '#fff' : '#999'
            }}
          >
            {record.fullName.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500, color: '#262626' }}>{record.fullName}</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              {record.employeeCode} • {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Chức vụ',
      dataIndex: 'role',
      sorter: true,
      render: (role: string) => {
        let color = 'blue';
        switch (role) {
          case 'Quản lý':
            color = 'red';
            break;
          case 'Bác sĩ thú y':
            color = 'green';
            break;
          case 'Kế toán':
            color = 'orange';
            break;
          case 'Nhân viên bán hàng':
            color = 'blue';
            break;
          case 'Chăm sóc thú cưng':
            color = 'purple';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      render: (phone: string) => (
        <span style={{ color: '#1890ff' }}>{phone}</span>
      ),
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      render: (gender: string) => (
        <Tag color={gender === 'Nam' ? 'blue' : 'pink'}>{gender}</Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      render: (isActive: boolean) => (
        <Tag 
          color={isActive ? 'green' : 'red'}
          style={{ fontWeight: 500 }}
        >
          {isActive ? 'Đang làm việc' : 'Đã nghỉ việc'}
        </Tag>
      ),
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
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ 
        background: '#fff', 
        borderRadius: '8px', 
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ margin: 0, color: '#262626' }}>Quản lý nhân viên</h2>
          <Button type="primary" style={{ backgroundColor: '#1890ff' }}>
            Thêm nhân viên mới
          </Button>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Search
              placeholder="Tìm kiếm theo tên, email, mã NV hoặc chức vụ"
              prefix={<SearchOutlined />}
              style={{ width: 400 }}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
            <Button icon={<FilterOutlined />}>
              Bộ lọc
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
            style={{ backgroundColor: '#fff' }}
          />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '16px',
            padding: '12px 0'
          }}>
            <div style={{ color: '#8c8c8c' }}>
              {totalItems > 0 ? `${startItem}-${endItem} của ${totalItems}` : '0 của 0'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#8c8c8c' }}>Số hàng mỗi trang:</span>
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
              <Button 
                type="text" 
                disabled={currentPage === 1}
                onClick={goToPreviousPage}
              >
                ‹
              </Button>
              <span style={{ color: '#8c8c8c' }}>
                {currentPage} của {totalPages}
              </span>
              <Button 
                type="text"
                disabled={currentPage === totalPages}
                onClick={goToNextPage}
              >
                ›
              </Button>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <Checkbox>
              Hiển thị thu gọn
            </Checkbox>
          </div>
        </div>

        {selectedRowKeys.length > 0 && (
          <div style={{ 
            position: 'fixed', 
            bottom: 20, 
            right: 20, 
            background: '#1890ff', 
            color: '#fff',
            padding: '12px 20px', 
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontWeight: 500
          }}>
            Đã chọn: {selectedRowKeys.length} nhân viên
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeePage;