# Hướng dẫn Test API sau khi cấu hình Security

## 🔧 Cấu hình đã thực hiện:

### 1. **SecurityConfig.java** - Cấu hình chính
- ✅ Sửa authorities sử dụng "ROLE_" prefix
- ✅ Phân quyền chi tiết cho từng endpoint
- ✅ Public access cho products, pets, services, categories

### 2. **UserDetailsImpl.java** - Authentication
- ✅ Tự động thêm "ROLE_" prefix cho roles
- ✅ Convert role thành uppercase

### 3. **DevSecurityConfig.java** - Cấu hình cho testing
- ✅ Profile "dev-open" cho phép tất cả request (không cần auth)

---

## 🚀 Cách test API:

### **Option 1: Test với Authentication (Production mode)**

#### 1. Khởi động server bình thường:
```bash
./gradlew bootRun
```

#### 2. Đăng nhập để lấy JWT token:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_password"
  }'
```

#### 3. Sử dụng token cho các API protected:
```bash
# Test Employee API
curl -X GET http://localhost:8080/api/employees \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test Loyalty Points API  
curl -X GET http://localhost:8080/api/loyalty-points/customers/1/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### **Option 2: Test không cần Authentication (Development mode)**

#### 1. Khởi động server với profile dev-open:
```bash
./gradlew bootRun --args='--spring.profiles.active=dev-open'
```

#### 2. Test trực tiếp mà không cần token:
```bash
# Test Employee API
curl -X GET http://localhost:8080/api/employees

# Test Loyalty Points API
curl -X GET http://localhost:8080/api/loyalty-points/customers/1/history

# Test tạo employee
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nhanvien01",
    "email": "nv01@yummypet.com",
    "password": "password123",
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789",
    "hireDate": "2024-06-21",
    "salary": 15000000,
    "position": "Nhân viên bán hàng",
    "department": "Kinh doanh"
  }'
```

---

## 📋 Test Cases cần thực hiện:

### **Employee APIs:**
- [ ] GET `/api/employees` - Lấy danh sách nhân viên
- [ ] GET `/api/employees/{id}` - Lấy thông tin nhân viên theo ID
- [ ] GET `/api/employees/code/{code}` - Lấy thông tin theo mã
- [ ] POST `/api/employees` - Tạo nhân viên mới
- [ ] PUT `/api/employees/{id}` - Cập nhật thông tin
- [ ] DELETE `/api/employees/{id}` - Xóa nhân viên

### **Loyalty Points APIs:**
- [ ] GET `/api/loyalty-points/customers/{id}/history` - Lịch sử tích điểm
- [ ] GET `/api/loyalty-points/customers/{id}/history/type/earned` - Lọc theo loại
- [ ] GET `/api/loyalty-points/customers/{id}/history/date-range` - Lọc theo thời gian
- [ ] GET `/api/loyalty-points/customers/{id}/summary` - Tóm tắt điểm
- [ ] GET `/api/loyalty-points/customers/{id}/recent` - Giao dịch gần nhất
- [ ] GET `/api/loyalty-points/types` - Danh sách loại điểm

### **Public APIs (không cần auth):**
- [ ] GET `/api/products` - Danh sách sản phẩm
- [ ] GET `/api/pets` - Danh sách thú cưng
- [ ] GET `/api/services` - Danh sách dịch vụ
- [ ] GET `/api/categories` - Danh sách danh mục

---

## 🔍 Troubleshooting:

### **Lỗi 403 Forbidden:**
- Kiểm tra JWT token có hợp lệ không
- Kiểm tra role trong database (admin, staff, customer)
- Đảm bảo role được lưu đúng format trong database

### **Lỗi 401 Unauthorized:**
- Kiểm tra JWT token trong header Authorization
- Đảm bảo format: `Bearer YOUR_JWT_TOKEN`

### **Lỗi 404 Not Found:**
- Kiểm tra URL endpoint có đúng không
- Đảm bảo server đang chạy trên port 8080

### **Test nhanh không cần auth:**
```bash
# Khởi động với profile dev-open
./gradlew bootRun --args='--spring.profiles.active=dev-open'

# Test ngay
curl http://localhost:8080/api/employees
curl http://localhost:8080/api/loyalty-points/types
```

---

## 📝 Lưu ý quan trọng:

1. **Profile dev-open** chỉ dùng cho development/testing
2. **Production** luôn sử dụng authentication đầy đủ
3. **Database** cần có dữ liệu roles và users để test
4. **JWT token** có thời hạn, cần renew khi hết hạn

## 🎯 Kết quả mong đợi:
- Tất cả API trả về status 200 với dữ liệu JSON
- Error responses có format chuẩn với success: false
- Pagination hoạt động đúng cho các API list
