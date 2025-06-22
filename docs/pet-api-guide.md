# Hướng dẫn sử dụng API Pet (Thú cưng)

API Pet cung cấp các endpoint để quản lý thú cưng trong hệ thống YummyPet, bao gồm thông tin cơ bản, hình ảnh, tình trạng sức khỏe và trạng thái của thú cưng.

## Cấu trúc dữ liệu

### Pet (Thú cưng)

```json
{
  "id": 1,
  "petCode": "PT-20230215-ABCD",
  "category": {
    "id": 1,
    "name": "Chó",
    "description": "Các loài chó cảnh",
    "isActive": true
  },
  "name": "Lucky",
  "species": "Canine",
  "breed": "Corgi",
  "gender": "male",
  "ageMonths": 12,
  "weight": 8.5,
  "color": "Nâu vàng",
  "price": 5000000,
  "description": "Chó Corgi thuần chủng 1 tuổi, đã tiêm phòng đầy đủ",
  "arrivalDate": "2023-02-15",
  "status": "available",
  "certificateInfo": "Giấy chứng nhận sức khỏe, tiêm phòng",
  "healthStatus": "excellent",
  "vaccinationStatus": "fully_vaccinated",
  "isActive": true,
  "createdAt": "2023-02-15T10:30:00",
  "updatedAt": "2023-02-15T10:30:00",
  "images": [
    {
      "id": 1,
      "petId": 1,
      "imageUrl": "https://example.com/images/pets/corgi-1.jpg",
      "altText": "Corgi đứng nghiêng",
      "isPrimary": true,
      "displayOrder": 0,
      "createdAt": "2023-02-15T10:35:00"
    }
  ],
  "primaryImageUrl": "https://example.com/images/pets/corgi-1.jpg"
}
```

### PetRequest (Yêu cầu tạo/cập nhật thú cưng)

```json
{
  "name": "Lucky",
  "categoryId": 1,
  "species": "Canine",
  "breed": "Corgi",
  "gender": "male",
  "ageMonths": 12,
  "weight": 8.5,
  "color": "Nâu vàng",
  "price": 5000000,
  "costPrice": 3500000,
  "description": "Chó Corgi thuần chủng 1 tuổi, đã tiêm phòng đầy đủ",
  "arrivalDate": "2023-02-15",
  "status": "available",
  "certificateInfo": "Giấy chứng nhận sức khỏe, tiêm phòng",
  "healthStatus": "excellent",
  "vaccinationStatus": "fully_vaccinated",
  "isActive": true,
  "images": [
    {
      "imageUrl": "https://example.com/images/pets/corgi-1.jpg",
      "altText": "Corgi đứng nghiêng",
      "isPrimary": true,
      "displayOrder": 0
    },
    {
      "imageUrl": "https://example.com/images/pets/corgi-2.jpg",
      "altText": "Corgi đứng thẳng",
      "isPrimary": false,
      "displayOrder": 1
    }
  ]
}
```

### PetImageRequest (Yêu cầu thêm ảnh thú cưng)

```json
{
  "imageUrl": "https://example.com/images/pets/corgi-2.jpg",
  "altText": "Corgi đứng thẳng",
  "isPrimary": false,
  "displayOrder": 1
}
```

## Các giá trị Enum

### Gender (Giới tính)
- `male`: Đực
- `female`: Cái
- `other`: Khác

### PetStatus (Trạng thái thú cưng)
- `available`: Còn hàng
- `sold`: Đã bán

### HealthStatus (Tình trạng sức khỏe)
- `excellent`: Tuyệt vời
- `good`: Tốt
- `fair`: Bình thường
- `poor`: Kém
- `sick`: Bệnh
- `unknown`: Chưa xác định

### VaccinationStatus (Trạng thái tiêm chủng)
- `fully_vaccinated`: Đã tiêm đầy đủ
- `partially_vaccinated`: Đã tiêm một phần
- `not_vaccinated`: Chưa tiêm
- `overdue`: Quá hạn tiêm
- `unknown`: Chưa xác định

## Các Endpoint API

### 1. Lấy danh sách thú cưng (có phân trang)

- **URL**: `/api/pets`
- **Method**: `GET`
- **Query Parameters**:
  - `page` (mặc định: 0): Số trang
  - `size` (mặc định: 10): Số lượng kết quả trên mỗi trang
  - `sortBy` (tùy chọn): Trường sắp xếp
  - `sortDir` (mặc định: ASC): Hướng sắp xếp (ASC hoặc DESC)
  - `onlyActive` (tùy chọn): Boolean, chỉ hiển thị thú cưng đang hoạt động
  - `onlyAvailable` (tùy chọn): Boolean, chỉ hiển thị thú cưng còn hàng

