import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Tag,
  Dropdown,
  Avatar,
  Checkbox,
  Select,
  Modal,
  Form,
  DatePicker,
  Switch,
  message,
  Descriptions,
  Divider,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  MoreOutlined,
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import dayjs from "dayjs";
import { _request } from "../../../network/Api";
import { Employee } from "../../../network/Type";

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const EmployeePage: React.FC = () => {  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(0); 
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [resetPasswordForm] = Form.useForm();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false); 
  const loadEmployees = async (page?: number, search?: string, sort?: string) => {
    setLoading(true);
    try {
      const currentPageIndex = page !== undefined ? page : currentPage;
      const params = new URLSearchParams({
        page: currentPageIndex.toString(),
        size: pageSize.toString(),
      });

      if (sort) {
        params.append('sort', sort);
      }

      if (search && search.trim()) {
      }

      await _request({
        path: `/employees?${params.toString()}`,
        method: "GET",
        onSuccess(response) {
          const data = response.data;
          let employeesData = data.content;

          if (search && search.trim()) {
            employeesData = employeesData.filter((employee: Employee) =>
              employee.fullName.toLowerCase().includes(search.toLowerCase()) ||
              (employee.email && employee.email.toLowerCase().includes(search.toLowerCase())) ||
              employee.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
              employee.username.toLowerCase().includes(search.toLowerCase()) ||
              (employee.position && employee.position.toLowerCase().includes(search.toLowerCase())) ||
              (employee.department && employee.department.toLowerCase().includes(search.toLowerCase()))
            );
          }

          const employeesWithKeys = employeesData.map((employee: any) => ({
            ...employee,
            key: employee.id.toString()
          }));
          
          setEmployees(employeesWithKeys);
          
          // Update pagination info based on filtered results if using client-side search
          if (search && search.trim()) {
            setTotalElements(employeesData.length);
            setTotalPages(Math.ceil(employeesData.length / pageSize));
          } else {
            setTotalElements(data.totalElements);
            setTotalPages(data.totalPages);
          }
        },
        onError(error) {
          message.error('Không thể tải danh sách nhân viên');
          console.error(error);
        },
      });
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải nhân viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);  // Reload employees when filters or pagination change
  useEffect(() => {
    const sortParam = sortField && sortOrder ? `${sortField},${sortOrder}` : undefined;
    loadEmployees(currentPage, searchText, sortParam);
  }, [currentPage, pageSize, sortField, sortOrder]);

  // Handle search with debounce effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (currentPage !== 0) {
        setCurrentPage(0); // Reset to first page when searching
      }
      const sortParam = sortField && sortOrder ? `${sortField},${sortOrder}` : undefined;
      loadEmployees(0, searchText, sortParam);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchText]);

  // Use server-side data directly
  const currentPageData = employees;
  const totalItems = totalElements;

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    editForm.setFieldsValue({
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      salary: employee.salary,
      gender: employee.gender,
      address: employee.address,
      dateOfBirth: employee.dateOfBirth ? dayjs(employee.dateOfBirth) : null,
      hireDate: employee.hireDate ? dayjs(employee.hireDate) : null,
      isActive: employee.isActive,
    });
    setIsEditModalVisible(true);
  };

  const handleDetail = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailModalVisible(true);
  };

  const handleResetPassword = (employee: Employee) => {
    setSelectedEmployee(employee);
    resetPasswordForm.resetFields();
    setIsResetPasswordModalVisible(true);
  };
  const handleDelete = async (employee: Employee) => {
    try {
      await _request({
        path: `/employees/${employee.id}`,
        method: "DELETE",
        onSuccess() {
          message.success(`Đã xóa nhân viên ${employee.fullName}`);
          loadEmployees(currentPage, searchText);
        },
        onError(error) {
          message.error(`Lỗi khi xóa nhân viên: ${error}`);
        },
      });
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa nhân viên');
    }
  };

  const getActionItems = (employee: Employee): MenuProps["items"] => [
    {
      key: "detail",
      label: "Xem chi tiết",
      icon: <EyeOutlined />,
      onClick: () => handleDetail(employee),
    },
    {
      key: "edit",
      label: "Chỉnh sửa",
      icon: <EditOutlined />,
      onClick: () => handleEdit(employee),
    },
    // {
    //   key: "reset-password",
    //   label: "Đặt lại mật khẩu",
    //   icon: <KeyOutlined />,
    //   onClick: () => handleResetPassword(employee),
    // },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Xóa",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: "Xác nhận xóa",
          content: `Bạn có chắc chắn muốn xóa nhân viên ${employee.fullName}?`,
          okText: "Xóa",
          okType: "danger",
          cancelText: "Hủy",
          onOk: () => handleDelete(employee),
        });
      },
    },
  ];  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
    } else {
      setSortField("createdAt");
      setSortOrder("desc");
    }
  };  
  const getRoleDisplay = (role: string) => {
    const roleMap: { [key: string]: { name: string; color: string } } = {
      ADMIN: { name: "Quản trị viên", color: "red" },
      MANAGER: { name: "Quản lý", color: "orange" },
      VETERINARIAN: { name: "Bác sĩ thú y", color: "green" },
      STAFF: { name: "Nhân viên", color: "blue" },
      ACCOUNTANT: { name: "Kế toán", color: "purple" },
      RECEPTIONIST: { name: "Tiếp tân", color: "cyan" },
      // New roleName format from API
      admin: { name: "Quản trị viên", color: "red" },
      manager: { name: "Quản lý", color: "orange" },
      staff: { name: "Nhân viên", color: "blue" },
      veterinarian: { name: "Bác sĩ thú y", color: "green" },
      accountant: { name: "Kế toán", color: "purple" },
      receptionist: { name: "Tiếp tân", color: "cyan" },    };

    return roleMap[role] || { name: role, color: "default" };
  };

  const handleAddEmployee = async () => {
    try {
      const values = await addForm.validateFields();
      
      const newEmployeeData = {
        username: values.username,
        email: values.email || null,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone || null,
        address: values.address || null,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.toISOString().split('T')[0]
          : null,
        hireDate: values.hireDate
          ? values.hireDate.toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0], 
        salary: values.salary || 0,
        position: values.position || 'Staff',
        department: values.department || 'General',
        isActive: values.isActive ?? true,
      };

      await _request({
        path: "/employees",
        method: "POST",
        body: newEmployeeData,
        onSuccess(response) {
          const newEmployee = { ...response.data, key: response.data.id.toString() };
          setEmployees((prev) => [newEmployee, ...prev]);
          setIsAddModalVisible(false);
          addForm.resetFields();
          message.success("Thêm nhân viên thành công!");
          loadEmployees(currentPage, searchText);
        },
        onError(error) {
          message.error(`Lỗi khi thêm nhân viên: ${error}`);
        },
      });
    } catch (error) {
      console.error("Add employee error:", error);
    }
  };
  const handleEditEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      const values = await editForm.validateFields();
      
      const updateData = {
        fullName: values.fullName,
        email: values.email || null,
        phone: values.phone || null,
        address: values.address || null,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.toISOString().split('T')[0]
          : null,
        salary: values.salary || selectedEmployee.salary,
        position: values.position || selectedEmployee.position,
        department: values.department || selectedEmployee.department,
        isActive: values.isActive,
      };

      await _request({
        path: `/employees/${selectedEmployee.id}`,
        method: "PUT",
        body: updateData,
        onSuccess(response) {
          const updatedEmployee = { ...response.data, key: response.data.id.toString() };
          setEmployees((prev) =>
            prev.map((emp) =>
              emp.id === selectedEmployee.id ? updatedEmployee : emp
            )
          );
          setIsEditModalVisible(false);
          setSelectedEmployee(null);
          message.success("Cập nhật thông tin nhân viên thành công!");
          loadEmployees(currentPage, searchText);
        },
        onError(error) {
          message.error(`Lỗi khi cập nhật nhân viên: ${error}`);
        },
      });
    } catch (error) {
      console.error("Edit employee error:", error);
    }
  };

  const handleResetPasswordSubmit = async () => {
    if (!selectedEmployee) return;

    try {
      const values = await resetPasswordForm.validateFields();
      
      await _request({
        path: `/employees/${selectedEmployee.id}/reset-password`,
        method: "POST",
        body: { newPassword: values.newPassword },
        onSuccess() {
          setIsResetPasswordModalVisible(false);
          setSelectedEmployee(null);
          resetPasswordForm.resetFields();
          message.success("Đặt lại mật khẩu thành công!");
        },
        onError(error) {
          message.error(`Lỗi khi đặt lại mật khẩu: ${error}`);
        },
      });
    } catch (error) {
      console.error("Reset password error:", error);
    }
  };


  const columns: ColumnsType<Employee> = [
    {
      title: "",
      dataIndex: "checkbox",
      width: 50,
    },
    {
      title: "Thông tin nhân viên",
      dataIndex: "employee",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{
              backgroundColor: record.isActive ? "#1890ff" : "#d9d9d9",
              color: record.isActive ? "#fff" : "#999",
            }}
          >
            {record.fullName.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500, color: "#262626" }}>
              {record.fullName}
            </div>
            <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
              {record.employeeCode} • {record.email || record.username}
            </div>
          </div>
        </div>
      ),
    },    {
      title: "Chức vụ & Phòng ban",
      dataIndex: "position",
      sorter: true,
      render: (position: string, record: Employee) => {
        const role = record.roleName || record.role || 'staff';
        const roleDisplay = getRoleDisplay(role);
        return (
          <div>
            <Tag color={roleDisplay.color}>{roleDisplay.name}</Tag>
            <div style={{ fontSize: "11px", color: "#8c8c8c", marginTop: "2px" }}>
              {position} • {record.department}
            </div>
          </div>
        );
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      render: (phone: string | null) => (
        <span style={{ color: phone ? "#1890ff" : "#8c8c8c" }}>
          {phone || "Chưa cập nhật"}
        </span>
      ),
    },
    {
      title: "Lương",
      dataIndex: "salary",
      sorter: true,
      render: (salary: number) => (
        <span style={{ color: "#52c41a", fontWeight: 500 }}>
          {salary ? `${salary.toLocaleString('vi-VN')} VNĐ` : "Chưa cập nhật"}
        </span>
      ),
    },
    {
      title: "Ngày vào làm",
      dataIndex: "hireDate",
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"} style={{ fontWeight: 500 }}>
          {isActive ? "Đang làm việc" : "Đã nghỉ việc"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      render: (_, record) => (
        <Dropdown
          menu={{ items: getActionItems(record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
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
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ margin: 0, color: "#262626" }}>Quản lý nhân viên</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalVisible(true)}
            style={{ backgroundColor: "#1890ff" }}
          >
            Thêm nhân viên mới
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            <Search
              placeholder="Tìm kiếm theo tên, email, mã NV, username hoặc chức vụ"
              prefix={<SearchOutlined />}
              style={{ width: 450 }}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
            <Button icon={<FilterOutlined />}>Bộ lọc</Button>
          </div>
        </div>

        <div>          <Table
            columns={columns}
            dataSource={currentPageData}
            pagination={false}
            size="middle"
            loading={loading}
            onChange={handleTableChange}
            rowSelection={rowSelection}
            style={{ backgroundColor: "#fff" }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "16px",
              padding: "12px 0",
            }}
          >
            <div style={{ color: "#8c8c8c" }}>
              {totalItems > 0
                ? `${startItem}-${endItem} của ${totalItems}`
                : "0 của 0"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ color: "#8c8c8c" }}>Số hàng mỗi trang:</span>
              <Select
                value={pageSize}
                onChange={handlePageSizeChange}
                style={{ width: 60 }}
                size="small"
              >
                <Option value={5}>5</Option>
                <Option value={10}>10</Option>
                <Option value={20}>20</Option>
              </Select>              <Button
                type="text"
                disabled={currentPage === 0}
                onClick={goToPreviousPage}
              >
                ‹
              </Button>
              <span style={{ color: "#8c8c8c" }}>
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

          <div style={{ marginTop: "16px" }}>
            <Checkbox>Hiển thị thu gọn</Checkbox>
          </div>
        </div>

        {selectedRowKeys.length > 0 && (
          <div
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              background: "#1890ff",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              fontWeight: 500,
            }}
          >
            Đã chọn: {selectedRowKeys.length} nhân viên
          </div>
        )}
      </div>

      <Modal
        title="Thêm nhân viên mới"
        open={isAddModalVisible}
        onOk={handleAddEmployee}
        onCancel={() => {
          setIsAddModalVisible(false);
          addForm.resetFields();
        }}
        width={600}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form form={addForm} layout="vertical" requiredMark={false}>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
            ]}
          >
            <Input  placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Email không hợp lệ!" }]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>          <Form.Item name="phone" label="Số điện thoại">
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="position"
            label="Vị trí công việc"
            rules={[{ required: true, message: "Vui lòng nhập vị trí công việc!" }]}
          >
            <Input placeholder="Nhập vị trí công việc" />
          </Form.Item>

          <Form.Item
            name="department"
            label="Phòng ban"
            rules={[{ required: true, message: "Vui lòng nhập phòng ban!" }]}
          >
            <Input placeholder="Nhập phòng ban" />
          </Form.Item>

          <Form.Item name="salary" label="Lương (VND)">
            <Input type="number" placeholder="Nhập lương" />
          </Form.Item>

          <Form.Item 
            name="hireDate" 
            label="Ngày vào làm"
            rules={[{ required: true, message: "Vui lòng chọn ngày vào làm!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn ngày vào làm"
            />
          </Form.Item>

          <Form.Item name="gender" label="Giới tính">
            <Select placeholder="Chọn giới tính">
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>
          </Form.Item>

          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn ngày sinh"
            />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <TextArea placeholder="Nhập địa chỉ" rows={3} />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Trạng thái"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checkedChildren="Đang làm việc"
              unCheckedChildren="Đã nghỉ việc"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh sửa thông tin nhân viên"
        open={isEditModalVisible}
        onOk={handleEditEmployee}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedEmployee(null);
        }}
        width={600}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form form={editForm} layout="vertical" requiredMark={false}>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Email không hợp lệ!" }]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>          <Form.Item name="phone" label="Số điện thoại">
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item name="position" label="Vị trí công việc">
            <Input placeholder="Nhập vị trí công việc" />
          </Form.Item>

          <Form.Item name="department" label="Phòng ban">
            <Input placeholder="Nhập phòng ban" />
          </Form.Item>

          <Form.Item name="salary" label="Lương (VND)">
            <Input type="number" placeholder="Nhập lương" />
          </Form.Item>

          <Form.Item name="gender" label="Giới tính">
            <Select placeholder="Chọn giới tính">
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>
          </Form.Item>

          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn ngày sinh"
            />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <TextArea placeholder="Nhập địa chỉ" rows={3} />
          </Form.Item>

          <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
            <Switch
              checkedChildren="Đang làm việc"
              unCheckedChildren="Đã nghỉ việc"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Employee Detail Modal */}
      <Modal
        title="Chi tiết nhân viên"
        open={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedEmployee(null);
        }}
        width={700}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedEmployee && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <Avatar
                size={80}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: selectedEmployee.isActive
                    ? "#1890ff"
                    : "#d9d9d9",
                  color: selectedEmployee.isActive ? "#fff" : "#999",
                  marginBottom: "16px",
                }}
              >
                {selectedEmployee.fullName.charAt(0)}
              </Avatar>
              <h3 style={{ margin: 0, color: "#262626" }}>
                {selectedEmployee.fullName}
              </h3>
              <Tag
                color={selectedEmployee.isActive ? "green" : "red"}
                style={{ marginTop: "8px" }}
              >
                {selectedEmployee.isActive ? "Đang làm việc" : "Đã nghỉ việc"}
              </Tag>
            </div>

            <Divider />            <Descriptions column={2} bordered>
              <Descriptions.Item label="Mã nhân viên">
                {selectedEmployee.employeeCode}
              </Descriptions.Item>
              <Descriptions.Item label="Tên đăng nhập">
                {selectedEmployee.username}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedEmployee.email || "Chưa cập nhật"}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedEmployee.phone || "Chưa cập nhật"}
              </Descriptions.Item>
              <Descriptions.Item label="Chức vụ">
                <Tag color={getRoleDisplay(selectedEmployee.roleName || selectedEmployee.role || 'staff').color}>
                  {getRoleDisplay(selectedEmployee.roleName || selectedEmployee.role || 'staff').name}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Vị trí công việc">
                {selectedEmployee.position || "Chưa cập nhật"}
              </Descriptions.Item>
              <Descriptions.Item label="Phòng ban">
                {selectedEmployee.department || "Chưa cập nhật"}
              </Descriptions.Item>
              <Descriptions.Item label="Lương">
                <span style={{ color: "#52c41a", fontWeight: 500 }}>
                  {selectedEmployee.salary ? `${selectedEmployee.salary.toLocaleString('vi-VN')} VNĐ` : "Chưa cập nhật"}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày vào làm">
                {selectedEmployee.hireDate
                  ? new Date(selectedEmployee.hireDate).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {selectedEmployee.gender ? (
                  <Tag
                    color={selectedEmployee.gender === "Nam" ? "blue" : "pink"}
                  >
                    {selectedEmployee.gender}
                  </Tag>
                ) : (
                  "Chưa cập nhật"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {selectedEmployee.dateOfBirth
                  ? new Date(selectedEmployee.dateOfBirth).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {selectedEmployee.createdAt 
                  ? new Date(selectedEmployee.createdAt).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {selectedEmployee.address || "Chưa cập nhật"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title="Đặt lại mật khẩu"
        open={isResetPasswordModalVisible}
        onOk={handleResetPasswordSubmit}
        onCancel={() => {
          setIsResetPasswordModalVisible(false);
          setSelectedEmployee(null);
        }}
        width={500}
        okText="Đặt lại mật khẩu"
        cancelText="Hủy"
      >
        {selectedEmployee && (
          <div>
            <div
              style={{
                marginBottom: "16px",
                padding: "16px",
                backgroundColor: "#f6f6f6",
                borderRadius: "6px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#1890ff" }}
                >
                  {selectedEmployee.fullName.charAt(0)}
                </Avatar>
                <div>
                  <div style={{ fontWeight: 500 }}>
                    {selectedEmployee.fullName}
                  </div>
                  <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    {selectedEmployee.employeeCode} •{" "}
                    {selectedEmployee.username}
                  </div>
                </div>
              </div>
            </div>

            <Form
              form={resetPasswordForm}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Xác nhận mật khẩu mới" />
              </Form.Item>
            </Form>

            <div
              style={{
                padding: "12px",
                backgroundColor: "#fff7e6",
                border: "1px solid #ffd591",
                borderRadius: "6px",
                fontSize: "14px",
                color: "#d48806",
              }}
            >
              <strong>Lưu ý:</strong> Nhân viên sẽ cần sử dụng mật khẩu mới để
              đăng nhập vào hệ thống.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmployeePage;
