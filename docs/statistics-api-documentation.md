# Tài liệu API Thống kê - YummyPet

## Giới thiệu

Hệ thống API thống kê của YummyPet cung cấp các endpoint để truy xuất dữ liệu thống kê và báo cáo về hoạt động kinh doanh. API này giúp quản lý và phân tích dữ liệu về doanh thu, khách hàng, sản phẩm, dịch vụ và nhân viên trong hệ thống.

## Xác thực

Tất cả các API đều yêu cầu JWT token trong header:
```
Authorization: Bearer <jwt_token>
```

## Phân quyền truy cập

- **ADMIN**: Có quyền truy cập tất cả các API thống kê
- **STAFF**: Có quyền truy cập các API thống kê cơ bản, ngoại trừ một số API nhạy cảm như thống kê tăng trưởng và doanh thu hàng tháng

## Danh sách API

### 1. Thống kê Dashboard tổng quan

Cung cấp thống kê tổng quan cho dashboard chính của hệ thống.

#### Endpoint
```
GET /api/statistics/dashboard
```

#### Quyền truy cập
- ADMIN, STAFF

#### Response (200 OK)
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
            "growthRate": 5.3
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
            "totalServices": 15
        }
    }
}
```

### 2. Thống kê doanh thu theo khoảng thời gian

Cung cấp thống kê doanh thu trong khoảng thời gian chỉ định.

#### Endpoint
```
GET /api/statistics/sales
```

#### Tham số
| Tên | Loại | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| startDate | query | Có | Ngày bắt đầu (format: YYYY-MM-DD) |
| endDate | query | Có | Ngày kết thúc (format: YYYY-MM-DD) |

#### Quyền truy cập
- ADMIN, STAFF

#### Ví dụ
```
GET /api/statistics/sales?startDate=2025-06-01&endDate=2025-06-22
```

#### Response (200 OK)
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
        "growthRate": 5.3
    }
}
```

### 3. Thống kê khách hàng

Cung cấp thống kê về khách hàng trong hệ thống.

#### Endpoint
```
GET /api/statistics/customers
```

#### Quyền truy cập
- ADMIN, STAFF

#### Response (200 OK)
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

### 4. Thống kê sản phẩm bán chạy

Cung cấp danh sách các sản phẩm bán chạy nhất.

#### Endpoint
```
GET /api/statistics/products/top-selling
```

#### Tham số
| Tên | Loại | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| limit | query | Không | Số lượng sản phẩm trả về (mặc định: 10, tối đa: 100) |

#### Quyền truy cập
- ADMIN, STAFF

#### Response (200 OK)
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

### 5. Thống kê tồn kho

Cung cấp thống kê tổng quan về tồn kho.

#### Endpoint
```
GET /api/statistics/products/inventory
```

#### Quyền truy cập
- ADMIN, STAFF

#### Response (200 OK)
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

### 6. Thống kê dịch vụ

Cung cấp thống kê về dịch vụ được đặt trong hệ thống.

#### Endpoint
```
GET /api/statistics/services
```

#### Quyền truy cập
- ADMIN, STAFF

