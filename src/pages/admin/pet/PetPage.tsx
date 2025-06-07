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
import "./PetPage.scss"

const { Search } = Input;
const { Option } = Select;

interface Pet {
  key: string;
  id: string;
  name: string;
  category: string;
  date: string;
  status: 'InStock' | 'Out of Stock';
  price: number;
  image: string;
  breed: string;
  age: string;
}

const PetPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend');

  const allPetsData: Pet[] = [
    {
      key: '1',
      id: '1',
      name: 'Golden Retriever Puppy',
      category: 'Dog',
      breed: 'Golden Retriever',
      age: '3 months',
      date: 'Fri, Jun 6 2025',
      status: 'InStock',
      price: 1200,
      image: '🐕'
    },
    {
      key: '2',
      id: '2',
      name: 'Persian Cat',
      category: 'Cat',
      breed: 'Persian',
      age: '6 months',
      date: 'Thu, Jun 5 2025',
      status: 'Out of Stock',
      price: 800,
      image: '🐱'
    },
    {
      key: '3',
      id: '3',
      name: 'Holland Lop Rabbit',
      category: 'Rabbit',
      breed: 'Holland Lop',
      age: '2 months',
      date: 'Thu, Jun 5 2025',
      status: 'InStock',
      price: 150,
      image: '🐰'
    },
    {
      key: '4',
      id: '4',
      name: 'African Grey Parrot',
      category: 'Bird',
      breed: 'African Grey',
      age: '1 year',
      date: 'Tue, Jun 3 2025',
      status: 'InStock',
      price: 2500,
      image: '🦜'
    },
    {
      key: '5',
      id: '5',
      name: 'Goldfish',
      category: 'Fish',
      breed: 'Goldfish',
      age: '6 months',
      date: 'Sun, Jun 1 2025',
      status: 'InStock',
      price: 25,
      image: '🐠'
    },
    {
      key: '6',
      id: '6',
      name: 'Siberian Husky',
      category: 'Dog',
      breed: 'Siberian Husky',
      age: '4 months',
      date: 'Sat, May 31 2025',
      status: 'InStock',
      price: 1500,
      image: '🐕'
    },
    {
      key: '7',
      id: '7',
      name: 'British Shorthair',
      category: 'Cat',
      breed: 'British Shorthair',
      age: '5 months',
      date: 'Fri, May 30 2025',
      status: 'InStock',
      price: 900,
      image: '🐱'
    },
    {
      key: '8',
      id: '8',
      name: 'Hamster',
      category: 'Small Pet',
      breed: 'Syrian Hamster',
      age: '2 months',
      date: 'Thu, May 29 2025',
      status: 'InStock',
      price: 35,
      image: '🐹'
    },
    {
      key: '9',
      id: '9',
      name: 'Canary Bird',
      category: 'Bird',
      breed: 'Canary',
      age: '8 months',
      date: 'Wed, May 28 2025',
      status: 'Out of Stock',
      price: 180,
      image: '🐦'
    },
    {
      key: '10',
      id: '10',
      name: 'Guinea Pig',
      category: 'Small Pet',
      breed: 'American Guinea Pig',
      age: '3 months',
      date: 'Tue, May 27 2025',
      status: 'InStock',
      price: 45,
      image: '🐹'
    },
    {
      key: '11',
      id: '11',
      name: 'Beagle Puppy',
      category: 'Dog',
      breed: 'Beagle',
      age: '2 months',
      date: 'Mon, May 26 2025',
      status: 'InStock',
      price: 1000,
      image: '🐕'
    },
    {
      key: '12',
      id: '12',
      name: 'Maine Coon Cat',
      category: 'Cat',
      breed: 'Maine Coon',
      age: '7 months',
      date: 'Sun, May 25 2025',
      status: 'InStock',
      price: 1100,
      image: '🐱'
    }
  ];

  const filteredData = useMemo(() => {
    let filtered = allPetsData;

    if (searchText) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchText.toLowerCase()) ||
        pet.category.toLowerCase().includes(searchText.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;
        
        if (sortField === 'date') {
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
        } else if (sortField === 'price') {
          aValue = a.price;
          bValue = b.price;
        } else {
          aValue = a[sortField as keyof Pet];
          bValue = b[sortField as keyof Pet];
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
      label: 'Edit',
    },
    {
      key: '2',
      label: 'Delete',
    },
    {
      key: '3',
      label: 'View Details',
    },
  ];

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);
    }
  };

  const columns: ColumnsType<Pet> = [
    // {
    //   title: '',
    //   dataIndex: 'checkbox',
    //   width: 50,
    //   // render: (_, record) => (
    //   //   <Checkbox 
    //   //     checked={selectedRowKeys.includes(record.key)}
    //   //     onChange={(e) => {
    //   //       if (e.target.checked) {
    //   //         setSelectedRowKeys([...selectedRowKeys, record.key]);
    //   //       } else {
    //   //         setSelectedRowKeys(selectedRowKeys.filter(key => key !== record.key));
    //   //       }
    //   //     }}
    //   //   />
    //   // ),
    // },
    {
      title: 'Pet Information',
      dataIndex: 'pet',
      render: (_, record) => (
        <div className="product-info">
          <Avatar 
            size={40} 
            className={`product-avatar product-avatar-${record.category.toLowerCase()}`}
          >
            {record.image}
          </Avatar>
          <div className="product-details">
            <div className="product-name">{record.name}</div>
            <div className="product-category">{record.breed} • {record.age}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      sorter: true,
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: 'Date Added',
      dataIndex: 'date',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag 
          color={status === 'InStock' ? 'green' : 'red'}
          className="status-tag"
        >
          {status === 'InStock' ? 'Available' : 'Sold Out'}
        </Tag>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price: number) => `$${price}`,
      sorter: true,
    },
    {
      title: 'Action',
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
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset
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
    <div className="product-management">
      <div className="header">
        <div className="search-section">
          <Search
            placeholder="Search pets by name, category, or breed"
            prefix={<SearchOutlined />}
            style={{ width: 350 }}
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
          <Button icon={<FilterOutlined />} className="filter-button">
            Filter
          </Button>
        </div>
      </div>

      <div className="table-container">
        <Table
          columns={columns}
          dataSource={currentPageData}
          pagination={false}
          size="middle"
          onChange={handleTableChange}
          rowSelection={rowSelection}
        />
        
        <div className="pagination-container">
          <div className="pagination-info">
            {totalItems > 0 ? `${startItem}-${endItem} of ${totalItems}` : '0 of 0'}
          </div>
          <div className="pagination-controls">
            <span style={{ marginRight: 8, color: '#8c8c8c' }}>Rows per page:</span>
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
            <span style={{ margin: '0 8px', color: '#8c8c8c' }}>
              {currentPage} of {totalPages}
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

        <div className="dense-padding-section">
          <Checkbox>
            Dense padding
          </Checkbox>
        </div>
      </div>

      {selectedRowKeys.length > 0 && (
        <div style={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20, 
          background: '#f0f0f0', 
          padding: '10px 20px', 
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          Selected: {selectedRowKeys.length} pets
        </div>
      )}
    </div>
  );
};

export default PetPage;