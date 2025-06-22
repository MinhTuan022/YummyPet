# Test API Employee - YummyPet

## Hướng dẫn test API Employee

### Chuẩn bị
1. Đảm bảo server đang chạy
2. Có tài khoản admin để test
3. Sử dụng Postman hoặc curl để test

### 1. Đăng nhập để lấy JWT Token (nếu chưa có)
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "username": "admin",
    "password": "admin_password"
}
```

### 2. Test tạo nhân viên mới
```bash
POST http://localhost:8080/api/employees
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
    "username": "nhanvien01",
    "email": "nhanvien01@yummypet.com",
    "password": "password123",
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789",
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "dateOfBirth": "1990-01-15",
    "hireDate": "2024-06-21",
    "salary": 15000000,
    "position": "Nhân viên bán hàng",
    "department": "Kinh doanh",
    "isActive": true
}
```

### 3. Test lấy danh sách nhân viên
```bash
GET http://localhost:8080/api/employees?page=0&size=10
Authorization: Bearer YOUR_JWT_TOKEN
```

### 4. Test lấy thông tin nhân viên theo ID
```bash
GET http://localhost:8080/api/employees/1
Authorization: Bearer YOUR_JWT_TOKEN
```

### 5. Test lấy thông tin nhân viên theo mã
```bash
GET http://localhost:8080/api/employees/code/EMP001
Authorization: Bearer YOUR_JWT_TOKEN
```

### 6. Test cập nhật thông tin nhân viên
```bash
PUT http://localhost:8080/api/employees/1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
    "fullName": "Nguyễn Văn A (Updated)",
    "phone": "0123456788",
    "salary": 16000000,
    "position": "Trưởng nhóm bán hàng"
}
```

### 7. Test xóa nhân viên (soft delete)
```bash
DELETE http://localhost:8080/api/employees/1
Authorization: Bearer YOUR_JWT_TOKEN
```

## Kết quả mong đợi

### Response thành công (200/201):
```json
{
    "success": true,
    "message": "Thao tác thành công",
    "data": {
        "id": 1,
        "employeeCode": "EMP001",
        "username": "nhanvien01",
        "email": "nhanvien01@yummypet.com",
        "fullName": "Nguyễn Văn A",
        "phone": "0123456789",
        "address": "123 Đường ABC, Quận 1, TP.HCM",
        "dateOfBirth": "1990-01-15",
        "hireDate": "2024-06-21",
        "salary": 15000000,
        "position": "Nhân viên bán hàng",
        "department": "Kinh doanh",
        "isActive": true,
        "roleName": "staff"
    }
}
```

### Response lỗi (400/404/500):
```json
{
    "success": false,
    "message": "Mô tả lỗi chi tiết"
}
```

## Lưu ý
- Cần có role ADMIN để tạo, sửa, xóa nhân viên
- Role STAFF chỉ có thể xem thông tin
- Mã nhân viên được tự động tạo theo format EMP + số thứ tự
- Xóa nhân viên chỉ là soft delete (isActive = false)
