# Hướng dẫn sử dụng Authentication API

Tài liệu này hướng dẫn chi tiết cách sử dụng các API xác thực trong hệ thống YummyPet.

## Yêu cầu

- Postman hoặc công cụ test API tương tự
- Hệ thống YummyPet đã được cài đặt và chạy (mặc định ở địa chỉ `http://localhost:8080`)

## Cấu hình Mail (Cho Forgot Password)

Để sử dụng chức năng quên mật khẩu, bạn cần thêm các cấu hình sau vào file `application.properties`:

```properties
# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

> **Lưu ý**: Bạn cần sử dụng App Password nếu dùng Gmail. Tham khảo: [Google Account Help](https://support.google.com/accounts/answer/185833)

## Các API Authentication

### 1. Đăng ký (Register)

Đăng ký tài khoản khách hàng mới trong hệ thống.

#### Request

```
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
    "username": "customer1",
    "password": "password123",
    "email": "customer1@example.com",
    "fullName": "Nguyễn Văn A",
    "phone": "0987654321"
}
```

#### Response

```json
{
    "success": true,
    "message": "Đăng ký thành công",
    "data": null
}
```

### 2. Đăng nhập (Login)

Đăng nhập vào hệ thống và nhận JWT token.

#### Request

```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "username": "customer1",
    "password": "password123"
}
```

#### Response

```json
{
    "success": true,
    "message": "Đăng nhập thành công",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiJ9...",
        "role": "customer"
    }
}
```

> **Lưu ý**: Token JWT cần được lưu trữ ở client và gửi kèm trong header `Authorization` cho các request yêu cầu xác thực.

### 3. Đăng xuất (Logout)

Đăng xuất khỏi hệ thống, vô hiệu hóa token JWT hiện tại.

#### Request

```
POST http://localhost:8080/api/auth/logout
Content-Type: application/json

{
    "token": "Bearer eyJhbGciOiJIUzI1NiJ9..."
}
```

#### Response

```json
{
    "success": true,
    "message": "Đăng xuất thành công",
    "data": null
}
```

### 4. Quên mật khẩu (Forgot Password)

Yêu cầu gửi link đặt lại mật khẩu qua email.

#### Request

```
POST http://localhost:8080/api/auth/forgot-password
Content-Type: application/json

{
    "email": "customer1@example.com"
}
```

#### Response

```json
{
    "success": true,
    "message": "Link đặt lại mật khẩu đã được gửi đến email của bạn",
    "data": null
}
```

### 5. Đặt lại mật khẩu (Reset Password)

Đặt lại mật khẩu sử dụng token từ email.

#### Request

```
POST http://localhost:8080/api/auth/reset-password
Content-Type: application/json

{
    "token": "a3b2c1d0-e5f6-4a3b-8c9d-0e1f2a3b4c5d",
    "password": "newpassword123",
    "confirmPassword": "newpassword123"
}
```

#### Response

```json
{
    "success": true,
    "message": "Đặt lại mật khẩu thành công",
    "data": null
}
```

### 6. Đổi mật khẩu (Change Password)

Đổi mật khẩu khi đã đăng nhập.

#### Request

```
POST http://localhost:8080/api/auth/change-password
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

{
    "oldPassword": "password123",
    "newPassword": "newpassword456",
    "confirmPassword": "newpassword456"
}
```

#### Response

```json
{
    "success": true,
    "message": "Đổi mật khẩu thành công",
    "data": null
}
```

### 7. Tạo tài khoản nhân viên (Admin only)

Tạo tài khoản cho nhân viên (chỉ admin mới có quyền).

#### Request

```
POST http://localhost:8080/api/auth/create-user
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9... (Admin token)

{
    "username": "staff1",
    "password": "password123",
    "email": "staff1@example.com",
    "fullName": "Trần Văn B",
    "phone": "0912345678",
    "role": "staff",
    "position": "Sale",
    "salary": 10000000,
    "dateOfBirth": "1995-05-15",
    "hireDate": "2023-01-01",
    "department": "Sales"
}
```

#### Response

```json
{
    "success": true,
    "message": "Tạo tài khoản thành công",
    "data": null
}
```

## Quy trình sử dụng thông thường

1. Đăng ký tài khoản mới 
2. Đăng nhập và lưu token
3. Sử dụng token để truy cập các API được bảo vệ
4. Đăng xuất khi hoàn thành

## Xử lý lỗi

Tất cả các API sẽ trả về response có cấu trúc thống nhất:

```json
{
    "success": false,
    "message": "Mô tả lỗi",
    "data": null
}
```

### Các lỗi thường gặp

- **401 Unauthorized**: Không có quyền truy cập, token không hợp lệ hoặc hết hạn
- **403 Forbidden**: Không đủ quyền để thực hiện hành động
- **400 Bad Request**: Dữ liệu không hợp lệ
- **500 Internal Server Error**: Lỗi server

## Kết luận

Hệ thống xác thực của YummyPet cung cấp đầy đủ các chức năng cần thiết để xác thực và quản lý tài khoản người dùng. API được thiết kế theo chuẩn RESTful và sử dụng JWT để xử lý việc xác thực giữa các request.
