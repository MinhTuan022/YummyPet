# API Quản lý Nhân viên (Employee)

## Tổng quan
API này cung cấp các chức năng quản lý nhân viên trong hệ thống YummyPet, bao gồm tạo mới, xem thông tin, cập nhật và xóa nhân viên.

## Base URL
```
/api/employees
```

## Quyền truy cập
- **ADMIN**: Có quyền thực hiện tất cả các thao tác
- **STAFF**: Chỉ có quyền xem thông tin nhân viên

## API Endpoints

### 1. Lấy danh sách nhân viên
**GET** `/api/employees`

**Quyền:** ADMIN

**Parameters:**
- `page` (optional): Số trang (mặc định: 0)
- `size` (optional): Số lượng items per page (mặc định: 10)
- `sort` (optional): Sắp xếp theo field (ví dụ: "fullName,asc")

**Response Success (200):**
```json
{
  "success": true,
  "message": "Lấy danh sách nhân viên thành công",
  "data": {
    "content": [
      {
        "id": 1,
        "employeeCode": "EMP001",
        "username": "john_doe",
        "email": "john@yummypet.com",
        "fullName": "Nguyễn Văn A",
        "phone": "0123456789",
        "address": "123 ABC Street",
        "dateOfBirth": "1990-01-15",
        "hireDate": "2024-01-01",
        "salary": 15000000,
        "position": "Sales Staff",
        "department": "Sales",
        "isActive": true,
        "roleName": "staff"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10
    },
    "totalElements": 1,
    "totalPages": 1
  }
}
```

### 2. Lấy thông tin nhân viên theo ID
**GET** `/api/employees/{id}`

**Quyền:** ADMIN, STAFF

**Response Success (200):**
```json
{
  "success": true,
  "message": "Lấy thông tin nhân viên thành công",
  "data": {
    "id": 1,
    "employeeCode": "EMP001",
    "username": "john_doe",
    "email": "john@yummypet.com",
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789",
    "address": "123 ABC Street",
    "dateOfBirth": "1990-01-15",
    "hireDate": "2024-01-01",
    "salary": 15000000,
    "position": "Sales Staff",
    "department": "Sales",
    "isActive": true,
    "roleName": "staff"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Không tìm thấy nhân viên với ID: 999"
}
```

### 3. Lấy thông tin nhân viên theo mã nhân viên
**GET** `/api/employees/code/{employeeCode}`

**Quyền:** ADMIN, STAFF

**Response:** Tương tự như API lấy theo ID

### 4. Tạo nhân viên mới
**POST** `/api/employees`

**Quyền:** ADMIN

**Request Body:**
```json
{
  "username": "jane_doe",
  "email": "jane@yummypet.com",
  "password": "password123",
  "fullName": "Trần Thị B",
  "phone": "0987654321",
  "address": "456 XYZ Street",
  "dateOfBirth": "1992-05-20",
  "hireDate": "2024-06-21",
  "salary": 12000000,
  "position": "Customer Service",
  "department": "Customer Care",
  "isActive": true
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Tạo nhân viên mới thành công",
  "data": {
    "id": 2,
    "employeeCode": "EMP002",
    "username": "jane_doe",
    "email": "jane@yummypet.com",
    "fullName": "Trần Thị B",
    "phone": "0987654321",
    "address": "456 XYZ Street",
    "dateOfBirth": "1992-05-20",
    "hireDate": "2024-06-21",
    "salary": 12000000,
    "position": "Customer Service",
    "department": "Customer Care",
    "isActive": true,
    "roleName": "staff"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ: Email đã tồn tại"
}
```

### 5. Cập nhật thông tin nhân viên
**PUT** `/api/employees/{id}`

**Quyền:** ADMIN

**Request Body:**
```json
{
  "fullName": "Trần Thị B (Updated)",
  "phone": "0987654322",
  "address": "456 XYZ Street, Updated",
  "salary": 13000000,
  "position": "Senior Customer Service",
  "department": "Customer Care",
  "isActive": true
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Cập nhật thông tin nhân viên thành công",
  "data": {
    "id": 2,
    "employeeCode": "EMP002",
    "username": "jane_doe",
    "email": "jane@yummypet.com",
    "fullName": "Trần Thị B (Updated)",
    "phone": "0987654322",
    "address": "456 XYZ Street, Updated",
    "dateOfBirth": "1992-05-20",
    "hireDate": "2024-06-21",
    "salary": 13000000,
    "position": "Senior Customer Service",
    "department": "Customer Care",
    "isActive": true,
    "roleName": "staff"
  }
}
```

### 6. Xóa nhân viên (Soft Delete)
**DELETE** `/api/employees/{id}`

**Quyền:** ADMIN

**Response Success (200):**
```json
{
  "success": true,
  "message": "Xóa nhân viên thành công"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Không tìm thấy nhân viên: Employee not found with id: 999"
}
```

## Lưu ý
1. **Mã nhân viên (employeeCode):** Được tự động tạo theo định dạng EMP + số thứ tự
2. **Xóa nhân viên:** Sử dụng soft delete, chỉ đặt `isActive = false`
3. **Bảo mật:** Mật khẩu được mã hóa trước khi lưu vào database
4. **Role:** Nhân viên mới được tạo sẽ có role mặc định là "staff"
5. **User Account:** Khi tạo nhân viên, hệ thống sẽ tự động tạo tài khoản User tương ứng

## Các trường bắt buộc khi tạo nhân viên mới
- `username`: Tên đăng nhập (unique)
- `email`: Email (unique)
- `password`: Mật khẩu
- `fullName`: Họ tên đầy đủ
- `hireDate`: Ngày vào làm

## Validation Rules
- Username: Không được trùng lặp
- Email: Phải đúng định dạng email và không được trùng lặp
- Phone: Định dạng số điện thoại hợp lệ
- Salary: Phải là số dương
- Date fields: Định dạng yyyy-MM-dd
