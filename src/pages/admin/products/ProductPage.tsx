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
  Popconfirm,
  Select,
  Descriptions, Image
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  MoreOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PoweroffOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import type { ColumnsType, MenuProps } from 'antd/es/table';
import { _request } from '../../../network/Api';

const { Search, TextArea } = Input;
const { Option } = Select;

interface Product {
  key: string;
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  ageMonths: number | null;
  breed: string | null;
  color: string | null;
  gender: string | null;
  healthStatus: string | null;
  vaccinationStatus: string | null;
  certificateInfo: string | null;
  weight: number | null;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  categoryName: string;
  barcode?: string;
  barcodeType?: string;
  sku?: string;
  isPet?: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
  isActive: boolean;
  isPet: boolean;
  barcode: string;
  barcodeType: string;
  sku: string;
}

interface Category {
  id: number;
  name: string;
}

const ProductPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend');
  const [allProductsData, setAllProductsData] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [showCompact, setShowCompact] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const loadProducts =  () => {
    setLoading(true);
    try {
       _request({
        path: "/admin/products/non-pets",
        method: "GET",
        onSuccess(data) {
          const productsWithKeys = data.data.map((product: any) => ({
            ...product,
            key: product.id.toString()
          }));
          setAllProductsData(productsWithKeys);
        },
        onError(error) {
          message.error('Không thể tải danh sách sản phẩm');
          console.error(error);
        },
      });
    } finally {
      setLoading(false);
    }
  };
  const loadCategories = async () => {
    try {
      await _request({
        path: "/categories",
        method: "GET",
        onSuccess(data) {
          setCategories(data.data || []);
        },
        onError(error) {
          console.error('Không thể tải danh sách danh mục:', error);
        },
      });
    } catch (error) {
      console.error('Có lỗi xảy ra khi tải danh mục');
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = allProductsData;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.description.toLowerCase().includes(searchText.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(searchText.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchText.toLowerCase())) ||
        (product.barcode && product.barcode.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    if (filterStatus) {
      const isActive = filterStatus === 'active';
      filtered = filtered.filter(product => product.isActive === isActive);
    }

    if (filterCategory) {
      filtered = filtered.filter(product => product.categoryId.toString() === filterCategory);
    }

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;
        
        if (sortField === 'createdAt' || sortField === 'updatedAt') {
          aValue = new Date(a[sortField as keyof Product] as string).getTime();
          bValue = new Date(b[sortField as keyof Product] as string).getTime();
        } else if (sortField === 'price' || sortField === 'stockQuantity') {
          aValue = a[sortField as keyof Product] as number;
          bValue = b[sortField as keyof Product] as number;
        } else {
          aValue = a[sortField as keyof Product];
          bValue = b[sortField as keyof Product];
        }

        if (sortOrder === 'ascend') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [allProductsData, searchText, sortField, sortOrder, filterStatus, filterCategory]);

  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
      isActive: product.isActive,
      isPet: product.isPet || false,
      barcode: product.barcode || '',
      barcodeType: product.barcodeType || '',
      sku: product.sku || ''
    });
    setIsModalVisible(true);
  };

  const handleHardDelete = async (productId: number) => {
    try {
      await _request({
        path: `/admin/products/${productId}/hard`,
        method: "DELETE",
        onSuccess() {
          message.success('Xóa vĩnh viễn sản phẩm thành công');
          loadProducts();
        },
        onError(error) {
          message.error('Không thể xóa sản phẩm');
          console.error(error);
        },
      });
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  const handleToggleStatus = async (productId: number) => {
    try {
      await _request({
        path: `/products/${productId}/toggle-status`,
        method: "PUT",
        onSuccess(data) {
          message.success('Cập nhật trạng thái sản phẩm thành công');
          loadProducts();
        },
        onError(error) {
          message.error('Không thể cập nhật trạng thái sản phẩm');
          console.error(error);
        },
      });
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleViewDetails = (product: Product) => {
  setSelectedProduct(product);
  setIsViewModalVisible(true);
};

  const getActionItems = (product: Product): MenuProps['items'] => [
    {
      key: 'edit',
      label: 'Chỉnh sửa',
      icon: <EditOutlined />,
      onClick: () => handleEdit(product),
    },
    {
      key: 'toggle-status',
      label: product.isActive ? 'Tạm dừng' : 'Kích hoạt',
      icon: <PoweroffOutlined />,
      onClick: () => {
        Modal.confirm({
          title: 'Xác nhận thay đổi trạng thái',
          content: `Bạn có chắc chắn muốn ${product.isActive ? 'tạm dừng' : 'kích hoạt'} sản phẩm "${product.name}"?`,
          okText: 'Xác nhận',
          cancelText: 'Hủy',
          onOk: () => handleToggleStatus(product.id),
        });
      },
    },
    {
      key: 'detail',
      label: 'Chi tiết',
      icon: <EyeOutlined />,
      onClick: () => handleViewDetails(product),
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
              <p>Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm "{product.name}"?</p>
              <p style={{ color: '#ff4d4f', fontSize: '12px' }}>
                ⚠️ Hành động này không thể hoàn tác!
              </p>
            </div>
          ),
          okText: 'Xóa vĩnh viễn',
          cancelText: 'Hủy',
          okType: 'danger',
          onOk: () => handleHardDelete(product.id),
        });
      },
    },
  ];

  const handleSubmit = async (values: ProductFormData) => {
    try {
      const isEdit = !!editingProduct;
      const path = isEdit ? `/admin/products/${editingProduct.id}` : '/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      await _request({
        path,
        method,
        body: {
          name: values.name,
          description: values.description,
          price: values.price,
          stockQuantity: values.stockQuantity,
          imageUrl: values.imageUrl,
          categoryId: values.categoryId,
          isActive: values.isActive,
          isPet: values.isPet,
          barcode: values.barcode,
          barcodeType: values.barcodeType || "",
          sku: values.sku,
        },
        onSuccess() {
          message.success(isEdit ? 'Cập nhật sản phẩm thành công' : 'Thêm sản phẩm thành công');
          setIsModalVisible(false);
          form.resetFields();
          setEditingProduct(null);
          loadProducts();
        },
        onError(error) {
          message.error(isEdit ? 'Không thể cập nhật sản phẩm' : 'Không thể thêm sản phẩm');
          console.error(error);
        },
      });
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) return;

    Modal.confirm({
      title: 'Xác nhận xóa vĩnh viễn',
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa vĩnh viễn {selectedRowKeys.length} sản phẩm đã chọn?</p>
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
          // Delete products one by one using hard delete endpoint
          for (const key of selectedRowKeys) {
            await _request({
              path: `/admin/products/${key}/hard`,
              method: "DELETE",
              onSuccess() {},
              onError(error) {
                console.error(`Failed to delete product ${key}:`, error);
              },
            });
          }
          message.success('Xóa vĩnh viễn các sản phẩm thành công');
          setSelectedRowKeys([]);
          loadProducts();
        } catch (error) {
          message.error('Có lỗi xảy ra khi xóa sản phẩm');
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { color: 'red', text: 'Hết hàng' };
    if (quantity < 5) return { color: 'orange', text: 'Sắp hết' };
    return { color: 'green', text: 'Còn hàng' };
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'Thông tin sản phẩm',
      dataIndex: 'product',
      width: showCompact ? '40%' : '35%',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar 
            size={showCompact ? 32 : 40} 
            src={record.imageUrl}
            style={{ 
              backgroundColor: '#f0f8ff',
              fontSize: showCompact ? '14px' : '18px'
            }}
          >
            <ShoppingOutlined />
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
            <div style={{ 
              fontSize: showCompact ? '10px' : '11px', 
              color: '#999',
              marginTop: 2
            }}>
              {record.categoryName} • SKU: {record.sku || 'N/A'}
            </div>
          </div>
        </div>
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
          color: '#d4380d',
          fontSize: showCompact ? '12px' : '13px'
        }}>
          {formatPrice(price)}
        </span>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stockQuantity',
      width: '10%',
      sorter: true,
      render: (quantity: number) => {
        const status = getStockStatus(quantity);
        return (
          <div>
            {/* <div style={{ fontSize: showCompact ? '12px' : '13px', fontWeight: 500 }}>
              Số lượng: {quantity}
            </div> */}
            <Tag 
              color={status.color}
              style={{ marginTop: 0, fontSize: showCompact ? '10px' : '11px' }}
            >
              {status.text}
            </Tag>
          </div>
        );
      },
    },
    // {
    //   title: 'Loại',
    //   dataIndex: 'isPet',
    //   width: '8%',
    //   render: (isPet: boolean) => (
    //     <Tag 
    //       color={isPet ? 'blue' : 'green'}
    //       style={{ margin: 0, fontSize: showCompact ? '11px' : '12px' }}
    //     >
    //       {isPet ? 'Thú cưng' : 'Sản phẩm'}
    //     </Tag>
    //   ),
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      width: '10%',
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
      width: '12%',
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
      width: '13%',
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
              Quản lý sản phẩm cửa hàng thú cưng
            </h2>
            <p style={{ 
              margin: '4px 0 0 0', 
              color: '#666',
              fontSize: '14px'
            }}>
              Quản lý và theo dõi các sản phẩm của cửa hàng
            </p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingProduct(null);
              form.resetFields();
              form.setFieldsValue({
                isPet: false,
                isActive: true,
                barcodeType: 'EAN13',
                stockQuantity: 0,
                price: 0
              });
              setIsModalVisible(true);
            }}
            style={{ 
              height: '40px',
              borderRadius: '6px'
            }}
          >
            Thêm sản phẩm mới
          </Button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Space size="middle" wrap>
            <Search
              placeholder="Tìm kiếm theo tên, mô tả, SKU, mã vạch..."
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
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                width: 150,
                height: 32,
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                padding: '0 11px',
                fontSize: '14px'
              }}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
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
              {totalItems > 0 ? `${startItem}-${endItem} của ${totalItems} sản phẩm` : '0 của 0 sản phẩm'}
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
            Đã chọn: {selectedRowKeys.length} sản phẩm
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      <Modal
        title={editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingProduct(null);
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isActive: true,
            isPet: false,
            stockQuantity: 0,
            price: 0,
            barcodeType: 'EAN13'
          }}
        >
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm' }]}
          >
            <TextArea rows={3} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="price"
              label="Giá tiền (VND)"
              rules={[
                { required: true, message: 'Vui lòng nhập giá tiền' },
                { type: 'number', min: 0, message: 'Giá tiền phải lớn hơn 0' }
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập giá tiền"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              name="stockQuantity"
              label="Số lượng tồn kho"
              rules={[
                { required: true, message: 'Vui lòng nhập số lượng' },
                { type: 'number', min: 0, message: 'Số lượng phải lớn hơn hoặc bằng 0' }
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập số lượng"
                min={0}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="categoryId"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="sku"
              label="SKU"
              style={{ flex: 1 }}
            >
              <Input placeholder="Nhập mã SKU" />
            </Form.Item>

            <Form.Item
              name="barcode"
              label="Mã vạch"
              style={{ flex: 1 }}
            >
              <Input placeholder="Nhập mã vạch" />
            </Form.Item>

            <Form.Item
              name="barcodeType"
              label="Loại mã vạch"
              style={{ flex: 1 }}
            >
              <Select>
                <Option value="EAN13">EAN13</Option>
                <Option value="UPC">UPC</Option>
                <Option value="CODE128">CODE128</Option>
                <Option value="QR">QR Code</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="imageUrl"
            label="URL hình ảnh"
          >
            <Input placeholder="Nhập URL hình ảnh sản phẩm" />
          </Form.Item>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {/* <Form.Item
              name="isPet"
              valuePropName="checked"
              style={{ margin: 0 }}
            >
              <Checkbox>Là thú cưng</Checkbox>
            </Form.Item> */}

            <Form.Item
              name="isActive"
              valuePropName="checked"
              style={{ margin: 0 }}
            >
              <Checkbox>Hoạt động</Checkbox>
            </Form.Item>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '12px',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #f0f0f0'
          }}>
            <Button onClick={() => {
              setIsModalVisible(false);
              form.resetFields();
              setEditingProduct(null);
            }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {editingProduct ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal
  title={`Chi tiết sản phẩm: ${selectedProduct?.name}`}
  open={isViewModalVisible}
  onCancel={() => setIsViewModalVisible(false)}
  footer={[
    <Button key="close" onClick={() => setIsViewModalVisible(false)}>
      Đóng
    </Button>,
    <Button
      key="edit"
      type="primary"
      onClick={() => {
        setIsViewModalVisible(false);
        handleEdit(selectedProduct!);
      }}
    >
      Chỉnh sửa
    </Button>,
  ]}
  width={800}
>
  {selectedProduct && (
    <div>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          {selectedProduct.imageUrl && (
            <Image
              width={200}
              height={200}
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          )}
        </div>
        <div style={{ flex: 2 }}>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Tên sản phẩm">
              {selectedProduct.name}
            </Descriptions.Item>
            <Descriptions.Item label="Danh mục">
              <Tag color="blue">{selectedProduct.categoryName}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="SKU">
              {selectedProduct.sku || 'Chưa có'}
            </Descriptions.Item>
            <Descriptions.Item label="Mã vạch">
              {selectedProduct.barcode || 'Chưa có'}
            </Descriptions.Item>
            <Descriptions.Item label="Loại mã vạch">
              {selectedProduct.barcodeType || 'Chưa có'}
            </Descriptions.Item>
            <Descriptions.Item label="Giá">
              {formatPrice(selectedProduct.price)}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>

      <Descriptions
        title="Thông tin kho & trạng thái"
        column={2}
        size="small"
      >
        <Descriptions.Item label="Số lượng tồn kho">
          {selectedProduct.stockQuantity}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái kho">
          <Tag color={selectedProduct.stockQuantity > 0 ? "green" : "red"}>
            {selectedProduct.stockQuantity > 0 ? "Còn hàng" : "Hết hàng"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái hoạt động">
          <Tag color={selectedProduct.isActive ? "green" : "red"}>
            {selectedProduct.isActive ? "Hoạt động" : "Tạm dừng"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Loại sản phẩm">
          <Tag color={selectedProduct.isPet ? "blue" : "green"}>
            {selectedProduct.isPet ? "Thú cưng" : "Sản phẩm"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {formatDate(selectedProduct.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Cập nhật lần cuối">
          {formatDate(selectedProduct.updatedAt)}
        </Descriptions.Item>
      </Descriptions>

      {selectedProduct?.description && (
        <div style={{ marginTop: "20px" }}>
          <h4>Mô tả:</h4>
          <p
            style={{
              background: "#f5f5f5",
              padding: "12px",
              borderRadius: "6px",
            }}
          >
            {selectedProduct?.description}
          </p>
        </div>
      )}
    </div>
  )}
</Modal>
    </div>
  );
};

export default ProductPage;