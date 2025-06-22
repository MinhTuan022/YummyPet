# API Thống kê - YummyPet

## Tổng quan
API này cung cấp các endpoint để lấy thống kê về doanh thu, khách hàng, sản phẩm, dịch vụ và nhân viên trong hệ thống YummyPet.

## Authentication
Tất cả các API đều yêu cầu JWT token trong header:
```
Authorization: Bearer <jwt_token>
```

## Quyền truy cập
- **ADMIN**: Toàn quyền truy cập tất cả thống kê
- **STAFF**: Truy cập các thống kê cơ bản (trừ một số thống kê nhạy cảm)

---

## 1. Thống kê Dashboard tổng quan

### Endpoint
```
GET /api/statistics/dashboard
```

### Quyền truy cập
- ADMIN, STAFF

### Response thành công (200)
```json
{
    "success": true,
    "message": "Lấy thống kê dashboard thành công",
    "data": {
        "salesStatistics": {
            "totalRevenue": 50000000,
            "totalOrders": 150,
            "monthlyRevenue": 15000000,
            "monthlyOrders": 45,
            "dailyRevenue": 2000000,
            "dailyOrders": 8,
            "averageOrderValue": 333333.33,
            "conversionRate": 85.5
        },
        "customerStatistics": {
            "totalCustomers": 500,
            "newCustomersThisMonth": 25,
            "activeCustomers": 120,
            "loyalCustomers": 80,
            "averageLoyaltyPoints": 1250,
            "totalLoyaltyPointsIssued": 50000,
            "totalLoyaltyPointsRedeemed": 15000
        },
        "totalProducts": 200,
        "totalServices": 15,
        "totalEmployees": 8,
        "todayRevenue": 2000000,
        "todayOrders": 8,
        "todayNewCustomers": 3,
        "topSellingProduct": {
            "productId": 1,
            "productName": "Thức ăn cho chó Royal Canin",
            "categoryName": "Thức ăn",
            "totalSold": 150,
            "stockQuantity": 50,
            "revenue": 15000000,
            "profit": 3000000
        },
        "mostBookedService": {
            "serviceId": 1,
            "serviceName": "Tắm rửa cho chó",
            "totalBookings": 80,
            "completedBookings": 75,
            "cancelledBookings": 5,
            "completionRate": 93.75,
            "totalRevenue": 8000000
        }
    }
}
```

---

## 2. Thống kê doanh thu theo khoảng thời gian

### Endpoint
```
GET /api/statistics/sales
```

### Tham số
- `startDate` (query, required): Ngày bắt đầu (YYYY-MM-DD)
- `endDate` (query, required): Ngày kết thúc (YYYY-MM-DD)

### Quyền truy cập
- ADMIN, STAFF

### Ví dụ
```
GET /api/statistics/sales?startDate=2024-06-01&endDate=2024-06-30
```

### Response thành công (200)
```json
{
    "success": true,
    "message": "Lấy thống kê doanh thu thành công",
    "data": {
        "totalRevenue": 50000000,
        "totalOrders": 150,
        "monthlyRevenue": 15000000,
        "monthlyOrders": 45,
        "dailyRevenue": 2000000,
        "dailyOrders": 8,
        "averageOrderValue": 333333.33,
        "conversionRate": 85.5
    }
}
```

---

## 3. Thống kê khách hàng

### Endpoint
```
GET /api/statistics/customers
```

### Quyền truy cập
- ADMIN, STAFF

### Response thành công (200)
```json
{
    "success": true,
    "message": "Lấy thống kê khách hàng thành công",
    "data": {
        "totalCustomers": 500,
        "newCustomersThisMonth": 25,
        "activeCustomers": 120,
        "loyalCustomers": 80,
        "averageLoyaltyPoints": 1250,
        "totalLoyaltyPointsIssued": 50000,
        "totalLoyaltyPointsRedeemed": 15000
    }
}
```

---

## 4. Thống kê sản phẩm bán chạy

### Endpoint
```
GET /api/statistics/products/top-selling
```

### Tham số
- `limit` (query, optional): Số sản phẩm trả về (mặc định 10, tối đa 100)

### Quyền truy cập
- ADMIN, STAFF

