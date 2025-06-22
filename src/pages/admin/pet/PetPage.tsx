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
  InputNumber,
  message,
  Descriptions,
  Image,
  DatePicker,
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
  ShoppingCartOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import "./PetPage.scss";
import { _request } from "../../../network/Api";
import { PetType, CategoryType } from "../../../network/Type";
import { formatDate } from "../../../utils";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const PetPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend">("descend");

  // Data states
  const [petsData, setPetsData] = useState<PetType[]>([]);
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal states
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState<PetType | null>(null);
  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPets();
  }, [currentPage, pageSize, sortField, sortOrder, allCategories]);

  const fetchCategories = () => {
    _request({
      path: "/categories/all",
      method: "GET",
      onSuccess(response) {
        if (response.success && response.data) {
          const petCategories = response.data.filter(
            (cat: CategoryType) => cat.categoryType === "pet"
          );
          setAllCategories(petCategories);
        }
      },
      onError(error) {
        console.log(error);
      },
    });
  };
  const fetchPets = () => {
    setLoading(true);

    const queryParams = new URLSearchParams();
    queryParams.append("page", currentPage.toString());
    queryParams.append("size", pageSize.toString());

    if (sortField) {
      const sortParam = `${sortField},${
        sortOrder === "ascend" ? "asc" : "desc"
      }`;
      queryParams.append("sort", sortParam);
    }

    const pathWithParams = `/pets?${queryParams.toString()}`;

    _request({
      path: pathWithParams,
      method: "GET",
      onSuccess(response) {
        if (response.success && response.data) {
          const pets = response.data.content || [];
          setPetsData(pets);
          setTotalElements(response.data.totalElements || 0);
          setTotalPages(response.data.totalPages || 0);
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
  const fetchAllCategories = () => {
    _request({
      path: "/categories/all",
      method: "GET",
      onSuccess(response) {
        if (response.success && response.data) {
          const petCategories = response.data.filter(
            (cat: CategoryType) => cat.categoryType === "pet"
          );
          setAllCategories(petCategories);
        }
      },
      onError(error) {
        console.log(error);
      },
    });
  };
  const getCategoryName = (pet: PetType): string => {
    if (pet.category && pet.category.name) {
      return pet.category.name;
    }

    return "Chưa phân loại";
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  const handleEdit = (record: PetType) => {
    console.log("Editing pet:", record);
    setSelectedPet(record);
    editForm.setFieldsValue({
      name: record.name,
      categoryId: record.category?.id,
      species: record.species,
      breed: record.breed,
      gender: record.gender,
      ageMonths: record.ageMonths,
      weight: record.weight,
      color: record.color,
      price: record.price,
      description: record.description,
      arrivalDate: record.arrivalDate ? dayjs(record.arrivalDate) : null,
      status: record.status,
      certificateInfo: record.certificateInfo,
      healthStatus: record.healthStatus,
      vaccinationStatus: record.vaccinationStatus,
      isActive: record.isActive,
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = (record: PetType) => {
    setLoading(true);
    _request({
      path: `/pets/${record.id}`,
      method: "DELETE",
      onSuccess(response) {
        if (response.success) {
          message.success("Pet deleted successfully");
          fetchPets();
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

  const handleView = (record: PetType) => {
    setSelectedPet(record);
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

      const submitData = {
        ...values,
        arrivalDate: values.arrivalDate
          ? values.arrivalDate.format("YYYY-MM-DD")
          : undefined,
      };

      _request({
        path: "/pets",
        method: "POST",
        body: submitData,
        onSuccess(response) {
          if (response.success) {
            message.success("Tạo thú cưng thành công!");
            setIsCreateModalVisible(false);
            fetchPets();
            fetchAllCategories();
            createForm.resetFields();
          }
          setLoading(false);
        },
        onError(error) {
          console.log(error, "Failed to create pet", values);
          message.error(error?.message || "Không thể tạo thú cưng");
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

      const submitData = {
        ...values,
        arrivalDate: values.arrivalDate
          ? values.arrivalDate.format("YYYY-MM-DD")
          : undefined,
      };

      _request({
        path: `/pets/${selectedPet?.id}`,
        method: "PUT",
        body: submitData,
        onSuccess(response) {
          if (response.success) {
            message.success("Cập nhật thú cưng thành công!");
            setIsEditModalVisible(false);
            fetchPets();
            fetchAllCategories();
          }
          setLoading(false);
        },
        onError(error) {
          console.log(error, "Failed to update pet", values);
          message.error(error?.message || "Không thể cập nhật thú cưng");
          setLoading(false);
        },
      });
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handleToggleStatus = (record: PetType) => {
    setLoading(true);
    _request({
      path: `/pets/${record.id}/toggle-status`,
      method: "PATCH",
      onSuccess(response) {
        if (response.success) {
          message.success(response.message || "Cập nhật trạng thái thành công");
          fetchPets();
        }
        setLoading(false);
      },
      onError(error) {
        console.log(error);
        message.error("Failed to toggle pet status");
        setLoading(false);
      },
    });
  };

  const handleMarkSold = (record: PetType) => {
    setLoading(true);
    _request({
      path: `/pets/${record.id}/mark-sold`,
      method: "PATCH",
      onSuccess(response) {
        if (response.success) {
          message.success("Đã đánh dấu thú cưng đã bán");
          fetchPets();
        }
        setLoading(false);
      },
      onError(error) {
        console.log(error);
        message.error("Failed to mark pet as sold");
        setLoading(false);
      },
    });
  };

  const handleMarkAvailable = (record: PetType) => {
    setLoading(true);
    _request({
      path: `/pets/${record.id}/mark-available`,
      method: "PATCH",
      onSuccess(response) {
        if (response.success) {
          message.success("Đã đánh dấu thú cưng còn hàng");
          fetchPets();
        }
        setLoading(false);
      },
      onError(error) {
        console.log(error);
        message.error("Failed to mark pet as available");
        setLoading(false);
      },
    });
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
                  path: `/pets/${id}`,
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
    return petsData;
  }, [petsData]);

  const currentPageData = filteredData;
  const totalItems = totalElements;

  const getActionItems = (record: PetType): MenuProps["items"] => [
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
      key: "toggle-status",
      label: record.isActive ? "Vô hiệu hóa" : "Kích hoạt",
      onClick: () => handleToggleStatus(record),
    },
    {
      key: "mark-sold",
      label: "Đánh dấu đã bán",
      icon: <ShoppingCartOutlined />,
      onClick: () => handleMarkSold(record),
      disabled: record.status === "sold",
    },
    {
      key: "mark-available",
      label: "Đánh dấu còn hàng",
      icon: <HeartOutlined />,
      onClick: () => handleMarkAvailable(record),
      disabled: record.status === "available",
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

  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);
    }
  };
  const columns: ColumnsType<PetType> = [
    {
      title: "Thông tin thú cưng",
      dataIndex: "pet",
      width: "35%",
      render: (_, record) => (
        <div className="product-info">
          <Image
            width={50}
            height={50}
            preview={false}
            className={`product-avatar`}
            src={`/img/${record.primaryImageUrl}`}
            style={{
              backgroundColor:
                record.status === "available" ? "#52c41a" : "#ff4d4f",
              marginRight: 12,
            }}
          >
            {!record.primaryImageUrl && record.name.charAt(0).toUpperCase()}
          </Image>
          <div className="product-details">
            <div
              className="product-name"
              style={{ fontWeight: 600, marginBottom: 4 }}
            >
              {record.name}
              <Tag
                color={record.status === "available" ? "green" : "red"}
                style={{ marginLeft: 8, fontSize: "10px" }}
              >
                {record.status === "available" ? "Còn hàng" : "Đã bán"}
              </Tag>
            </div>
            <div
              className="product-details-row"
              style={{ fontSize: "12px", color: "#666" }}
            >
              <span>Mã: {record.petCode}</span>
            </div>
            <div
              className="product-details-row"
              style={{ fontSize: "12px", color: "#666" }}
            >
              <span>
                {record.breed} • {record.ageMonths} tháng • {record.color}
              </span>
            </div>
            <div
              className="product-details-row"
              style={{ fontSize: "12px", color: "#666" }}
            >
              <span>
                {record.species} •{" "}
                {record.gender === "male"
                  ? "Đực"
                  : record.gender === "female"
                  ? "Cái"
                  : "Khác"}{" "}
                • {record.weight}kg
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      width: "15%",
      sorter: true,
      render: (_, record: PetType) => {
        const displayName = getCategoryName(record);

        return <Tag color="blue">{displayName}</Tag>;
      },
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      width: "15%",
      render: (price: number) => (
        <div>
          <div style={{ fontWeight: 600 }}>
            {price?.toLocaleString("vi-VN")} VND
          </div>
        </div>
      ),
      sorter: true,
    },
    {
      title: "Sức khỏe & Tiêm chủng",
      dataIndex: "health",
      width: "15%",
      render: (_, record) => (
        <div style={{ fontSize: "12px" }}>
          <div style={{ marginBottom: 4 }}>
            <Tag
              color={
                record.healthStatus === "excellent"
                  ? "green"
                  : record.healthStatus === "good"
                  ? "blue"
                  : record.healthStatus === "fair"
                  ? "orange"
                  : "red"
              }
            >
              {record.healthStatus === "excellent"
                ? "Xuất sắc"
                : record.healthStatus === "good"
                ? "Tốt"
                : record.healthStatus === "fair"
                ? "Khá"
                : "Kém"}
            </Tag>
          </div>
          <div>
            <Tag
              color={
                record.vaccinationStatus === "fully_vaccinated"
                  ? "green"
                  : record.vaccinationStatus === "partially_vaccinated"
                  ? "orange"
                  : "red"
              }
            >
              {record.vaccinationStatus === "fully_vaccinated"
                ? "Đầy đủ"
                : record.vaccinationStatus === "partially_vaccinated"
                ? "Một phần"
                : "Chưa tiêm"}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày nhập",
      dataIndex: "arrivalDate",
      width: "10%",
      sorter: true,
      render: (date: string) => (
        <Tooltip title={`Ngày nhập: ${formatDate(date)}`}>
          <span style={{ fontSize: "12px" }}>{formatDate(date)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      width: "5%",
      render: (isActive: boolean, record) => (
        <Tooltip title="Click to toggle status">
          <Tag
            color={isActive ? "success" : "error"}
            className="status-tag"
            style={{ cursor: "pointer" }}
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
    setCurrentPage(0);
    console.log("Search:", value);
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
    <div className="product-management">
      {" "}
      <div className="header">
        <div className="search-section">
          <Search
            placeholder="Tìm kiếm thú cưng theo tên, giống, màu sắc"
            prefix={<SearchOutlined />}
            style={{ width: 400 }}
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />

          {/* <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreate}
            className="create-button"
          >
            Thêm thú cưng
          </Button>
           */}
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
        />{" "}
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
        </div>{" "}
        <div className="dense-padding-section">
          <Checkbox>Giảm khoảng cách</Checkbox>
        </div>
      </div>
      <Modal
        title="Thêm thú cưng mới"
        open={isCreateModalVisible}
        onOk={handleCreateSubmit}
        onCancel={() => setIsCreateModalVisible(false)}
        width={800}
        okText="Tạo thú cưng"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={createForm} layout="vertical">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              label="Tên thú cưng"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên thú cưng!" },
              ]}
            >
              <Input placeholder="Nhập tên thú cưng" />
            </Form.Item>

            <Form.Item
              label="Danh mục"
              name="categoryId"
              rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
            >
              <Select placeholder="Chọn danh mục">
                {allCategories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Loài"
              name="species"
              rules={[{ required: true, message: "Vui lòng nhập loài!" }]}
            >
              <Input placeholder="VD: Canine, Feline" />
            </Form.Item>

            <Form.Item
              label="Giống"
              name="breed"
              rules={[{ required: true, message: "Vui lòng nhập giống!" }]}
            >
              <Input placeholder="VD: Golden Retriever, Persian" />
            </Form.Item>

            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Select placeholder="Chọn giới tính">
                <Option value="male">Đực</Option>
                <Option value="female">Cái</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Tuổi (tháng)"
              name="ageMonths"
              rules={[{ required: true, message: "Vui lòng nhập tuổi!" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Nhập tuổi tính bằng tháng"
              />
            </Form.Item>

            <Form.Item
              label="Cân nặng (kg)"
              name="weight"
              rules={[{ required: true, message: "Vui lòng nhập cân nặng!" }]}
            >
              <InputNumber
                min={0}
                step={0.1}
                style={{ width: "100%" }}
                placeholder="Nhập cân nặng"
              />
            </Form.Item>

            <Form.Item
              label="Màu sắc"
              name="color"
              rules={[{ required: true, message: "Vui lòng nhập màu sắc!" }]}
            >
              <Input placeholder="VD: Nâu đỏ, Trắng, Đen" />
            </Form.Item>

            <Form.Item
              label="Giá bán (VND)"
              name="price"
              rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Nhập giá bán"
              />
            </Form.Item>

            <Form.Item
              label="Ngày nhập"
              name="arrivalDate"
              rules={[{ required: true, message: "Vui lòng chọn ngày nhập!" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Chọn ngày nhập"
              />
            </Form.Item>

            <Form.Item
              label="Tình trạng sức khỏe"
              name="healthStatus"
              initialValue="good"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn tình trạng sức khỏe!",
                },
              ]}
            >
              <Select placeholder="Chọn tình trạng sức khỏe">
                <Option value="excellent">Xuất sắc</Option>
                <Option value="good">Tốt</Option>
                <Option value="fair">Khá</Option>
                <Option value="poor">Kém</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Tình trạng tiêm chủng"
              name="vaccinationStatus"
              initialValue="fully_vaccinated"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn tình trạng tiêm chủng!",
                },
              ]}
            >
              <Select placeholder="Chọn tình trạng tiêm chủng">
                <Option value="fully_vaccinated">Đầy đủ</Option>
                <Option value="partially_vaccinated">Một phần</Option>
                <Option value="not_vaccinated">Chưa tiêm</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="status"
              initialValue="available"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="available">Còn hàng</Option>
                <Option value="sold">Đã bán</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Hoạt động"
              name="isActive"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch
                checkedChildren="Hoạt động"
                unCheckedChildren="Tạm dừng"
              />
            </Form.Item>
          </div>

          <Form.Item label="Mô tả" name="description">
            <TextArea rows={3} placeholder="Nhập mô tả về thú cưng" />
          </Form.Item>

          <Form.Item label="Thông tin chứng chỉ" name="certificateInfo">
            <TextArea
              rows={2}
              placeholder="Nhập thông tin về giấy chứng nhận, tiêm phòng"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={`Sửa thú cưng: ${selectedPet?.name}`}
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        width={800}
        okText="Lưu thay đổi"
        cancelText="Hủy"
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
              label="Tên thú cưng"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên thú cưng!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Danh mục"
              name="categoryId"
              rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
            >
              <Select placeholder="Chọn danh mục">
                {allCategories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Loài"
              name="species"
              rules={[{ required: true, message: "Vui lòng nhập loài!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Giống"
              name="breed"
              rules={[{ required: true, message: "Vui lòng nhập giống!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Select>
                <Option value="male">Đực</Option>
                <Option value="female">Cái</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Tuổi (tháng)"
              name="ageMonths"
              rules={[{ required: true, message: "Vui lòng nhập tuổi!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Cân nặng (kg)"
              name="weight"
              rules={[{ required: true, message: "Vui lòng nhập cân nặng!" }]}
            >
              <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Màu sắc"
              name="color"
              rules={[{ required: true, message: "Vui lòng nhập màu sắc!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Giá bán (VND)"
              name="price"
              rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Ngày nhập"
              name="arrivalDate"
              rules={[{ required: true, message: "Vui lòng chọn ngày nhập!" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Tình trạng sức khỏe"
              name="healthStatus"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn tình trạng sức khỏe!",
                },
              ]}
            >
              <Select>
                <Option value="excellent">Xuất sắc</Option>
                <Option value="good">Tốt</Option>
                <Option value="fair">Khá</Option>
                <Option value="poor">Kém</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Tình trạng tiêm chủng"
              name="vaccinationStatus"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn tình trạng tiêm chủng!",
                },
              ]}
            >
              <Select>
                <Option value="fully_vaccinated">Đầy đủ</Option>
                <Option value="partially_vaccinated">Một phần</Option>
                <Option value="not_vaccinated">Chưa tiêm</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select>
                <Option value="available">Còn hàng</Option>
                <Option value="sold">Đã bán</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Hoạt động"
              name="isActive"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Hoạt động"
                unCheckedChildren="Tạm dừng"
              />
            </Form.Item>
          </div>

          <Form.Item label="Mô tả" name="description">
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Thông tin chứng chỉ" name="certificateInfo">
            <TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
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
        width={900}
      >
        {selectedPet && (
          <div>
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <div style={{ flex: 1 }}>
                {selectedPet.primaryImageUrl ? (
                  <Image
                    width={200}
                    height={200}
                    src={`/img/${selectedPet.primaryImageUrl}`}
                    alt={selectedPet.name}
                    style={{ borderRadius: "8px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 200,
                      height: 200,
                      background: "#f0f0f0",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "48px",
                      color: "#999",
                    }}
                  >
                    {selectedPet.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div style={{ flex: 2 }}>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Mã thú cưng">
                    <Tag color="blue">{selectedPet.petCode}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên">
                    {selectedPet.name}
                  </Descriptions.Item>{" "}
                  <Descriptions.Item label="Danh mục">
                    <Tag color="blue">{getCategoryName(selectedPet)}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Loài & Giống">
                    {selectedPet.species} - {selectedPet.breed}
                  </Descriptions.Item>
                  <Descriptions.Item label="Màu sắc">
                    {selectedPet.color}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tuổi & Giới tính">
                    {selectedPet.ageMonths} tháng •{" "}
                    {selectedPet.gender === "male"
                      ? "Đực"
                      : selectedPet.gender === "female"
                      ? "Cái"
                      : "Khác"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cân nặng">
                    {selectedPet.weight} kg
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>

            <Descriptions
              title="Thông tin giá & trạng thái"
              column={2}
              size="small"
              style={{ marginBottom: 20 }}
            >
              <Descriptions.Item label="Giá bán">
                <span style={{ fontWeight: 600, color: "#52c41a" }}>
                  {selectedPet.price?.toLocaleString("vi-VN")} VND
                </span>
              </Descriptions.Item>{" "}
              <Descriptions.Item label="Trạng thái bán">
                <Tag
                  color={selectedPet.status === "available" ? "green" : "red"}
                >
                  {selectedPet.status === "available" ? "Còn hàng" : "Đã bán"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái hoạt động">
                <Tag color={selectedPet.isActive ? "green" : "red"}>
                  {selectedPet.isActive ? "Hoạt động" : "Tạm dừng"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày nhập">
                {formatDate(selectedPet.arrivalDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {formatDate(selectedPet.createdAt)}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Thông tin sức khỏe"
              column={2}
              size="small"
              style={{ marginBottom: 20 }}
            >
              <Descriptions.Item label="Tình trạng sức khỏe">
                <Tag
                  color={
                    selectedPet.healthStatus === "excellent"
                      ? "green"
                      : selectedPet.healthStatus === "good"
                      ? "blue"
                      : selectedPet.healthStatus === "fair"
                      ? "orange"
                      : "red"
                  }
                >
                  {selectedPet.healthStatus === "excellent"
                    ? "Xuất sắc"
                    : selectedPet.healthStatus === "good"
                    ? "Tốt"
                    : selectedPet.healthStatus === "fair"
                    ? "Khá"
                    : "Kém"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tình trạng tiêm chủng">
                <Tag
                  color={
                    selectedPet.vaccinationStatus === "fully_vaccinated"
                      ? "green"
                      : selectedPet.vaccinationStatus === "partially_vaccinated"
                      ? "orange"
                      : "red"
                  }
                >
                  {selectedPet.vaccinationStatus === "fully_vaccinated"
                    ? "Đầy đủ"
                    : selectedPet.vaccinationStatus === "partially_vaccinated"
                    ? "Một phần"
                    : "Chưa tiêm"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {selectedPet.description && (
              <div style={{ marginBottom: "20px" }}>
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

            {selectedPet.certificateInfo && (
              <div style={{ marginBottom: "20px" }}>
                <h4>Thông tin chứng chỉ:</h4>
                <p
                  style={{
                    background: "#f5f5f5",
                    padding: "12px",
                    borderRadius: "6px",
                  }}
                >
                  {selectedPet.certificateInfo}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>{" "}
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
          Đã chọn: {selectedRowKeys.length} thú cưng
        </div>
      )}
    </div>
  );
};

export default PetPage;
