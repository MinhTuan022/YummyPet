import React, { useState, useMemo, useEffect } from "react";
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
  Form,
  message,
  Descriptions,
  Switch,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import "./CategoryPage.scss";
import { _request } from "../../../network/Api";
import { formatDate } from "../../../utils";

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

interface CategoryType {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  productCount: number | null;
}

const CategoryPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend">("ascend");
  const [allCategoriesData, setAllCategoriesData] = useState<CategoryType[]>([]);

  // Modal states
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    _request({
      path: "/categories",
      method: "GET",
      onSuccess(response) {
        console.log(response);
        if (response.success && response.data) {
          setAllCategoriesData(response.data);
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

  const handleEdit = (record: CategoryType) => {
    setSelectedCategory(record);
    editForm.setFieldsValue({
      name: record.name,
      description: record.description,
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
          fetchCategories(); // Refresh data
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
  };

  const handleCreate = () => {
    createForm.resetFields();
    setIsCreateModalVisible(true);
  };

  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      setLoading(true);

      _request({
        path: "/categories",
        method: "POST",
        body: values,
        onSuccess(response) {
          if (response.success) {
            message.success("Category created successfully");
            setIsCreateModalVisible(false);
            fetchCategories(); // Refresh data
          }
          setLoading(false);
        },
        onError(error) {
          console.log(error, "Failed to create category", values);
          message.error("Failed to create category");
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
      setLoading(true);

      _request({
        path: `/categories/${selectedCategory?.id}`,
        method: "PUT",
        body: values,
        onSuccess(response) {
          if (response.success) {
            message.success("Category updated successfully");
            setIsEditModalVisible(false);
            fetchCategories(); // Refresh data
          }
          setLoading(false);
        },
        onError(error) {
          console.log(error, "Failed to update category", values);
          message.error("Failed to update category");
          setLoading(false);
        },
      });
    } catch (error) {
      console.log("Validation failed:", error);
    }
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
    let filtered = allCategoriesData;

    if (searchText) {
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchText.toLowerCase()) ||
          category.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any, bValue: any;

        if (sortField === "date") {
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
        } else {
          aValue = a[sortField as keyof CategoryType];
          bValue = b[sortField as keyof CategoryType];
        }

        if (sortOrder === "ascend") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [allCategoriesData, searchText, sortField, sortOrder]);

  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

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

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);
    }
  };

  const columns: ColumnsType<CategoryType> = [
    {
      title: "Thông tin danh mục",
      dataIndex: "category",
      render: (_, record) => (
        <div className="category-info">
          <Avatar
            size={40}
            className="category-avatar"
            icon={<FolderOutlined />}
          >
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div className="category-details">
            <div className="category-name">{record.name}</div>
            <div className="category-description">
              {record.description || "No description"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: true,
      render: (date: string) => `${formatDate(date)}`,
    },
    {
      title: "Số lượng sản phẩm",
      dataIndex: "productCount",
      render: (count: number | null) => (
        <div>
          <Tag color="blue" className="count-tag">
            {count !== null ? `${count} products` : "0 products"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: "isActive",
      render: (isActive: boolean) => (
        <div>
          <Tag color={isActive ? "green" : "red"} className="status-tag">
            {isActive ? "Hoạt động" : "Tạm dừng"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "action",
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
    <div className="category-management">
      <div className="header">
        <div className="search-section">
          <Search
            placeholder="Search categories by name or description"
            prefix={<SearchOutlined />}
            style={{ width: 400 }}
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
          {/* <Button icon={<FilterOutlined />} className="filter-button">
            Filter
          </Button> */}
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreate}
            className="create-button"
          >
            Add Category
          </Button>
          {selectedRowKeys.length > 0 && (
            <Button danger icon={<DeleteOutlined />} onClick={handleBulkDelete}>
              Delete Selected ({selectedRowKeys.length})
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
        />

        <div className="pagination-container">
          <div className="pagination-info">
            {totalItems > 0
              ? `${startItem}-${endItem} of ${totalItems}`
              : "0 of 0"}
          </div>
          <div className="pagination-controls">
            <span style={{ marginRight: 8, color: "#8c8c8c" }}>
              Rows per page:
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
              disabled={currentPage === 1}
              onClick={goToPreviousPage}
            >
              ‹
            </Button>
            <span style={{ margin: "0 8px", color: "#8c8c8c" }}>
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
          <Checkbox>Dense padding</Checkbox>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        title="Create New Category"
        open={isCreateModalVisible}
        onOk={handleCreateSubmit}
        onCancel={() => setIsCreateModalVisible(false)}
        width={600}
        okText="Create Category"
        confirmLoading={loading}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please input category name!" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <TextArea rows={4} placeholder="Enter category description" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={`Edit Category: ${selectedCategory?.name}`}
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        width={600}
        okText="Save Changes"
        confirmLoading={loading}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please input category name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Status"
            name="isActive"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        title={`Category Details: ${selectedCategory?.name}`}
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setIsViewModalVisible(false);
              handleEdit(selectedCategory!);
            }}
          >
            Edit Category
          </Button>,
        ]}
        width={700}
      >
        {selectedCategory && (
          <div>
            <Descriptions column={1} size="middle">
              <Descriptions.Item label="Category Name">
                {selectedCategory.name}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                <div style={{
                  background: "#f5f5f5",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  marginTop: "4px"
                }}>
                  {selectedCategory.description}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedCategory.isActive ? "green" : "red"}>
                  {selectedCategory.isActive ? "Hoạt động" : "Tạm dừng"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Product Count">
                <Tag color="blue">
                  {selectedCategory.productCount !== null 
                    ? `${selectedCategory.productCount} products` 
                    : "0 products"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Date Created">
                {formatDate(selectedCategory.createdAt)}
              </Descriptions.Item>
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
          Selected: {selectedRowKeys.length} categories
        </div>
      )}
    </div>
  );
};

export default CategoryPage;