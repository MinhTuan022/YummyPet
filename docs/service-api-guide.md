# Hướng dẫn sử dụng API Service (Dịch vụ)

API Service cung cấp các endpoint để quản lý dịch vụ trong hệ thống YummyPet. Các dịch vụ này có thể bao gồm tắm, cắt tỉa lông, spa, khám sức khỏe và các dịch vụ chăm sóc thú cưng khác.

## Cấu trúc dữ liệu

### Service (Dịch vụ)

```json
{
  "id": 1,
  "name": "Tắm và vệ sinh",
  "description": "Dịch vụ tắm, vệ sinh tai, mắt và cắt móng cho thú cưng",
  "price": 200000,
  "durationMinutes": 60,
  "isActive": true,
  "createdAt": "2023-06-01T08:30:00",
  "updatedAt": "2023-06-01T08:30:00"
}
```

### ServiceRequest (Yêu cầu tạo/cập nhật dịch vụ)

```json
{
  "name": "Tắm và vệ sinh",
  "description": "Dịch vụ tắm, vệ sinh tai, mắt và cắt móng cho thú cưng",
  "price": 200000,
  "durationMinutes": 60,
  "isActive": true
}
```

## Các Endpoint API

### 1. Lấy danh sách dịch vụ (có phân trang)

- **URL**: `/api/services`
- **Method**: `GET`
- **Query Parameters**:
  - `page` (mặc định: 0): Số trang
  - `size` (mặc định: 10): Số lượng kết quả trên mỗi trang
  - `sortBy` (tùy chọn): Trường sắp xếp
  - `sortDir` (mặc định: ASC): Hướng sắp xếp (ASC hoặc DESC)
  - `onlyActive` (tùy chọn): Boolean, chỉ hiển thị dịch vụ đang hoạt động

#### Ví dụ Request

```
GET /api/services?page=0&size=10&sortBy=price&sortDir=DESC&onlyActive=true
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Lấy danh sách dịch vụ thành công",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Tắm và vệ sinh",
        "description": "Dịch vụ tắm, vệ sinh tai, mắt và cắt móng cho thú cưng",
        "price": 200000,
        "durationMinutes": 60,
        "isActive": true,
        "createdAt": "2023-06-01T08:30:00",
        "updatedAt": "2023-06-01T08:30:00"
      },
      // ... các dịch vụ khác
    ],
    "pageable": {
      "sort": {
        "sorted": true,
        "unsorted": false,
        "empty": false
      },
      "pageNumber": 0,
      "pageSize": 10,
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "totalPages": 2,
    "totalElements": 15,
    "last": false,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "first": true,
    "number": 0,
    "numberOfElements": 10,
    "size": 10,
    "empty": false
  }
}
```

### 2. Lấy thông tin chi tiết dịch vụ theo ID

- **URL**: `/api/services/{id}`
- **Method**: `GET`
- **Path Variables**:
  - `id`: ID của dịch vụ cần lấy

#### Ví dụ Request

```
GET /api/services/1
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Lấy thông tin dịch vụ thành công",
  "data": {
    "id": 1,
    "name": "Tắm và vệ sinh",
    "description": "Dịch vụ tắm, vệ sinh tai, mắt và cắt móng cho thú cưng",
    "price": 200000,
    "durationMinutes": 60,
    "isActive": true,
    "createdAt": "2023-06-01T08:30:00",
    "updatedAt": "2023-06-01T08:30:00"
  }
}
```

### 3. Tìm kiếm dịch vụ

- **URL**: `/api/services/search`
- **Method**: `GET`
- **Query Parameters**:
  - `name` (tùy chọn): Tên dịch vụ (tìm kiếm mờ)
  - `minPrice` (tùy chọn): Giá tối thiểu
  - `maxPrice` (tùy chọn): Giá tối đa
  - `minDuration` (tùy chọn): Thời gian thực hiện tối thiểu (phút)
  - `maxDuration` (tùy chọn): Thời gian thực hiện tối đa (phút)
  - `isActive` (tùy chọn): Trạng thái dịch vụ (true/false)
  - `page` (mặc định: 0): Số trang
  - `size` (mặc định: 10): Số lượng kết quả trên mỗi trang
  - `sortBy` (mặc định: name): Trường sắp xếp
  - `sortDir` (mặc định: ASC): Hướng sắp xếp (ASC hoặc DESC)

#### Ví dụ Request

```
GET /api/services/search?name=tắm&minPrice=100000&maxPrice=300000&page=0&size=10
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Tìm kiếm dịch vụ thành công",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Tắm và vệ sinh",
        "description": "Dịch vụ tắm, vệ sinh tai, mắt và cắt móng cho thú cưng",
        "price": 200000,
        "durationMinutes": 60,
        "isActive": true,
        "createdAt": "2023-06-01T08:30:00",
        "updatedAt": "2023-06-01T08:30:00"
      },
      // ... các dịch vụ khác
    ],
    "pageable": {
      // ... thông tin phân trang
    },
    "totalPages": 1,
    "totalElements": 3,
    // ... thông tin phân trang khác
  }
}
```

### 4. Lấy danh sách dịch vụ theo giá tăng dần

- **URL**: `/api/services/price/asc`
- **Method**: `GET`

#### Ví dụ Request

```
GET /api/services/price/asc
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Lấy danh sách dịch vụ theo giá tăng dần thành công",
  "data": [
    {
      "id": 3,
      "name": "Cắt móng",
      "description": "Dịch vụ cắt móng cho thú cưng",
      "price": 50000,
      "durationMinutes": 15,
      "isActive": true,
      "createdAt": "2023-06-01T09:30:00",
      "updatedAt": "2023-06-01T09:30:00"
    },
    // ... các dịch vụ khác theo giá tăng dần
  ]
}
```

