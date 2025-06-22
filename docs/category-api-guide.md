# Hướng dẫn sử dụng API Category trong YummyPet

Tài liệu này mô tả các API để quản lý danh mục (Category) trong hệ thống YummyPet.

## 1. Lấy danh sách danh mục

### Danh sách danh mục (có phân trang)
**GET /api/categories**

**Parameters:**
- `page`: Số trang (mặc định 0)
- `size`: Số lượng danh mục mỗi trang (mặc định 20)
- `sort`: Sắp xếp (ví dụ: `name,asc` hoặc `createdAt,desc`)

**Response:**
```json
{
  "success": true,
  "message": "Danh sách danh mục",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Thức ăn cho chó",
        "description": "Các sản phẩm thức ăn dành cho chó",
        "parentId": null,
        "parentName": null,
        "categoryType": "product",
        "isActive": true,
        "createdAt": "2023-06-01T10:00:00",
        "updatedAt": "2023-06-01T10:00:00"
      },
      // ... các danh mục khác
    ],
    "pageable": { ... },
    "totalElements": 50,
    "totalPages": 3,
    "size": 20,
    "number": 0,
    "sort": { ... },
    "numberOfElements": 20,
    "first": true,
    "last": false,
    "empty": false
  }
}
```

### Lấy tất cả danh mục (không phân trang)
**GET /api/categories/all**

**Response:**
```json
{
  "success": true,
  "message": "Danh sách tất cả danh mục",
  "data": [
    {
      "id": 1,
      "name": "Thức ăn cho chó",
      "description": "Các sản phẩm thức ăn dành cho chó",
      "parentId": null,
      "parentName": null,
      "categoryType": "product",
      "isActive": true,
      "createdAt": "2023-06-01T10:00:00",
      "updatedAt": "2023-06-01T10:00:00"
    },
    // ... các danh mục khác
  ]
}
```

### Lấy danh mục theo loại
**GET /api/categories/type/{type}**

`{type}` có thể là: `product` hoặc `pet`

**Response:**
```json
{
  "success": true,
  "message": "Danh sách danh mục theo loại: product",
  "data": [
    {
      "id": 1,
      "name": "Thức ăn cho chó",
      "description": "Các sản phẩm thức ăn dành cho chó",
      "parentId": null,
      "parentName": null,
      "categoryType": "product",
      "isActive": true,
      "createdAt": "2023-06-01T10:00:00",
      "updatedAt": "2023-06-01T10:00:00"
    },
    // ... các danh mục khác
  ]
}
```

### Lấy danh mục cấp cao nhất (không có danh mục cha)
**GET /api/categories/top-level**

**Response:**
```json
{
  "success": true,
  "message": "Danh sách danh mục cấp cao nhất",
  "data": [
    {
      "id": 1,
      "name": "Thức ăn cho chó",
      "description": "Các sản phẩm thức ăn dành cho chó",
      "parentId": null,
      "parentName": null,
      "categoryType": "product",
      "isActive": true,
      "createdAt": "2023-06-01T10:00:00",
      "updatedAt": "2023-06-01T10:00:00"
    },
    // ... các danh mục khác
  ]
}
```

### Lấy danh mục con của một danh mục
**GET /api/categories/subcategories/{parentId}**

**Response:**
```json
{
  "success": true,
  "message": "Danh sách danh mục con",
  "data": [
    {
      "id": 5,
      "name": "Thức ăn hạt cho chó",
      "description": "Các sản phẩm thức ăn hạt dành cho chó",
      "parentId": 1,
      "parentName": "Thức ăn cho chó",
      "categoryType": "product",
      "isActive": true,
      "createdAt": "2023-06-01T10:00:00",
      "updatedAt": "2023-06-01T10:00:00"
    },
    // ... các danh mục con khác
  ]
}
```

## 2. Lấy chi tiết danh mục

**GET /api/categories/{id}**

**Response:**
```json
{
  "success": true,
  "message": "Chi tiết danh mục",
  "data": {
    "id": 1,
    "name": "Thức ăn cho chó",
    "description": "Các sản phẩm thức ăn dành cho chó",
    "parentId": null,
    "parentName": null,
    "categoryType": "product",
    "isActive": true,
    "createdAt": "2023-06-01T10:00:00",
    "updatedAt": "2023-06-01T10:00:00"
  }
}
```

## 3. Tạo danh mục mới

**POST /api/categories**

**Request Body:**
```json
{
  "name": "Thức ăn cho mèo",
  "description": "Các sản phẩm thức ăn dành cho mèo",
  "parentId": null,
  "categoryType": "product",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo danh mục thành công",
  "data": {
    "id": 2,
    "name": "Thức ăn cho mèo",
    "description": "Các sản phẩm thức ăn dành cho mèo",
    "parentId": null,
    "parentName": null,
    "categoryType": "product",
    "isActive": true,
    "createdAt": "2023-06-21T14:30:00",
    "updatedAt": "2023-06-21T14:30:00"
  }
}
```

## 4. Cập nhật danh mục

**PUT /api/categories/{id}**

**Request Body:**
```json
{
  "name": "Thức ăn cho mèo (cập nhật)",
  "description": "Các sản phẩm thức ăn dành cho mèo đã cập nhật",
  "parentId": 1,
  "categoryType": "product",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật danh mục thành công",
  "data": {
    "id": 2,
    "name": "Thức ăn cho mèo (cập nhật)",
    "description": "Các sản phẩm thức ăn dành cho mèo đã cập nhật",
    "parentId": 1,
    "parentName": "Thức ăn cho chó",
    "categoryType": "product",
    "isActive": true,
    "createdAt": "2023-06-21T14:30:00",
    "updatedAt": "2023-06-21T14:35:00"
  }
}
```

## 5. Xóa danh mục

**DELETE /api/categories/{id}**

**Response:**
```json
{
  "success": true,
  "message": "Xóa danh mục thành công",
  "data": null
}
```

## 6. Bật/tắt trạng thái danh mục

**PUT /api/categories/{id}/toggle-status**

**Response:**
```json
{
  "success": true,
  "message": "Danh mục đã bị vô hiệu hóa",
  "data": {
    "id": 2,
    "name": "Thức ăn cho mèo",
    "description": "Các sản phẩm thức ăn dành cho mèo",
    "parentId": null,
    "parentName": null,
    "categoryType": "product",
    "isActive": false,
    "createdAt": "2023-06-21T14:30:00",
    "updatedAt": "2023-06-21T14:40:00"
  }
}
```

## Lưu ý:

1. Tất cả các request yêu cầu xác thực JWT token.
2. Khi tạo danh mục con, loại của danh mục con phải trùng với loại của danh mục cha.
3. Không thể đặt một danh mục làm cha của chính nó.
4. Nếu muốn bỏ mối quan hệ cha-con, hãy gửi `parentId: null` trong request cập nhật.
