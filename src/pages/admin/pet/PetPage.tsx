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
  InputNumber,
  message,
  Descriptions,
  Image,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import "./PetPage.scss";
import { _request } from "../../../network/Api";
import { ProductType } from "../../../network/Type";
import { formatDate } from "../../../utils";

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const PetPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend">("ascend");
  const [allPetsData, setAllPetsData] = useState<ProductType[]>([]);

  // Modal states
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState<ProductType | null>(null);
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = () => {
    setLoading(true);
    _request({
      path: "/admin/products/pets",
      method: "GET",
      onSuccess(response) {
        console.log(response);
        if (response.success && response.data) {
          setAllPetsData(response.data);
        }
        setLoading(false);
      },
      onError(error) {
        console.log(error);
        message.error("Failed to fetch pets data");
        setLoading(false);
      },
    });
  };

  const handleEdit = (record: ProductType) => {
    setSelectedPet(record);
    editForm.setFieldsValue({
      name: record.name,
      breed: record.breed,
      color: record.color,
      ageMonths: record.ageMonths,
      gender: record.gender,
      price: record.price,
      stockQuantity: record.stockQuantity,
      weight: record.weight,
      healthStatus: record.healthStatus,
      vaccinationStatus: record.vaccinationStatus,
      description: record.description,
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = (record: ProductType) => {
    setLoading(true);
    _request({
      path: `/admin/products/${record.id}`,
      method: "DELETE",
      onSuccess(response) {
        if (response.success) {
          message.success("Pet deleted successfully");
          fetchPets(); // Refresh data
        }
        setLoading(false);
      },
      onError(error) {
        console.log(error);
        message.error("Failed to delete pet");
        setLoading(false);
      },
    });
  };

  const handleView = (record: ProductType) => {
    setSelectedPet(record);
    setIsViewModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      setLoading(true);

      _request({
        path: `/admin/products/${selectedPet?.id}`,
        method: "PUT",
        body: values,
        onSuccess(response) {
          if (response.success) {
            message.success("Pet updated successfully");
            setIsEditModalVisible(false);
            fetchPets(); // Refresh data
          }
          setLoading(false);
        },
        onError(error) {
          console.log(error, "Failed to update pet", values);
          message.error("Failed to update pet", values);
          setLoading(false);
        },
      });
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select pets to delete");
      return;
    }

    Modal.confirm({
      title: "Confirm Bulk Delete",
      content: `Are you sure you want to delete ${selectedRowKeys.length} selected pets?`,
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
                  path: `/admin/products/${id}`,
                  method: "DELETE",
                  onSuccess: resolve,
                  onError: reject,
                });
              })
          )
        )
          .then(() => {
            message.success(
              `Successfully deleted ${selectedRowKeys.length} pets`
            );
            setSelectedRowKeys([]);
            fetchPets();
            setLoading(false);
          })
          .catch(() => {
            message.error("Some pets could not be deleted");
            setLoading(false);
          });
      },
    });
  };

  const filteredData = useMemo(() => {
    let filtered = allPetsData;

    if (searchText) {
      filtered = filtered.filter(
        (pet) =>
          pet.name.toLowerCase().includes(searchText.toLowerCase()) ||
          pet.categoryName.toLowerCase().includes(searchText.toLowerCase()) ||
          pet.breed.toLowerCase().includes(searchText.toLowerCase()) ||
          pet.color.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any, bValue: any;

        if (sortField === "date") {
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
        } else if (sortField === "price") {
          aValue = a.price;
          bValue = b.price;
        } else {
          aValue = a[sortField as keyof ProductType];
          bValue = b[sortField as keyof ProductType];
        }

        if (sortOrder === "ascend") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [allPetsData, searchText, sortField, sortOrder]);

  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const getActionItems = (record: ProductType): MenuProps["items"] => [
    {
      key: "view",
      label: "Xem chi tiết",
      icon: <EyeOutlined />,
      onClick: () => handleView(record),
    },
    {
      key: "edit",
      label: "Chỉnh sửa",
      icon: <EditOutlined />,
      onClick: () => handleEdit(record),
    },
    {
      key: "delete",
      label: "Xóa",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: "Confirm Delete",
          content: `Chắc chắn muốn xóa "${record.name}"?`,
          okText: "Đồng ý",
          okType: "danger",
          cancelText: "Hủy",
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

  const columns: ColumnsType<ProductType> = [
    {
      title: "Thông tin thú cưng",
      dataIndex: "pet",
      render: (_, record) => (
        <div className="product-info">
          <Avatar
            size={40}
            className={`product-avatar product-avatar-${record.categoryName.toLowerCase()}`}
            src={record.imageUrl}
          >
            {!record.imageUrl && record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div className="product-details">
            <div className="product-name">{record.name}</div>
            <div className="product-category">
              {record.breed} • {record.ageMonths} Tháng • {record.color} •{" "}
              {record.gender === "male" ? "Đực" : "Cái"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      sorter: true,
      render: (categoryName: string) => <Tag color="blue">{categoryName}</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: true,
      render: (date: string) => `${formatDate(date)}`,
    },
    {
      title: "Số lượng",
      dataIndex: "stockQuantity",
      render: (quantity: number, record) => (
        <div>
          <Tag color={quantity > 0 ? "green" : "red"} className="status-tag">
            {quantity > 0 ? "Available" : "Sold Out"}
          </Tag>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
            Stock: {record.stockQuantity}
          </div>
        </div>
      ),
    },
    // {
    //   title: "Trạng thái hoạt động",
    //   dataIndex: "isActive",
    //   render: (isActive: boolean, record) => (
    //     <div>
    //       <Tag color={isActive ? "green" : "red"} className="status-tag">
    //         {isActive ? "Hiện" : "Ẩn"}
    //       </Tag>
    //     </div>
    //   ),
    // },
    {
      title: "Giá",
      dataIndex: "price",
      render: (price: number) => `${price.toLocaleString("vi-VN")} VND`,
      sorter: true,
    },
    {
      title: "Thông tin và sức khỏe",
      dataIndex: "health",
      render: (_, record) => (
        <div style={{ fontSize: "12px" }}>
          <div>Sức khỏe: {record.healthStatus}</div>
          <div>Vaccine: {record.vaccinationStatus}</div>
          <div>Cân nặng: {record.weight}kg</div>
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
    <div className="product-management">
      <div className="header">
        <div className="search-section">
          <Search
            placeholder="Search pets by name, category, breed, or color"
            prefix={<SearchOutlined />}
            style={{ width: 400 }}
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
          <Button icon={<FilterOutlined />} className="filter-button">
            Filter
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

      {/* Edit Modal */}
      <Modal
        title={`Edit Pet: ${selectedPet?.name}`}
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        width={800}
        okText="Save Changes"
        confirmLoading={loading}
      >
        <Form form={editForm} layout="vertical">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              label="Pet Name"
              name="name"
              rules={[{ required: true, message: "Please input pet name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Breed"
              name="breed"
              rules={[{ required: true, message: "Please input breed!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Color"
              name="color"
              rules={[{ required: true, message: "Please input color!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Age (Months)"
              name="ageMonths"
              rules={[{ required: true, message: "Please input age!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please select gender!" }]}
            >
              <Select>
                <Option value="male">Male (Đực)</Option>
                <Option value="female">Female (Cái)</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Price (VND)"
              name="price"
              rules={[{ required: true, message: "Please input price!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Stock Quantity"
              name="stockQuantity"
              rules={[
                { required: true, message: "Please input stock quantity!" },
              ]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Weight (kg)"
              name="weight"
              rules={[{ required: true, message: "Please input weight!" }]}
            >
              <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item label="Health Status" name="healthStatus">
              <Select>
                <Option value="Excellent">Excellent</Option>
                <Option value="Good">Good</Option>
                <Option value="Fair">Fair</Option>
                <Option value="Poor">Poor</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Vaccination Status" name="vaccinationStatus">
              <Select>
                <Option value="Fully Vaccinated">Fully Vaccinated</Option>
                <Option value="Partially Vaccinated">
                  Partially Vaccinated
                </Option>
                <Option value="Not Vaccinated">Not Vaccinated</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Description" name="description">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Details Modal */}
      <Modal
  title={`Chi tiết thú cưng: ${selectedPet?.name}`}
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
        handleEdit(selectedPet!);
      }}
    >
      Chỉnh sửa
    </Button>,
  ]}
  width={800}
>
  {selectedPet && (
    <div>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          {selectedPet.imageUrl && (
            <Image
              width={200}
              height={200}
              src={selectedPet.imageUrl}
              alt={selectedPet.name}
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          )}
        </div>
        <div style={{ flex: 2 }}>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Tên">
              {selectedPet.name}
            </Descriptions.Item>
            <Descriptions.Item label="Danh mục">
              <Tag color="blue">{selectedPet.categoryName}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Giống loài">
              {selectedPet.breed}
            </Descriptions.Item>
            <Descriptions.Item label="Màu sắc">
              {selectedPet.color}
            </Descriptions.Item>
            <Descriptions.Item label="Tuổi">
              {selectedPet.ageMonths} tháng
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {selectedPet.gender === "male"
                ? "Đực"
                : "Cái"}
            </Descriptions.Item>
            <Descriptions.Item label="Giá">
              {selectedPet.price.toLocaleString("vi-VN")} VND
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>

      <Descriptions
        title="Thông tin sức khỏe & thể chất"
        column={2}
        size="small"
      >
        <Descriptions.Item label="Cân nặng">
          {selectedPet.weight} kg
        </Descriptions.Item>
        <Descriptions.Item label="Tình trạng sức khỏe">
          {selectedPet.healthStatus}
        </Descriptions.Item>
        <Descriptions.Item label="Tình trạng tiêm chủng">
          {selectedPet.vaccinationStatus}
        </Descriptions.Item>
        <Descriptions.Item label="Số lượng trong kho">
          {selectedPet.stockQuantity}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày thêm vào">
          {formatDate(selectedPet.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={selectedPet.stockQuantity > 0 ? "green" : "red"}>
            {selectedPet.stockQuantity > 0 ? "Còn hàng" : "Hết hàng"}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      {selectedPet.description && (
        <div style={{ marginTop: "20px" }}>
          <h4>Mô tả:</h4>
          <p
            style={{
              background: "#f5f5f5",
              padding: "12px",
              borderRadius: "6px",
            }}
          >
            {selectedPet.description}
          </p>
        </div>
      )}
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
          Selected: {selectedRowKeys.length} pets
        </div>
      )}
    </div>
  );
};

export default PetPage;
