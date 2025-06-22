# API Documentation for Customer Management

## Overview

This document outlines the available API endpoints for managing customers in the YummyPet system. The API provides functionalities for registering customers, updating customer information, managing loyalty points, and retrieving customer details.

## Authentication

Most of the endpoints require authentication. Please include a valid JWT token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

## Customer Endpoints

### Get Current Customer (Logged-in Customer)

**Endpoint:** `GET /api/customers/me`

**Access:** Customer only

**Description:** Retrieves the profile information of the currently logged-in customer.

**Response Example:**
```json
{
  "success": true,
  "message": "Lấy thông tin khách hàng thành công",
  "data": {
    "id": 1,
    "customerCode": "CUS000001",
    "fullName": "Nguyễn Văn A",
    "phone": "0987654321",
    "email": "nguyenvana@example.com",
    "address": "123 Đường Lê Lợi, Quận 1, TP.HCM",
    "dateOfBirth": "1990-01-15",
    "gender": "male",
    "loyaltyPoints": 150,
    "isActive": true,
    "createdAt": "2025-01-01T10:00:00",
    "updatedAt": "2025-06-15T14:30:00",
    "hasAccount": true
  }
}
```

### Get All Customers (Paginated)

**Endpoint:** `GET /api/customers?page=0&size=10&sortBy=id&sortDir=asc`

**Access:** Admin only

**Parameters:**
- `page` (optional, default: 0): Page number
- `size` (optional, default: 10): Number of records per page
- `sortBy` (optional, default: "id"): Field to sort by
- `sortDir` (optional, default: "asc"): Sort direction ("asc" or "desc")

**Description:** Retrieves a paginated list of all customers.

**Response Example:**
```json
{
  "success": true,
  "message": "Lấy danh sách khách hàng thành công",
  "data": {
    "content": [
      {
        "id": 1,
        "customerCode": "CUS000001",
        "fullName": "Nguyễn Văn A",
        "phone": "0987654321",
        "email": "nguyenvana@example.com",
        "loyaltyPoints": 150,
        "isActive": true,
        "hasAccount": true
      },
      // More customer records...
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": true,
        "unsorted": false,
        "empty": false
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "totalElements": 45,
    "totalPages": 5,
    "last": false,
    "size": 10,
    "number": 0,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "numberOfElements": 10,
    "first": true,
    "empty": false
  }
}
```

### Search Customers

**Endpoint:** `GET /api/customers/search?keyword=nguyenvan&page=0&size=10&sortBy=id&sortDir=asc`

**Access:** Admin and Staff

**Parameters:**
- `keyword` (required): Search term (searches name, email, phone, code)
- `page` (optional, default: 0): Page number
- `size` (optional, default: 10): Number of records per page
- `sortBy` (optional, default: "id"): Field to sort by
- `sortDir` (optional, default: "asc"): Sort direction ("asc" or "desc")

**Description:** Searches for customers by name, email, phone, or customer code.

### Search Customers by Phone Number (Partial Match)

**Endpoint:** `GET /api/customers/search/phone?phone=090&page=0&size=10&sortBy=id&sortDir=asc`

**Access:** Admin and Staff

**Parameters:**
- `phone` (required): Search term for phone number (searches for any phone number containing this sequence)
- `page` (optional, default: 0): Page number
- `size` (optional, default: 10): Number of records per page
- `sortBy` (optional, default: "id"): Field to sort by
- `sortDir` (optional, default: "asc"): Sort direction ("asc" or "desc")

**Description:** Searches for customers whose phone numbers contain the specified sequence. This API supports partial matching, so you can search for customers with phone numbers containing a specific pattern, rather than requiring an exact match.

**Response Example:**
```json
{
  "success": true,
  "message": "Tìm kiếm khách hàng theo số điện thoại thành công",
  "data": {
    "content": [
      {
        "id": 1,
        "customerCode": "CUS000001",
        "fullName": "Nguyễn Văn A",
        "phone": "0907654321",
        "email": "nguyenvana@example.com",
        "loyaltyPoints": 150,
        "isActive": true,
        "hasAccount": true
      },
      {
        "id": 3,
        "customerCode": "CUS000003",
        "fullName": "Lê Văn C",
        "phone": "0901234567",
        "email": "levanc@example.com",
        "loyaltyPoints": 50,
        "isActive": true,
        "hasAccount": false
      },
      // More customer records...
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": true,
        "unsorted": false,
        "empty": false
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "totalElements": 12,
    "totalPages": 2,
    "last": false,
    "size": 10,
    "number": 0,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "numberOfElements": 10,
    "first": true,
    "empty": false
  }
}
```

### Get Customer by ID

**Endpoint:** `GET /api/customers/{id}`

