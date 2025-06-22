# API Quản lý Lịch sử Tích điểm - YummyPet

## Tổng quan
API này cung cấp các endpoint để quản lý và xem lịch sử tích điểm của khách hàng trong hệ thống YummyPet.

## Authentication
Tất cả các API đều yêu cầu JWT token trong header:
```
Authorization: Bearer <jwt_token>
```

## Quyền truy cập
- **ADMIN**: Toàn quyền truy cập tất cả khách hàng
- **STAFF**: Toàn quyền truy cập tất cả khách hàng  
- **CUSTOMER**: Chỉ được xem lịch sử tích điểm của chính mình

---

## 1. Lấy lịch sử tích điểm của khách hàng

### Endpoint
```
GET /api/loyalty-points/customers/{customerId}/history
```

### Tham số
- `customerId` (path): ID của khách hàng
- `page` (query, optional): Số trang (mặc định 0)
- `size` (query, optional): Số record mỗi trang (mặc định 20)
- `sort` (query, optional): Sắp xếp (mặc định createdAt,desc)

### Quyền truy cập
- ADMIN, STAFF: Toàn quyền
- CUSTOMER: Chỉ được xem của chính mình

### Response thành công (200)
```json
{
    "success": true,
    "message": "Lấy lịch sử tích điểm thành công",
    "data": {
        "content": [
            {
                "id": 1,
                "customerId": 123,
                "customerName": "Nguyễn Văn A",
                "points": 100,
                "type": "earned",
                "typeDescription": "Tích điểm",
                "orderId": 456,
                "orderCode": "ORD001",
                "description": "Tích điểm từ đơn hàng ORD001",
                "createdAt": "2024-06-21T10:30:00.000+00:00"
            }
        ],
        "pageable": {
            "pageNumber": 0,
            "pageSize": 20
        },
        "totalElements": 25,
        "totalPages": 2
    }
}
```

---

## 2. Lấy lịch sử tích điểm theo loại

### Endpoint
```
GET /api/loyalty-points/customers/{customerId}/history/type/{type}
```

### Tham số
- `customerId` (path): ID của khách hàng
- `type` (path): Loại điểm (earned, redeemed, expired, adjusted, restored)
- Pagination params: page, size, sort

### Loại điểm (LoyaltyPointType)
- `earned`: Tích điểm (từ mua hàng)
- `redeemed`: Đổi điểm (sử dụng điểm)
- `expired`: Hết hạn
- `adjusted`: Điều chỉnh (admin)
- `restored`: Khôi phục (từ đơn hàng bị hủy)

### Response
Tương tự API lấy lịch sử tích điểm nhưng chỉ chứa record của loại được chọn.

---

## 3. Lấy lịch sử tích điểm theo khoảng thời gian

### Endpoint
```
GET /api/loyalty-points/customers/{customerId}/history/date-range
```

### Tham số
- `customerId` (path): ID của khách hàng
- `startDate` (query): Ngày bắt đầu (format: YYYY-MM-DD)
- `endDate` (query): Ngày kết thúc (format: YYYY-MM-DD)
- Pagination params: page, size, sort

### Ví dụ
```
GET /api/loyalty-points/customers/123/history/date-range?startDate=2024-06-01&endDate=2024-06-30
```

### Response
Tương tự API lấy lịch sử tích điểm nhưng chỉ chứa record trong khoảng thời gian được chọn.

---

## 4. Lấy tóm tắt điểm tích lũy

### Endpoint
```
GET /api/loyalty-points/customers/{customerId}/summary
```

### Tham số
- `customerId` (path): ID của khách hàng

### Response thành công (200)
```json
{
    "success": true,
    "message": "Lấy tóm tắt điểm tích lũy thành công",
    "data": {
        "customerId": 123,
        "customerName": "Nguyễn Văn A",
        "currentPoints": 1250,
        "totalEarned": 2500,
        "totalRedeemed": 1000,
        "totalExpired": 200,
        "totalAdjusted": 50
    }
}
```

### Giải thích các trường
- `currentPoints`: Số điểm hiện tại
- `totalEarned`: Tổng điểm đã tích được
- `totalRedeemed`: Tổng điểm đã sử dụng
- `totalExpired`: Tổng điểm đã hết hạn
- `totalAdjusted`: Tổng điểm được điều chỉnh

---

## 5. Lấy 10 giao dịch điểm gần nhất

### Endpoint
```
GET /api/loyalty-points/customers/{customerId}/recent
```

### Tham số
- `customerId` (path): ID của khách hàng

### Response thành công (200)
```json
{
    "success": true,
    "message": "Lấy giao dịch điểm gần nhất thành công",
    "data": [
        {
            "id": 1,
            "customerId": 123,
            "customerName": "Nguyễn Văn A",
            "points": 100,
            "type": "earned",
            "typeDescription": "Tích điểm",
            "orderId": 456,
            "orderCode": "ORD001",
            "description": "Tích điểm từ đơn hàng ORD001",
            "createdAt": "2024-06-21T10:30:00.000+00:00"
        }
    ]
}
```

---

## 6. Lấy danh sách loại điểm tích lũy

### Endpoint
```
GET /api/loyalty-points/types
```

### Quyền truy cập
- ADMIN, STAFF, CUSTOMER

### Response thành công (200)
```json
{
    "success": true,
    "message": "Lấy danh sách loại điểm tích lũy thành công",
    "data": ["earned", "redeemed", "expired", "adjusted", "restored"]
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

### 404 Not Found
```json
{
    "success": false,
    "message": "Không tìm thấy khách hàng với ID: 123"
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
    "message": "Lỗi khi lấy lịch sử tích điểm: <chi tiết lỗi>"
}
```

---

## Lưu ý quan trọng

1. **Phân quyền**: Customer chỉ được xem lịch sử của chính mình
2. **Pagination**: Tất cả API list đều hỗ trợ phân trang
3. **Sorting**: Mặc định sắp xếp theo thời gian tạo giảm dần
4. **Date format**: Sử dụng ISO date format (YYYY-MM-DD) cho các tham số ngày
5. **Points**: Điểm âm thể hiện việc trừ điểm (redeemed, expired)

## Quy tắc tích điểm
- 1 điểm cho mỗi 10,000 VND chi tiêu
- Điểm có thể được sử dụng để giảm giá đơn hàng
- Điểm có thể hết hạn theo chính sách của cửa hàng