#### Ví dụ Request

```
GET /api/pets?page=0&size=10&sortBy=price&sortDir=DESC&onlyActive=true&onlyAvailable=true
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Lấy danh sách thú cưng thành công",
  "data": {
    "content": [
      {
        "id": 1,
        "petCode": "PT-20230215-ABCD",
        "category": {
          "id": 1,
          "name": "Chó",
          "description": "Các loài chó cảnh",
          "isActive": true
        },
        "name": "Lucky",
        "species": "Canine",
        "breed": "Corgi",
        // ... thông tin khác
      },
      // ... các thú cưng khác
    ],
    // ... thông tin phân trang
  }
}
```

### 2. Lấy thông tin chi tiết thú cưng theo ID

- **URL**: `/api/pets/{id}`
- **Method**: `GET`
- **Path Variables**:
  - `id`: ID của thú cưng cần lấy

#### Ví dụ Request

```
GET /api/pets/1
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Lấy thông tin thú cưng thành công",
  "data": {
    "id": 1,
    "petCode": "PT-20230215-ABCD",
    "category": {
      "id": 1,
      "name": "Chó",
      "description": "Các loài chó cảnh",
      "isActive": true
    },
    "name": "Lucky",
    // ... thông tin khác
    "images": [
      {
        "id": 1,
        "petId": 1,
        "imageUrl": "https://example.com/images/pets/corgi-1.jpg",
        "altText": "Corgi đứng nghiêng",
        "isPrimary": true,
        "displayOrder": 0,
        "createdAt": "2023-02-15T10:35:00"
      }
    ],
    "primaryImageUrl": "https://example.com/images/pets/corgi-1.jpg"
  }
}
```

### 3. Lấy thông tin thú cưng theo mã

- **URL**: `/api/pets/code/{petCode}`
- **Method**: `GET`
- **Path Variables**:
  - `petCode`: Mã của thú cưng cần lấy

#### Ví dụ Request

```
GET /api/pets/code/PT-20230215-ABCD
```

#### Ví dụ Response

Tương tự như lấy thông tin theo ID.

### 4. Lấy danh sách thú cưng theo danh mục

- **URL**: `/api/pets/category/{categoryId}`
- **Method**: `GET`
- **Path Variables**:
  - `categoryId`: ID của danh mục
- **Query Parameters**:
  - `page` (mặc định: 0): Số trang
  - `size` (mặc định: 10): Số lượng kết quả trên mỗi trang

#### Ví dụ Request

```
GET /api/pets/category/1?page=0&size=10
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Lấy danh sách thú cưng theo danh mục thành công",
  "data": {
    "content": [
      // ... các thú cưng trong danh mục
    ],
    // ... thông tin phân trang
  }
}
```

### 5. Tìm kiếm thú cưng

- **URL**: `/api/pets/search`
- **Method**: `GET`
- **Query Parameters**:
  - `name` (tùy chọn): Tên thú cưng (tìm kiếm mờ)
  - `species` (tùy chọn): Loài (tìm kiếm mờ)
  - `breed` (tùy chọn): Giống (tìm kiếm mờ)
  - `categoryId` (tùy chọn): ID danh mục
  - `gender` (tùy chọn): Giới tính
  - `minAgeMonths` (tùy chọn): Tuổi tối thiểu (tháng)
  - `maxAgeMonths` (tùy chọn): Tuổi tối đa (tháng)
  - `minPrice` (tùy chọn): Giá tối thiểu
  - `maxPrice` (tùy chọn): Giá tối đa
  - `status` (tùy chọn): Trạng thái (available, sold)
  - `healthStatus` (tùy chọn): Tình trạng sức khỏe
  - `vaccinationStatus` (tùy chọn): Trạng thái tiêm chủng
  - `isActive` (tùy chọn): Trạng thái hoạt động
  - `page` (mặc định: 0): Số trang
  - `size` (mặc định: 10): Số lượng kết quả trên mỗi trang
  - `sortBy` (mặc định: id): Trường sắp xếp
  - `sortDir` (mặc định: ASC): Hướng sắp xếp

#### Ví dụ Request

```
GET /api/pets/search?breed=corgi&minAgeMonths=6&maxAgeMonths=24&minPrice=3000000&maxPrice=6000000&status=available&healthStatus=excellent&page=0&size=10
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Tìm kiếm thú cưng thành công",
  "data": {
    "content": [
      // ... kết quả tìm kiếm
    ],
    // ... thông tin phân trang
  }
}
```