### Response thành công (200)
```json
{
    "success": true,
    "message": "Lấy thống kê sản phẩm bán chạy thành công",
    "data": [
        {
            "productId": 1,
            "productName": "Thức ăn cho chó Royal Canin",
            "categoryName": "Thức ăn",
            "totalSold": 150,
            "stockQuantity": 50,
            "revenue": 15000000,
            "profit": 3000000
        },
        {
            "productId": 2,
            "productName": "Đồ chơi cho mèo",
            "categoryName": "Đồ chơi",
            "totalSold": 120,
            "stockQuantity": 30,
            "revenue": 6000000,
            "profit": 1200000
        }
    ]
}
```

---

## 5. Thống kê tồn kho

### Endpoint
```
GET /api/statistics/products/inventory
```

### Quyền truy cập
- ADMIN, STAFF

### Response thành công (200)
```json
{
    "success": true,
    "message": "Lấy thống kê tồn kho thành công",
    "data": {
        "totalProducts": 200,
        "lowStockCount": 15
    }
}
```

---

## 6. Thống kê dịch vụ

### Endpoint
```
GET /api/statistics/services
```

### Quyền truy cập
- ADMIN, STAFF

### Response thành công (200)
```json
{
    "success": true,
    "message": "Lấy thống kê dịch vụ thành công",
    "data": [
        {
            "serviceId": 1,
            "serviceName": "Tắm rửa cho chó",
            "totalBookings": 80,
            "completedBookings": 75,
            "cancelledBookings": 5,
            "completionRate": 93.75,
            "totalRevenue": 8000000
        },
        {
            "serviceId": 2,
            "serviceName": "Cắt tỉa lông",
            "totalBookings": 60,
            "completedBookings": 55,
            "cancelledBookings": 5,
            "completionRate": 91.67,
            "totalRevenue": 9000000
        }
    ]
}
```

---

## 7. Thống kê doanh thu hàng tháng

### Endpoint
```
GET /api/statistics/sales/monthly
```

### Tham số
- `year` (query, optional): Năm cần thống kê (mặc định năm hiện tại)

### Quyền truy cập
- ADMIN only

### Response thành công (200)
```json
{
    "success": true,
    "message": "Lấy thống kê doanh thu hàng tháng thành công",
    "data": [
        {
            "month": 1,
            "monthName": "Tháng 1",
            "year": 2024,
            "totalOrders": 25,
            "totalRevenue": 8000000,
            "averageOrderValue": 320000
        },
        {
            "month": 2,
            "monthName": "Tháng 2",
            "year": 2024,
            "totalOrders": 30,
            "totalRevenue": 12000000,
            "averageOrderValue": 400000
        }
    ]
}
```

---

## 8. Thống kê tăng trưởng

### Endpoint
```
GET /api/statistics/growth
```

### Quyền truy cập
- ADMIN only

### Response thành công (200)
```json
{
    "success": true,
    "message": "Lấy thống kê tăng trưởng thành công",
    "data": {
        "revenueGrowthPercentage": 15.5,
        "revenueGrowthAmount": 2000000,
        "orderGrowthPercentage": 12.0,
        "orderGrowthAmount": 8,
        "customerGrowthPercentage": 20.0,
        "customerGrowthAmount": 5,
        "currentMonthRevenue": 15000000,
        "previousMonthRevenue": 13000000,
        "currentMonthOrders": 75,
        "previousMonthOrders": 67,
        "currentMonthCustomers": 30,
        "previousMonthCustomers": 25
    }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
    "success": false,
    "message": "Ngày bắt đầu không thể sau ngày kết thúc"
}
```

### 403 Forbidden
```json
{
    "success": false,
    "message": "Không có quyền truy cập"
}
```

### 500 Internal Server Error
```json
{
    "success": false,
    "message": "Lỗi khi lấy thống kê: <chi tiết lỗi>"
}
```

---

## Lưu ý quan trọng

1. **Phân quyền**: Một số API chỉ dành cho ADMIN
2. **Date format**: Sử dụng ISO date format (YYYY-MM-DD)
3. **Performance**: Thống kê có thể mất thời gian với dữ liệu lớn
4. **Caching**: Nên implement caching cho các thống kê ít thay đổi
5. **Real-time**: Dữ liệu thống kê cập nhật theo real-time

## Use Cases phổ biến

1. **Dashboard admin**: Sử dụng `/dashboard` để hiển thị tổng quan
2. **Báo cáo doanh thu**: Sử dụng `/sales` với date range
3. **Quản lý tồn kho**: Sử dụng `/products/inventory` và `/products/top-selling`
4. **Đánh giá hiệu suất**: Sử dụng `/growth` để so sánh các kỳ
5. **Lập kế hoạch**: Sử dụng `/sales/monthly` để phân tích xu hướng
