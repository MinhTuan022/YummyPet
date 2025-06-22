# Hướng dẫn kiểm thử tìm kiếm khách hàng theo số điện thoại

## Mục đích

Tài liệu này hướng dẫn cách kiểm thử tính năng tìm kiếm khách hàng theo số điện thoại mới được thêm vào hệ thống YummyPet.

## Chuẩn bị

1. Đảm bảo đã triển khai phiên bản mới nhất (v1.3.4) của hệ thống
2. Đăng nhập với tài khoản admin hoặc nhân viên
3. Chuẩn bị danh sách số điện thoại khách hàng cần kiểm tra

## Các bước kiểm thử

### 1. Kiểm tra tìm kiếm khách hàng tồn tại

**API Call:**
```
GET /api/customers/phone/0912345678
Authorization: Bearer {token}
```

**Kết quả mong đợi:**
- Status: 200 OK
- Response body chứa thông tin đầy đủ của khách hàng, bao gồm id, customerCode, fullName, v.v.
- Trường phone trong response khớp với số điện thoại đã tìm kiếm

### 2. Kiểm tra tìm kiếm khách hàng không tồn tại

**API Call:**
```
GET /api/customers/phone/0999999999
Authorization: Bearer {token}
```

**Kết quả mong đợi:**
- Status: 400 Bad Request
- Response body chứa thông báo lỗi "Không tìm thấy khách hàng với số điện thoại: 0999999999"

### 3. Kiểm tra quyền truy cập

#### 3.1 Với người dùng không có quyền (khách hàng)

**API Call:**
```
GET /api/customers/phone/0912345678
Authorization: Bearer {customer_token}
```

**Kết quả mong đợi:**
- Status: 403 Forbidden
- Response body chứa thông báo lỗi về quyền truy cập

#### 3.2 Với người dùng không xác thực

**API Call:**
```
GET /api/customers/phone/0912345678
```

**Kết quả mong đợi:**
- Status: 401 Unauthorized
- Response body chứa thông báo lỗi về xác thực

## Kiểm tra tích hợp với giao diện người dùng

1. Đăng nhập vào hệ thống với tài khoản nhân viên
2. Vào trang "Quản lý khách hàng"
3. Sử dụng ô tìm kiếm, nhập số điện thoại của khách hàng
4. Nhấn Enter hoặc nút tìm kiếm
5. Kiểm tra xem kết quả hiển thị đúng khách hàng có số điện thoại vừa nhập hay không

## Xử lý trường hợp đặc biệt

### 1. Số điện thoại có nhiều định dạng

Kiểm tra tìm kiếm với các định dạng số điện thoại khác nhau:
- Với dấu cách: "0912 345 678"
- Với dấu gạch ngang: "0912-345-678"
- Với mã quốc gia: "+84912345678"