### 5. Lấy danh sách dịch vụ theo giá giảm dần

- **URL**: `/api/services/price/desc`
- **Method**: `GET`

#### Ví dụ Request

```
GET /api/services/price/desc
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Lấy danh sách dịch vụ theo giá giảm dần thành công",
  "data": [
    {
      "id": 5,
      "name": "Spa cao cấp",
      "description": "Gói dịch vụ spa cao cấp dành cho thú cưng",
      "price": 500000,
      "durationMinutes": 120,
      "isActive": true,
      "createdAt": "2023-06-01T10:30:00",
      "updatedAt": "2023-06-01T10:30:00"
    },
    // ... các dịch vụ khác theo giá giảm dần
  ]
}
```

### 6. Lấy danh sách dịch vụ được đặt nhiều nhất

- **URL**: `/api/services/top-booked`
- **Method**: `GET`
- **Query Parameters**:
  - `limit` (mặc định: 5): Số lượng dịch vụ muốn lấy

#### Ví dụ Request

```
GET /api/services/top-booked?limit=3
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Lấy danh sách dịch vụ được đặt nhiều nhất thành công",
  "data": [
    {
      "id": 1,
      "name": "Tắm và vệ sinh",
      "description": "Dịch vụ tắm, vệ sinh tai, mắt và cắt móng cho thú cưng",
      "price": 200000,
      "durationMinutes": 60,
      "isActive": true,
      "createdAt": "2023-06-01T08:30:00",
      "updatedAt": "2023-06-01T08:30:00"
    },
    // ... các dịch vụ khác được đặt nhiều nhất
  ]
}
```

### 7. Tạo dịch vụ mới

- **URL**: `/api/services`
- **Method**: `POST`
- **Request Body**: ServiceRequest

#### Ví dụ Request

```json
{
  "name": "Cắt tỉa lông chuyên nghiệp",
  "description": "Dịch vụ cắt tỉa lông chuyên nghiệp cho các giống chó mèo",
  "price": 300000,
  "durationMinutes": 90,
  "isActive": true
}
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Tạo dịch vụ thành công",
  "data": {
    "id": 6,
    "name": "Cắt tỉa lông chuyên nghiệp",
    "description": "Dịch vụ cắt tỉa lông chuyên nghiệp cho các giống chó mèo",
    "price": 300000,
    "durationMinutes": 90,
    "isActive": true,
    "createdAt": "2023-06-15T14:30:00",
    "updatedAt": "2023-06-15T14:30:00"
  }
}
```

### 8. Cập nhật thông tin dịch vụ

- **URL**: `/api/services/{id}`
- **Method**: `PUT`
- **Path Variables**:
  - `id`: ID của dịch vụ cần cập nhật
- **Request Body**: ServiceRequest

#### Ví dụ Request

```json
{
  "name": "Cắt tỉa lông chuyên nghiệp VIP",
  "description": "Dịch vụ cắt tỉa lông cao cấp cho các giống chó mèo quý hiếm",
  "price": 350000,
  "durationMinutes": 100,
  "isActive": true
}
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Cập nhật dịch vụ thành công",
  "data": {
    "id": 6,
    "name": "Cắt tỉa lông chuyên nghiệp VIP",
    "description": "Dịch vụ cắt tỉa lông cao cấp cho các giống chó mèo quý hiếm",
    "price": 350000,
    "durationMinutes": 100,
    "isActive": true,
    "createdAt": "2023-06-15T14:30:00",
    "updatedAt": "2023-06-15T15:45:00"
  }
}
```

### 9. Bật/tắt trạng thái dịch vụ

- **URL**: `/api/services/{id}/toggle-status`
- **Method**: `PATCH`
- **Path Variables**:
  - `id`: ID của dịch vụ cần thay đổi trạng thái

#### Ví dụ Request

```
PATCH /api/services/6/toggle-status
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Vô hiệu hóa dịch vụ thành công",
  "data": {
    "id": 6,
    "name": "Cắt tỉa lông chuyên nghiệp VIP",
    "description": "Dịch vụ cắt tỉa lông cao cấp cho các giống chó mèo quý hiếm",
    "price": 350000,
    "durationMinutes": 100,
    "isActive": false,
    "createdAt": "2023-06-15T14:30:00",
    "updatedAt": "2023-06-15T16:00:00"
  }
}
```

### 10. Xóa dịch vụ

- **URL**: `/api/services/{id}`
- **Method**: `DELETE`
- **Path Variables**:
  - `id`: ID của dịch vụ cần xóa

#### Ví dụ Request

```
DELETE /api/services/6
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Xóa dịch vụ thành công",
  "data": null
}
```

## Validation

API Service thực hiện các kiểm tra sau:

1. Tên dịch vụ không được trống và không vượt quá 200 ký tự
2. Giá dịch vụ không được để trống và phải lớn hơn hoặc bằng 0
3. Thời gian thực hiện phải ít nhất 1 phút (mặc định 30 phút nếu không cung cấp)
4. Không được tạo hai dịch vụ với cùng tên
5. Khi xóa dịch vụ, hệ thống sẽ kiểm tra xem dịch vụ có đang được sử dụng không trước khi thực hiện xóa hoàn toàn. Nếu đã được sử dụng, hệ thống sẽ chỉ vô hiệu hóa dịch vụ thay vì xóa hoàn toàn.