#### Response (200 OK)
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
            "totalServices": 15
        },
        {
            "serviceId": 2,
            "serviceName": "Cắt tỉa lông",
            "totalBookings": 60,
            "completedBookings": 55,
            "cancelledBookings": 5,
            "completionRate": 91.67,
            "totalServices": 15
        }
    ]
}
```

### 7. Thống kê doanh thu hàng tháng

Cung cấp thống kê doanh thu theo từng tháng trong năm.

#### Endpoint
```
GET /api/statistics/sales/monthly
```

#### Tham số
| Tên | Loại | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| year | query | Không | Năm cần thống kê (mặc định: năm hiện tại) |

#### Quyền truy cập
- ADMIN only

#### Response (200 OK)
```json
{
    "success": true,
    "message": "Lấy thống kê doanh thu hàng tháng thành công",
    "data": [
        {
            "month": 1,
            "monthName": "Tháng 1",
            "year": 2025,
            "totalOrders": 25,
            "totalRevenue": 8000000,
            "averageOrderValue": 320000
        },
        {
            "month": 2,
            "monthName": "Tháng 2",
            "year": 2025,
            "totalOrders": 30,
            "totalRevenue": 12000000,
            "averageOrderValue": 400000
        }
    ]
}
```

### 8. Thống kê tăng trưởng

Cung cấp thống kê về tăng trưởng so với kỳ trước đó.

#### Endpoint
```
GET /api/statistics/growth
```

#### Quyền truy cập
- ADMIN only

#### Response (200 OK)
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

## Phản hồi lỗi

### 400 Bad Request
Trả về khi có lỗi trong tham số request.
```json
{
    "success": false,
    "message": "Ngày bắt đầu không thể sau ngày kết thúc"
}
```

### 403 Forbidden
Trả về khi người dùng không có quyền truy cập API.
```json
{
    "success": false,
    "message": "Không có quyền truy cập"
}
```

### 500 Internal Server Error
Trả về khi có lỗi xảy ra trong quá trình xử lý.
```json
{
    "success": false,
    "message": "Lỗi khi lấy thống kê: <chi tiết lỗi>"
}
```

## Cấu trúc dữ liệu

### SalesStatisticsDTO
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| totalRevenue | BigDecimal | Tổng doanh thu |
| totalOrders | Long | Tổng số đơn hàng |
| monthlyRevenue | BigDecimal | Doanh thu tháng hiện tại |
| monthlyOrders | Long | Số đơn hàng tháng hiện tại |
| dailyRevenue | BigDecimal | Doanh thu ngày hiện tại |
| dailyOrders | Long | Số đơn hàng ngày hiện tại |
| averageOrderValue | BigDecimal | Giá trị đơn hàng trung bình |
| growthRate | BigDecimal | Tỷ lệ tăng trưởng so với tháng trước (%) |

### CustomerStatisticsDTO
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| totalCustomers | Long | Tổng số khách hàng |
| newCustomersThisMonth | Long | Số khách hàng mới trong tháng |
| activeCustomers | Long | Số khách hàng hoạt động (có đơn hàng trong 30 ngày) |
| loyalCustomers | Long | Số khách hàng trung thành (≥ 3 đơn hàng) |
| averageLoyaltyPoints | Integer | Điểm tích lũy trung bình |
| totalLoyaltyPointsIssued | Long | Tổng điểm tích lũy đã phát hành |
| totalLoyaltyPointsRedeemed | Long | Tổng điểm tích lũy đã sử dụng |

### ProductStatisticsDTO
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| productId | Integer | ID sản phẩm |
| productName | String | Tên sản phẩm |
| categoryName | String | Tên danh mục |
| totalSold | Long | Tổng số đã bán |
| stockQuantity | Integer | Số lượng tồn kho |
| revenue | BigDecimal | Doanh thu |
| profit | BigDecimal | Lợi nhuận |
| totalProducts | Integer | Tổng số sản phẩm (chỉ có trong API inventory) |
| lowStockCount | Long | Số sản phẩm sắp hết hàng (chỉ có trong API inventory) |

### ServiceStatisticsDTO
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| serviceId | Integer | ID dịch vụ |
| serviceName | String | Tên dịch vụ |
| totalBookings | Long | Tổng số lượt đặt |
| completedBookings | Long | Số lượt đặt đã hoàn thành |
| cancelledBookings | Long | Số lượt đặt đã hủy |
| completionRate | Double | Tỷ lệ hoàn thành (%) |
| totalServices | Integer | Tổng số dịch vụ |

### MonthlySalesDTO
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| month | Integer | Tháng (1-12) |
| monthName | String | Tên tháng (VD: "Tháng 1") |
| year | Integer | Năm |
| totalOrders | Long | Tổng số đơn hàng |
| totalRevenue | BigDecimal | Tổng doanh thu |
| averageOrderValue | BigDecimal | Giá trị đơn hàng trung bình |

### GrowthStatisticsDTO
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| revenueGrowthPercentage | BigDecimal | Tỷ lệ tăng trưởng doanh thu (%) |
| revenueGrowthAmount | BigDecimal | Số tiền tăng trưởng doanh thu |
| orderGrowthPercentage | Double | Tỷ lệ tăng trưởng đơn hàng (%) |
| orderGrowthAmount | Long | Số lượng đơn hàng tăng |
| customerGrowthPercentage | Double | Tỷ lệ tăng trưởng khách hàng (%) |
| customerGrowthAmount | Long | Số lượng khách hàng tăng |
| currentMonthRevenue | BigDecimal | Doanh thu tháng hiện tại |
| previousMonthRevenue | BigDecimal | Doanh thu tháng trước |
| currentMonthOrders | Long | Số đơn hàng tháng hiện tại |
| previousMonthOrders | Long | Số đơn hàng tháng trước |
| currentMonthCustomers | Long | Số khách hàng mới tháng hiện tại |
| previousMonthCustomers | Long | Số khách hàng mới tháng trước |

## Lưu ý triển khai

1. **Phạm vi thời gian**: Các thống kê mặc định sẽ áp dụng cho dữ liệu trong khoảng thời gian hiện tại (ngày hiện tại, tháng hiện tại) trừ khi có chỉ định khác qua tham số.

2. **Hiệu suất**: Các truy vấn thống kê có thể mất nhiều thời gian với dữ liệu lớn. Tối ưu hóa truy vấn và chỉ mục cơ sở dữ liệu là cần thiết để đảm bảo hiệu suất.

3. **Đơn vị tiền tệ**: Tất cả các giá trị tiền tệ đều được tính bằng VNĐ.

4. **Độ chính xác**: Các giá trị phần trăm được làm tròn đến 2 chữ số thập phân.

5. **Khung thời gian của dữ liệu**:
   - Thống kê sản phẩm bán chạy: dữ liệu 3 tháng gần nhất
   - Thống kê dịch vụ: dữ liệu 3 tháng gần nhất
   - Khách hàng hoạt động: khách hàng có đơn hàng trong 30 ngày gần nhất
