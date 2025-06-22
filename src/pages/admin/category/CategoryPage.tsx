import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Tag,
  Dropdown,
  Avatar,
  Checkbox,
  Select,
  MenuProps,
  Modal,
  Form,
  message,
  Descriptions,
  Switch,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  NodeIndexOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import "./CategoryPage.scss";
import { _request } from "../../../network/Api";
import { formatDate } from "../../../utils";
import { CategoryType } from "../../../network/Type";

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const CategoryPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState<string>("createdAt");  const [sortOrder, setSortOrder] = useState<"ascend" | "descend">("descend");
  
  // Data states
  const [categoriesData, setCategoriesData] = useState<CategoryType[]>([]);
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal states
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedCategoryType, setSelectedCategoryType] = useState<string>("product");

  useEffect(() => {
    fetchCategories();
    fetchAllCategories();
  }, [currentPage, pageSize, sortField, sortOrder]);

  const fetchCategories = () => {
    setLoading(true);
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', currentPage.toString());
    queryParams.append('size', pageSize.toString());
    
    if (sortField) {
      const sortParam = `${sortField},${sortOrder === 'ascend' ? 'asc' : 'desc'}`;
      queryParams.append('sort', sortParam);
    }
    
    const pathWithParams = `/categories?${queryParams.toString()}`;
    
    _request({
      path: pathWithParams,
      method: "GET",
      onSuccess(response) {
        console.log(response);
        if (response.success && response.data) {
          setCategoriesData(response.data.content || []);
          setTotalElements(response.data.totalElements || 0);
          setTotalPages(response.data.totalPages || 0);
        }
        setLoading(false);
      },
      onError(error) {
        console.log(error);
        message.error("Failed to fetch categories data");
        setLoading(false);
      },
    });
  };

  const fetchAllCategories = () => {
    _request({
      path: "/categories/all",
      method: "GET",
      onSuccess(response) {
        if (response.success && response.data) {
          setAllCategories(response.data);
        }
      },
      onError(error) {
        console.log(error);
      },
    });
  };  const handleEdit = (record: CategoryType) => {
    setSelectedCategory(record);
    editForm.setFieldsValue({
      name: record.name,
      description: record.description,
      parentId: record.parentId,
      categoryType: record.categoryType,
      isActive: record.isActive,
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = (record: CategoryType) => {
    setLoading(true);
    _request({
      path: `/categories/${record.id}`,
      method: "DELETE",
      onSuccess(response) {
        if (response.success) {
          message.success("Category deleted successfully");
          fetchCategories();
        }
        setLoading(false);
      },
      onError(error) {
        console.log(error);
        message.error("Failed to delete category");
        setLoading(false);
      },
    });
  };

  const handleView = (record: CategoryType) => {
    setSelectedCategory(record);
    setIsViewModalVisible(true);
  };  const handleCreate = () => {
    createForm.resetFields();
    setIsCreateModalVisible(true);
  };  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      
      // Validate parent-child category type consistency
      if (values.parentId) {
        const parentCategory = allCategories.find(cat => cat.id === values.parentId);
        if (parentCategory && parentCategory.categoryType !== values.categoryType) {
          message.error("Loại danh mục con phải trùng với loại danh mục cha!");
          return;
        }
      }
      
      setLoading(true);

      _request({
        path: "/categories",
        method: "POST",
        body: {
          ...values,
          categoryType: values.categoryType || "product",
        },
        onSuccess(response) {
          if (response.success) {
            message.success("Tạo danh mục thành công!");
            setIsCreateModalVisible(false);
            fetchCategories();
            fetchAllCategories();
            createForm.resetFields();
          }
          setLoading(false);
        },
        onError(error) {
          console.log(error, "Failed to create category", values);
          message.error(error?.message || "Không thể tạo danh mục");
          setLoading(false);
        },
      });
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      
      // Validate parent-child category type consistency
      if (values.parentId) {
        const parentCategory = allCategories.find(cat => cat.id === values.parentId);
        if (parentCategory && parentCategory.categoryType !== values.categoryType) {
          message.error("Loại danh mục con phải trùng với loại danh mục cha!");
          return;
        }
      }
      
      setLoading(true);

      _request({
        path: `/categories/${selectedCategory?.id}`,
        method: "PUT",
        body: values,
        onSuccess(response) {
          if (response.success) {
            message.success("Cập nhật danh mục thành công!");
            setIsEditModalVisible(false);
            fetchCategories();
            fetchAllCategories();
          }
          setLoading(false);
        },
        onError(error) {
          console.log(error, "Failed to update category", values);
          message.error(error?.message || "Không thể cập nhật danh mục");
          setLoading(false);
        },
      });
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handleToggleStatus = (record: CategoryType) => {
    setLoading(true);
    _request({
      path: `/categories/${record.id}/toggle-status`,
      method: "PUT",
      onSuccess(response) {
        if (response.success) {
          message.success(response.message);
          fetchCategories();
        }
        setLoading(false);
      },
      onError(error) {
        console.log(error);
        message.error("Failed to toggle category status");
        setLoading(false);
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select categories to delete");
      return;
    }

    Modal.confirm({
      title: "Confirm Bulk Delete",
      content: `Are you sure you want to delete ${selectedRowKeys.length} selected categories?`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        setLoading(true);
        Promise.all(
          selectedRowKeys.map(
            (id) =>
              new Promise((resolve, reject) => {
                _request({
                  path: `/categories/${id}`,
                  method: "DELETE",
                  onSuccess: resolve,
                  onError: reject,
                });
              })
          )
        )
          .then(() => {
            message.success(
              `Successfully deleted ${selectedRowKeys.length} categories`
            );
            setSelectedRowKeys([]);
            fetchCategories();
            setLoading(false);
          })
          .catch(() => {
            message.error("Some categories could not be deleted");
            setLoading(false);
          });
      },
    });
  };

  const filteredData = useMemo(() => {
    return categoriesData;
  }, [categoriesData]);

  const currentPageData = filteredData;
  const totalItems = totalElements;

  const getActionItems = (record: CategoryType): MenuProps["items"] => [
    {
      key: "view",
      label: "View Details",
      icon: <EyeOutlined />,
      onClick: () => handleView(record),
    },
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
      onClick: () => handleEdit(record),
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: "Confirm Delete",
          content: `Are you sure you want to delete "${record.name}"?`,
          okText: "Yes, Delete",
          okType: "danger",
          cancelText: "Cancel",
          onOk: () => handleDelete(record),
        });
      },
    },
  ];
  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);
    }
  };
  // Render category hierarchy indicator
  const renderCategoryHierarchy = (record: CategoryType) => {
    const isChild = record.parentId && record.parentName;
    
    return (
      <div className="category-info">
        {/* Hierarchy indicator at the top */}
        <div className="category-hierarchy" style={{ marginBottom: 8 }}>
          {isChild ? (
            <div className="hierarchy-indicator" style={{ 
              background: '#e6f7ff', 
              padding: '4px 8px', 
              borderRadius: '4px',
              border: '1px solid #91d5ff'
            }}>
              <ApartmentOutlined style={{ color: '#1890ff', marginRight: 4 }} />
              <span style={{ color: '#1890ff', fontSize: '12px', fontWeight: 500 }}>
                {record.parentName}
              </span>
              <span style={{ color: '#666', margin: '0 4px' }}> → </span>
              <span style={{ color: '#1890ff', fontSize: '12px' }}>
                {record.name}
              </span>
            </div>
          ) : (
            <div className="root-indicator" style={{ 
              background: '#f6ffed', 
              padding: '4px 8px', 
              borderRadius: '4px',
              border: '1px solid #b7eb8f'
            }}>
              <FolderOpenOutlined style={{ color: '#52c41a', marginRight: 4 }} />
              <span style={{ color: '#52c41a', fontSize: '12px', fontWeight: 500 }}>
                Danh mục gốc
              </span>
            </div>
          )}
        </div>
        
        {/* Main category info */}
        <div className="category-main-info" style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            size={40}
            className={`category-avatar ${isChild ? 'child-category' : 'root-category'}`}
            style={{
              backgroundColor: isChild ? '#e6f7ff' : '#f6ffed',
              color: isChild ? '#1890ff' : '#52c41a',
              marginRight: 12
            }}
            icon={isChild ? <NodeIndexOutlined /> : <FolderOutlined />}
          >
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          
          <div className="category-details" style={{ flex: 1 }}>
            <div className="category-name-section" style={{ marginBottom: 4 }}>
              <span className={`category-name ${isChild ? 'child-name' : 'root-name'}`} style={{
                fontWeight: 600,
                fontSize: '14px',
                color: isChild ? '#1890ff' : '#52c41a'
              }}>
                {record.name}
              </span>
              {isChild && (
                <Tag 
                  color="blue" 
                  style={{ marginLeft: 8, fontSize: '10px' }}
                  icon={<NodeIndexOutlined />}
                >
                  Danh mục con
                </Tag>
              )}
            </div>
            
            <div className="category-description" style={{ 
              color: '#666', 
              fontSize: '12px',
              marginBottom: 4
            }}>
              {record.description || "Không có mô tả"}
            </div>
          </div>
        </div>
      </div>
    );
  };  const columns: ColumnsType<CategoryType> = [
    {
      title: "Cấu trúc danh mục",
      dataIndex: "category",
      width: "40%",
      render: (_, record) => renderCategoryHierarchy(record),
    },
    {
      title: "Loại danh mục",
      dataIndex: "categoryType",
      width: "15%",
      render: (type: string) => (
        <Tag 
          color={type === "product" ? "green" : "orange"}
          icon={type === "product" ? <FolderOutlined /> : "🐾"}
        >
          {type === "product" ? "Sản phẩm" : "Thú cưng"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: "15%",
      sorter: true,
      render: (date: string) => (
        <Tooltip title={`Created: ${formatDate(date)}`}>
          <span>{formatDate(date)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      width: "15%",
      render: (date: string) => (
        <span style={{ color: date ? '#000' : '#999' }}>
          {date ? formatDate(date) : "Chưa cập nhật"}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      width: "10%",
      render: (isActive: boolean, record) => (
        <Tooltip title="Click to toggle status">
          <Tag 
            color={isActive ? "success" : "error"} 
            className="status-tag"
            style={{ cursor: 'pointer' }}
            onClick={() => handleToggleStatus(record)}
          >
            {isActive ? "Hoạt động" : "Tạm dừng"}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      width: "5%",
      render: (_, record) => (
        <Dropdown menu={{ items: getActionItems(record) }} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(0);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
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

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

  return (
    <div className="category-management">
      <div className="header">
        <div className="search-section">
          <Search
            placeholder="Tìm kiếm danh mục theo tên hoặc mô tả"
            prefix={<SearchOutlined />}
            style={{ width: 400 }}
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreate}
            className="create-button"
          >
            Thêm danh mục
          </Button>
          
          {selectedRowKeys.length > 0 && (
            <Button danger icon={<DeleteOutlined />} onClick={handleBulkDelete}>
              Xóa đã chọn ({selectedRowKeys.length})
            </Button>
          )}
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
          loading={loading}
          rowKey="id"
          className="category-table"
        />

        <div className="pagination-container">
          <div className="pagination-info">
            {totalItems > 0
              ? `${startItem}-${endItem} của ${totalItems}`
              : "0 của 0"}
          </div>
          <div className="pagination-controls">
            <span style={{ marginRight: 8, color: "#8c8c8c" }}>
              Số dòng mỗi trang:
            </span>
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
              disabled={currentPage === 0}
              onClick={goToPreviousPage}
            >
              ‹
            </Button>
            <span style={{ margin: "0 8px", color: "#8c8c8c" }}>
              {currentPage + 1} của {totalPages}
            </span>
            <Button
              type="text"
              disabled={currentPage === totalPages - 1}
              onClick={goToNextPage}
            >
              ›
            </Button>
          </div>
        </div>

        <div className="dense-padding-section">
          <Checkbox>Giảm khoảng cách</Checkbox>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        title="Tạo danh mục mới"
        open={isCreateModalVisible}
        onOk={handleCreateSubmit}
        onCancel={() => setIsCreateModalVisible(false)}
        width={600}
        okText="Tạo danh mục"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả danh mục" />
          </Form.Item>          <Form.Item
            label="Loại danh mục"
            name="categoryType"
            initialValue="product"
            rules={[{ required: true, message: "Vui lòng chọn loại danh mục!" }]}
          >
            <Select 
              placeholder="Chọn loại danh mục"
              onChange={(value) => {
                setSelectedCategoryType(value);
                // Reset parentId when category type changes
                createForm.setFieldsValue({ parentId: undefined });
              }}
            >
              <Option value="product">Sản phẩm</Option>
              <Option value="pet">Thú cưng</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Danh mục cha"
            name="parentId"
            help="Để trống nếu đây là danh mục gốc"
          >
            <Select 
              placeholder="Chọn danh mục cha (tùy chọn)"
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {allCategories
                .filter(category => category.categoryType === selectedCategoryType)
                .map(category => (
                <Option key={category.id} value={category.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{category.name}</span>
                    <Tag 
                      color={category.categoryType === 'product' ? 'green' : 'orange'}
                      style={{ fontSize: '10px' }}
                    >
                      {category.categoryType === 'product' ? 'Sản phẩm' : 'Thú cưng'}
                    </Tag>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm dừng" />
          </Form.Item>
        </Form>
      </Modal>      {/* Edit Modal */}
      <Modal
        title={`Sửa danh mục: ${selectedCategory?.name}`}
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        width={600}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input />
          </Form.Item>          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Loại danh mục"
            name="categoryType"
            rules={[{ required: true, message: "Vui lòng chọn loại danh mục!" }]}
          >
            <Select placeholder="Chọn loại danh mục">
              <Option value="product">Sản phẩm</Option>
              <Option value="pet">Thú cưng</Option>
            </Select>
          </Form.Item>          <Form.Item
            label="Danh mục cha"
            name="parentId"
            help="Chọn danh mục cha hoặc để trống"
          >
            <Select 
              placeholder="Chọn danh mục cha (tùy chọn)"
              allowClear
              showSearch
            >
              {allCategories
                .filter(category => 
                  category.id !== selectedCategory?.id && // Không cho phép chọn chính nó làm parent
                  category.categoryType === editForm.getFieldValue('categoryType') // Chỉ hiển thị cùng loại
                )
                .map(category => (
                <Option key={category.id} value={category.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{category.name}</span>
                    <Tag 
                      color={category.categoryType === 'product' ? 'green' : 'orange'}
                      style={{ fontSize: '10px' }}
                    >
                      {category.categoryType === 'product' ? 'Sản phẩm' : 'Thú cưng'}
                    </Tag>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="isActive"
            valuePropName="checked"
          >
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm dừng" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        title={`Chi tiết danh mục: ${selectedCategory?.name}`}
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
              handleEdit(selectedCategory!);
            }}
          >
            Sửa danh mục
          </Button>,
        ]}
        width={700}
      >
        {selectedCategory && (
          <div>
            <Descriptions column={1} size="middle">
              <Descriptions.Item label="Tên danh mục">
                {selectedCategory.name}
              </Descriptions.Item>              <Descriptions.Item label="Cấu trúc phân cấp">
                {selectedCategory.parentId ? (
                  <div>
                    <Tag color="blue" icon={<ApartmentOutlined />}>
                      {selectedCategory.parentName} → {selectedCategory.name}
                    </Tag>
                    <div style={{ marginTop: 4, fontSize: '12px', color: '#666' }}>
                      Danh mục con của "{selectedCategory.parentName}"
                    </div>
                  </div>
                ) : (
                  <Tag color="green" icon={<FolderOpenOutlined />}>
                    Danh mục gốc
                  </Tag>
                )}
              </Descriptions.Item>
              
              <Descriptions.Item label="Loại danh mục">
                <Tag 
                  color={selectedCategory.categoryType === "product" ? "green" : "orange"}
                  icon={selectedCategory.categoryType === "product" ? <FolderOutlined /> : "🐾"}
                >
                  {selectedCategory.categoryType === "product" ? "Sản phẩm" : "Thú cưng"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Mô tả">
                <div style={{
                  background: "#f5f5f5",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  marginTop: "4px"
                }}>
                  {selectedCategory.description}
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                <Tag color={selectedCategory.isActive ? "success" : "error"}>
                  {selectedCategory.isActive ? "Hoạt động" : "Tạm dừng"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày tạo">
                {formatDate(selectedCategory.createdAt)}
              </Descriptions.Item>
              
              {selectedCategory.updatedAt && (
                <Descriptions.Item label="Ngày cập nhật">
                  {formatDate(selectedCategory.updatedAt)}
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>

      {selectedRowKeys.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "#f0f0f0",
            padding: "10px 20px",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          Đã chọn: {selectedRowKeys.length} danh mục
        </div>
      )}
    </div>
  );
};

export default CategoryPage;