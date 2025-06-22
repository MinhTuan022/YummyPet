# Test API Lịch sử Tích điểm - YummyPet

## Chuẩn bị test

### 1. Đăng nhập để lấy JWT Token
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "username": "customer01",
    "password": "password123"
}
```

Hoặc với quyền admin:
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "username": "admin",
    "password": "admin_password"
}
```

---

## Test Cases

### 1. Test lấy lịch sử tích điểm của khách hàng
```bash
GET http://localhost:8080/api/loyalty-points/customers/1/history?page=0&size=10
Authorization: Bearer YOUR_JWT_TOKEN
```

**Kết quả mong đợi:**
- Status: 200 OK
- Dữ liệu: Danh sách lịch sử tích điểm có phân trang
- Sắp xếp: Theo thời gian tạo mới nhất

### 2. Test lấy lịch sử theo loại điểm (chỉ điểm tích được)
```bash
GET http://localhost:8080/api/loyalty-points/customers/1/history/type/earned?page=0&size=10
Authorization: Bearer YOUR_JWT_TOKEN
```

**Kết quả mong đợi:**
- Status: 200 OK
- Dữ liệu: Chỉ các record có type = "earned"

### 3. Test lấy lịch sử theo loại điểm (chỉ điểm đã sử dụng)
```bash
GET http://localhost:8080/api/loyalty-points/customers/1/history/type/redeemed?page=0&size=10
Authorization: Bearer YOUR_JWT_TOKEN
```

### 4. Test lấy lịch sử theo khoảng thời gian
```bash
GET http://localhost:8080/api/loyalty-points/customers/1/history/date-range?startDate=2024-06-01&endDate=2024-06-30&page=0&size=10
Authorization: Bearer YOUR_JWT_TOKEN
```

**Kết quả mong đợi:**
- Status: 200 OK
- Dữ liệu: Chỉ các record trong khoảng thời gian 01/06/2024 - 30/06/2024

### 5. Test với khoảng thời gian không hợp lệ
```bash
GET http://localhost:8080/api/loyalty-points/customers/1/history/date-range?startDate=2024-06-30&endDate=2024-06-01
Authorization: Bearer YOUR_JWT_TOKEN
```

**Kết quả mong đợi:**
- Status: 400 Bad Request
- Message: "Ngày bắt đầu không thể sau ngày kết thúc"

### 6. Test lấy tóm tắt điểm tích lũy
```bash
GET http://localhost:8080/api/loyalty-points/customers/1/summary
Authorization: Bearer YOUR_JWT_TOKEN
```

**Kết quả mong đợi:**
- Status: 200 OK
- Dữ liệu: Thông tin tóm tắt điểm hiện tại và lịch sử

### 7. Test lấy 10 giao dịch gần nhất
```bash
GET http://localhost:8080/api/loyalty-points/customers/1/recent
Authorization: Bearer YOUR_JWT_TOKEN
```

**Kết quả mong đợi:**
- Status: 200 OK
- Dữ liệu: Tối đa 10 record gần nhất

### 8. Test lấy danh sách loại điểm
```bash
GET http://localhost:8080/api/loyalty-points/types
Authorization: Bearer YOUR_JWT_TOKEN
```

**Kết quả mong đợi:**
- Status: 200 OK
- Dữ liệu: Array các loại điểm ["earned", "redeemed", "expired", "adjusted", "restored"]

---

## Test phân quyền

### 9. Test customer xem lịch sử của customer khác (không được phép)
```bash
GET http://localhost:8080/api/loyalty-points/customers/999/history
Authorization: Bearer CUSTOMER_JWT_TOKEN
```

**Kết quả mong đợi:**
- Status: 403 Forbidden
- Message: "Không có quyền truy cập"

### 10. Test admin xem lịch sử của bất kỳ customer nào (được phép)
```bash
GET http://localhost:8080/api/loyalty-points/customers/1/history
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Kết quả mong đợi:**
- Status: 200 OK
- Dữ liệu: Lịch sử tích điểm của customer ID 1

---

## Test error cases

### 11. Test với customer ID không tồn tại
```bash
GET http://localhost:8080/api/loyalty-points/customers/99999/history
Authorization: Bearer YOUR_JWT_TOKEN
```

**Kết quả mong đợi:**
- Status: 404 Not Found
- Message: "Không tìm thấy khách hàng với id: 99999"

### 12. Test với loại điểm không hợp lệ
```bash
GET http://localhost:8080/api/loyalty-points/customers/1/history/type/invalid_type
Authorization: Bearer YOUR_JWT_TOKEN
```

**Kết quả mong đợi:**
- Status: 400 Bad Request
- Message: Lỗi về enum không hợp lệ

### 13. Test không có JWT token
```bash
GET http://localhost:8080/api/loyalty-points/customers/1/history
```

**Kết quả mong đợi:**
- Status: 401 Unauthorized

---

## Dữ liệu test mẫu

Để test hiệu quả, cần có dữ liệu mẫu trong database:

### Tạo customer test:
```sql
INSERT INTO customers (customer_code, full_name, email, loyalty_points) 
VALUES ('CUST001', 'Nguyễn Văn Test', 'test@example.com', 1500);
```

### Tạo lịch sử tích điểm test:
```sql
INSERT INTO loyalty_point_history (customer_id, points, point_type, description, created_at) VALUES
(1, 100, 'earned', 'Tích điểm từ đơn hàng ORD001', NOW()),
(1, -50, 'redeemed', 'Sử dụng điểm cho đơn hàng ORD002', NOW()),
(1, 200, 'earned', 'Tích điểm từ đơn hàng ORD003', NOW()),
(1, -20, 'expired', 'Điểm hết hạn', NOW()),
(1, 150, 'earned', 'Tích điểm từ đơn hàng ORD004', NOW());
```

---

## Checklist test

- [ ] Lấy lịch sử tích điểm cơ bản
- [ ] Lấy lịch sử theo từng loại điểm  
- [ ] Lấy lịch sử theo khoảng thời gian
- [ ] Tóm tắt điểm tích lũy
- [ ] 10 giao dịch gần nhất
- [ ] Danh sách loại điểm
- [ ] Phân quyền Customer
- [ ] Phân quyền Admin/Staff
- [ ] Error handling (customer không tồn tại)
- [ ] Error handling (date range không hợp lệ)
- [ ] Pagination hoạt động đúng
- [ ] Sorting theo thời gian

## Lưu ý
- Thay `YOUR_JWT_TOKEN` bằng token thật từ response login
- Thay customer ID bằng ID thật trong database
- Kiểm tra database có dữ liệu loyalty_point_history để test