**Access:** Admin and Staff

**Description:** Retrieves a specific customer by their ID.

### Get Customer by Code

**Endpoint:** `GET /api/customers/code/{code}`

**Access:** Admin and Staff

**Description:** Retrieves a specific customer by their customer code.

### Get Customer by Phone Number

**Endpoint:** `GET /api/customers/phone/{phone}`

**Access:** Admin and Staff

**Description:** Retrieves a specific customer by their phone number.

**Response Example:**
```json
{
  "success": true,
  "message": "Lấy thông tin khách hàng theo số điện thoại thành công",
  "data": {
    "id": 46,
    "customerCode": "CUS000046",
    "fullName": "Trần Thị B",
    "phone": "0912345678",
    "email": "tranthib@example.com",
    "address": "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    "dateOfBirth": "1995-05-20",
    "gender": "female",
    "loyaltyPoints": 50,
    "isActive": true,
    "createdAt": "2025-06-21T15:30:00",
    "updatedAt": "2025-06-21T16:10:00",
    "hasAccount": false
  }
}
```

### Get Top Customers by Loyalty Points

**Endpoint:** `GET /api/customers/top?minPoints=100&limit=10`

**Access:** Admin only

**Parameters:**
- `minPoints` (optional, default: 100): Minimum loyalty points
- `limit` (optional, default: 10): Maximum number of customers to return

**Description:** Retrieves a list of top customers by loyalty points.

### Create Customer (Walk-in)

**Endpoint:** `POST /api/customers`

**Access:** Admin and Staff

**Description:** Creates a new walk-in customer without a user account.

**Request Body:**
```json
{
  "fullName": "Trần Thị B",
  "phone": "0912345678",
  "email": "tranthib@example.com",
  "address": "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
  "dateOfBirth": "1995-05-20",
  "gender": "female"
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Tạo khách hàng thành công",
  "data": {
    "id": 46,
    "customerCode": "CUS000046",
    "fullName": "Trần Thị B",
    "phone": "0912345678",
    "email": "tranthib@example.com",
    "address": "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    "dateOfBirth": "1995-05-20",
    "gender": "female",
    "loyaltyPoints": 0,
    "isActive": true,
    "createdAt": "2025-06-21T15:30:00",
    "updatedAt": null,
    "hasAccount": false
  }
}
```

### Update Customer Information

**Endpoint:** `PUT /api/customers/{id}`

**Access:** Admin, Staff, and Customer (only their own)

**Description:** Updates a customer's information.

**Request Body:**
```json
{
  "fullName": "Trần Thị B Cập Nhật",
  "phone": "0912345678",
  "email": "tranthib.updated@example.com",
  "address": "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
  "dateOfBirth": "1995-05-20",
  "gender": "female"
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Cập nhật thông tin khách hàng thành công",
  "data": {
    "id": 46,
    "customerCode": "CUS000046",
    "fullName": "Trần Thị B Cập Nhật",
    "phone": "0912345678",
    "email": "tranthib.updated@example.com",
    "address": "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    "dateOfBirth": "1995-05-20",
    "gender": "female",
    "loyaltyPoints": 0,
    "isActive": true,
    "createdAt": "2025-06-21T15:30:00",
    "updatedAt": "2025-06-21T15:45:00",
    "hasAccount": false
  }
}
```

### Update Loyalty Points

**Endpoint:** `PATCH /api/customers/{id}/loyalty-points`

**Access:** Admin and Staff

**Description:** Updates a customer's loyalty points.

**Request Body:**
```json
{
  "points": 50
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Cập nhật điểm thưởng thành công",
  "data": {
    "customerId": 46,
    "customerCode": "CUS000046",
    "fullName": "Trần Thị B Cập Nhật",
    "previousPoints": 0,
    "currentPoints": 50,
    "change": 50
  }
}
```

### Deactivate Customer

**Endpoint:** `PATCH /api/customers/{id}/deactivate`

**Access:** Admin only

**Description:** Deactivates a customer's account.

**Response Example:**
```json
{
  "success": true,
  "message": "Vô hiệu hóa tài khoản khách hàng thành công",
  "data": {
    "id": 46,
    "customerCode": "CUS000046",
    "fullName": "Trần Thị B Cập Nhật",
    "phone": "0912345678",
    "email": "tranthib.updated@example.com",
    "address": "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    "dateOfBirth": "1995-05-20",
    "gender": "female",
    "loyaltyPoints": 50,
    "isActive": false,
    "createdAt": "2025-06-21T15:30:00",
    "updatedAt": "2025-06-21T16:00:00",
    "hasAccount": false
  }
}
```

### Activate Customer

**Endpoint:** `PATCH /api/customers/{id}/activate`