### 6. Lấy danh sách thú cưng theo khoảng ngày nhập

- **URL**: `/api/pets/arrival-date-range`
- **Method**: `GET`
- **Query Parameters**:
  - `startDate`: Ngày bắt đầu (định dạng ISO: YYYY-MM-DD)
  - `endDate`: Ngày kết thúc (định dạng ISO: YYYY-MM-DD)

#### Ví dụ Request

```
GET /api/pets/arrival-date-range?startDate=2023-01-01&endDate=2023-03-01
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Lấy danh sách thú cưng theo ngày nhập thành công",
  "data": [
    // ... danh sách thú cưng
  ]
}
```

### 7. Lấy danh sách thú cưng theo giá tăng dần

- **URL**: `/api/pets/price/asc`
- **Method**: `GET`

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Lấy danh sách thú cưng theo giá tăng dần thành công",
  "data": [
    // ... danh sách thú cưng sắp xếp theo giá tăng dần
  ]
}
```

### 8. Lấy danh sách thú cưng theo giá giảm dần

- **URL**: `/api/pets/price/desc`
- **Method**: `GET`

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Lấy danh sách thú cưng theo giá giảm dần thành công",
  "data": [
    // ... danh sách thú cưng sắp xếp theo giá giảm dần
  ]
}
```

### 9. Tạo thú cưng mới

- **URL**: `/api/pets`
- **Method**: `POST`
- **Request Body**: PetRequest

#### Ví dụ Request

```json
{
  "name": "Lucky",
  "categoryId": 1,
  "species": "Canine",
  "breed": "Corgi",
  "gender": "male",
  "ageMonths": 12,
  "weight": 8.5,
  "color": "Nâu vàng",
  "price": 5000000,
  "costPrice": 3500000,
  "description": "Chó Corgi thuần chủng 1 tuổi, đã tiêm phòng đầy đủ",
  "arrivalDate": "2023-02-15",
  "status": "available",
  "certificateInfo": "Giấy chứng nhận sức khỏe, tiêm phòng",
  "healthStatus": "excellent",
  "vaccinationStatus": "fully_vaccinated",
  "isActive": true
}
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Tạo thú cưng thành công",
  "data": {
    "id": 1,
    "petCode": "PT-20230621-WXYZ",
    // ... thông tin khác của thú cưng
  }
}
```

### 10. Cập nhật thông tin thú cưng

- **URL**: `/api/pets/{id}`
- **Method**: `PUT`
- **Path Variables**:
  - `id`: ID của thú cưng cần cập nhật
- **Request Body**: PetRequest

#### Ví dụ Request

```json
{
  "name": "Lucky Updated",
  "categoryId": 1,
  "species": "Canine",
  "breed": "Corgi",
  "gender": "male",
  "ageMonths": 14,
  "weight": 9.0,
  "color": "Nâu vàng",
  "price": 5500000,
  "costPrice": 3500000,
  "description": "Chó Corgi thuần chủng 14 tháng tuổi, đã tiêm phòng đầy đủ",
  "arrivalDate": "2023-02-15",
  "status": "available",
  "certificateInfo": "Giấy chứng nhận sức khỏe, tiêm phòng",
  "healthStatus": "excellent",
  "vaccinationStatus": "fully_vaccinated",
  "isActive": true
}
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Cập nhật thú cưng thành công",
  "data": {
    "id": 1,
    "petCode": "PT-20230215-ABCD",
    "name": "Lucky Updated",
    // ... thông tin khác đã cập nhật
  }
}
```

### 11. Bật/tắt trạng thái thú cưng

- **URL**: `/api/pets/{id}/toggle-status`
- **Method**: `PATCH`
- **Path Variables**:
  - `id`: ID của thú cưng cần thay đổi trạng thái

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Vô hiệu hóa thú cưng thành công",
  "data": {
    "id": 1,
    "petCode": "PT-20230215-ABCD",
    // ... thông tin khác
    "isActive": false
  }
}
```

### 12. Đánh dấu thú cưng đã bán

- **URL**: `/api/pets/{id}/mark-sold`
- **Method**: `PATCH`
- **Path Variables**:
  - `id`: ID của thú cưng

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Đánh dấu thú cưng đã bán thành công",
  "data": {
    "id": 1,
    "petCode": "PT-20230215-ABCD",
    // ... thông tin khác
    "status": "sold"
  }
}
```

### 13. Đánh dấu thú cưng còn hàng

- **URL**: `/api/pets/{id}/mark-available`
- **Method**: `PATCH`
- **Path Variables**:
  - `id`: ID của thú cưng

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Đánh dấu thú cưng còn hàng thành công",
  "data": {
    "id": 1,
    "petCode": "PT-20230215-ABCD",
    // ... thông tin khác
    "status": "available"
  }
}
```

### 14. Xóa thú cưng

- **URL**: `/api/pets/{id}`
- **Method**: `DELETE`
- **Path Variables**:
  - `id`: ID của thú cưng cần xóa

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Xóa thú cưng thành công",
  "data": null
}
```

### 15. Lấy danh sách hình ảnh thú cưng

- **URL**: `/api/pets/{petId}/images`
- **Method**: `GET`
- **Path Variables**:
  - `petId`: ID của thú cưng

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Lấy danh sách hình ảnh thú cưng thành công",
  "data": [
    {
      "id": 1,
      "petId": 1,
      "imageUrl": "https://example.com/images/pets/corgi-1.jpg",
      "altText": "Corgi đứng nghiêng",
      "isPrimary": true,
      "displayOrder": 0,
      "createdAt": "2023-02-15T10:35:00"
    },
    {
      "id": 2,
      "petId": 1,
      "imageUrl": "https://example.com/images/pets/corgi-2.jpg",
      "altText": "Corgi đứng thẳng",
      "isPrimary": false,
      "displayOrder": 1,
      "createdAt": "2023-02-15T10:36:00"
    }
  ]
}
```

### 16. Thêm hình ảnh thú cưng

- **URL**: `/api/pets/{petId}/images`
- **Method**: `POST`
- **Path Variables**:
  - `petId`: ID của thú cưng
- **Request Body**: PetImageRequest

#### Ví dụ Request

```json
{
  "imageUrl": "https://example.com/images/pets/corgi-3.jpg",
  "altText": "Corgi đang nằm",
  "isPrimary": false,
  "displayOrder": 2
}
```

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Thêm hình ảnh thú cưng thành công",
  "data": {
    "id": 3,
    "petId": 1,
    "imageUrl": "https://example.com/images/pets/corgi-3.jpg",
    "altText": "Corgi đang nằm",
    "isPrimary": false,
    "displayOrder": 2,
    "createdAt": "2023-06-21T14:30:00"
  }
}
```

### 17. Xóa hình ảnh thú cưng

- **URL**: `/api/pets/images/{imageId}`
- **Method**: `DELETE`
- **Path Variables**:
  - `imageId`: ID của hình ảnh cần xóa

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Xóa hình ảnh thú cưng thành công",
  "data": null
}
```

### 18. Đặt hình ảnh làm ảnh đại diện

- **URL**: `/api/pets/{petId}/images/{imageId}/set-primary`
- **Method**: `PATCH`
- **Path Variables**:
  - `petId`: ID của thú cưng
  - `imageId`: ID của hình ảnh cần đặt làm ảnh đại diện

#### Ví dụ Response

```json
{
  "success": true,
  "message": "Đặt hình ảnh đại diện thành công",
  "data": {
    "id": 2,
    "petId": 1,
    "imageUrl": "https://example.com/images/pets/corgi-2.jpg",
    "altText": "Corgi đứng thẳng",
    "isPrimary": true,
    "displayOrder": 1,
    "createdAt": "2023-02-15T10:36:00"
  }
}
```

## Validation

API Pet thực hiện các kiểm tra sau:

1. Tên thú cưng không được để trống và không vượt quá 100 ký tự
2. Danh mục (categoryId) không được để trống và phải tồn tại
3. Loài (species) không được để trống và không vượt quá 50 ký tự
4. Giống (breed) không được vượt quá 50 ký tự
5. Số tháng tuổi (ageMonths) phải lớn hơn hoặc bằng 0
6. Cân nặng (weight) phải lớn hơn hoặc bằng 0
7. Giá (price) không được để trống và phải lớn hơn hoặc bằng 0
8. Giá nhập (costPrice) phải lớn hơn hoặc bằng 0
9. URL hình ảnh không được để trống khi thêm hình ảnh
10. Mã thú cưng (petCode) được tự động sinh theo định dạng PT-YYYYMMDD-XXXX (X là ký tự ngẫu nhiên)
11. Khi tạo mới hoặc cập nhật thú cưng, có thể gửi kèm danh sách hình ảnh. Nếu không có hình ảnh nào được đánh dấu là ảnh đại diện (isPrimary=true), hệ thống sẽ tự động chọn ảnh đầu tiên làm ảnh đại diện