**Access:** Admin only

**Description:** Activates a previously deactivated customer's account.

**Response Example:**
```json
{
  "success": true,
  "message": "Kích hoạt tài khoản khách hàng thành công",
  "data": {
    "id": 46,
    "customerCode": "CUS000046",
    "fullName": "Trần Thị B Cập Nhật",
    "phone": "0912345678",
    "email": "tranthib.updated@example.com",
    "address": "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    "dateOfBirth": "1995-05-20",
    "gender": "female",
    "loyaltyPoints": 50,
    "isActive": true,
    "createdAt": "2025-06-21T15:30:00",
    "updatedAt": "2025-06-21T16:10:00",
    "hasAccount": false
  }
}
```

## Error Responses

API may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Lỗi dữ liệu đầu vào",
  "data": {
    "fullName": "Họ tên không được để trống",
    "phone": "Số điện thoại không hợp lệ"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Bạn cần đăng nhập để thực hiện hành động này",
  "data": null
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Bạn không có quyền thực hiện hành động này",
  "data": null
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Không tìm thấy khách hàng với ID: 999",
  "data": null
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Đã xảy ra lỗi hệ thống",
  "data": null
}
```

## Hệ Thống Điểm Thưởng (Loyalty Points)

Hệ thống YummyPet tích hợp tính năng điểm thưởng cho khách hàng đã đăng ký. Dưới đây là mô tả về cách hoạt động của hệ thống điểm thưởng:

### Tích Điểm

- **Tỷ lệ tích điểm**: 1 điểm cho mỗi 10,000 VND trong tổng giá trị đơn hàng.
- **Kích hoạt**: Điểm thưởng được tự động tích lũy khi đơn hàng chuyển sang trạng thái "completed".
- **Đối tượng áp dụng**: Chỉ khách hàng đã đăng ký tài khoản mới nhận được điểm thưởng (khách vãng lai không áp dụng).

### Sử Dụng Điểm

- **Tỷ lệ quy đổi**: 1 điểm = 1,000 VND khi sử dụng để giảm giá đơn hàng.
- **Cách sử dụng**: Khách hàng có thể sử dụng điểm thưởng khi tạo đơn hàng bằng cách chỉ định số điểm muốn sử dụng.
- **Giới hạn**: Khách hàng chỉ có thể sử dụng số điểm không vượt quá tổng điểm hiện có.

### Hoàn Trả Điểm

- Khi đơn hàng bị hủy, điểm thưởng đã sử dụng sẽ được hoàn trả lại cho khách hàng.
- Nếu đơn hàng đã hoàn thành và đã tích điểm, nhưng sau đó bị hủy hoặc đổi trả, điểm thưởng có thể bị điều chỉnh giảm.

### Lịch Sử Điểm Thưởng

Hệ thống ghi lại lịch sử đầy đủ các giao dịch điểm thưởng với các loại sau:
- **earned**: Điểm thưởng được tích lũy từ đơn hàng
- **redeemed**: Điểm thưởng được sử dụng để giảm giá đơn hàng
- **restored**: Điểm thưởng được hoàn trả khi đơn hàng bị hủy
- **adjusted**: Điểm thưởng được điều chỉnh thủ công bởi quản trị viên
- **expired**: Điểm thưởng hết hạn (nếu áp dụng chính sách hết hạn)

### API Liên Quan Đến Điểm Thưởng

#### Cập Nhật Điểm Thưởng (Admin/Staff)

```
PATCH /api/customers/{id}/loyalty-points
Content-Type: application/json
Authorization: Bearer {token}

{
  "points": 50  // Số dương để thêm điểm, số âm để trừ điểm
}
```

#### Xem Thông Tin Điểm Thưởng Hiện Tại

Thông tin điểm thưởng hiện tại được trả về trong response của API lấy thông tin khách hàng:

```
GET /api/customers/me
Authorization: Bearer {token}
```

Response sẽ bao gồm trường `loyaltyPoints` cho biết số điểm hiện tại của khách hàng.

### Ví Dụ Tính Toán Điểm Thưởng

1. **Tích điểm**:
   - Khách hàng mua hàng với tổng giá trị 350,000 VND
   - Điểm thưởng nhận được: 350,000 ÷ 10,000 = 35 điểm

2. **Sử dụng điểm**:
   - Khách hàng sử dụng 20 điểm
   - Giá trị giảm: 20 × 1,000 = 20,000 VND
   - Số điểm còn lại: Số điểm hiện có - 20

3. **Hoàn trả điểm**:
   - Nếu đơn hàng bị hủy sau khi khách hàng đã sử dụng 20 điểm
   - Hệ thống sẽ hoàn trả 20 điểm vào tài khoản khách hàng
