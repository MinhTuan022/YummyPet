# Hướng dẫn sử dụng API Product trong YummyPet

Tài liệu này mô tả các API để quản lý sản phẩm (Product) trong hệ thống YummyPet.

## 1. Lấy danh sách sản phẩm

### Danh sách sản phẩm (có phân trang)
**GET /api/products**

**Parameters:**
- `page`: Số trang (mặc định 0)
- `size`: Số lượng sản phẩm mỗi trang (mặc định 20)
- `sort`: Sắp xếp (ví dụ: `name,asc` hoặc `price,desc`)

**Response:**
```json
{
  "success": true,
  "message": "Danh sách sản phẩm",
  "data": {
    "content": [
      {
        "id": 1,
        "categoryId": 1,
        "categoryName": "Thức ăn cho chó",
        "name": "Royal Canin Medium Adult",
        "description": "Thức ăn hạt cho chó trưởng thành",
        "price": 750000,
        "costPrice": 600000,
        "stockQuantity": 50,
        "minStockLevel": 10,
        "sku": "RC-MA-15KG",
        "barcode": "3182550402170",
        "weight": 15.0,
        "brand": "Royal Canin",
        "originCountry": "France",
        "expiryDate": "2024-12-31",
        "imageUrl": "https://example.com/images/royal-canin-medium-adult.jpg",
        "isActive": true,
        "createdAt": "2023-06-01T10:00:00",
        "updatedAt": "2023-06-01T10:00:00",
        "stockStatus": "In Stock"
      },
      // ... các sản phẩm khác
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

### Tìm kiếm sản phẩm theo nhiều điều kiện
**GET /api/products/search**

**Parameters:**
- `name`: Tên sản phẩm (tìm kiếm mờ)
- `categoryId`: ID danh mục
- `minPrice`: Giá thấp nhất
- `maxPrice`: Giá cao nhất
- `brand`: Thương hiệu
- `isActive`: Trạng thái (true/false)
- `page`: Số trang
- `size`: Số lượng mỗi trang
- `sort`: Sắp xếp

**Example:**
```
GET /api/products/search?name=royal&minPrice=500000&maxPrice=1000000&brand=royal&page=0&size=20&sort=price,desc
```

### Lấy sản phẩm theo danh mục
**GET /api/products/category/{categoryId}**

**Parameters:**
- `page`: Số trang
- `size`: Số lượng mỗi trang
- `sort`: Sắp xếp

### Lấy sản phẩm sắp hết hàng
**GET /api/products/low-stock**

### Lấy sản phẩm đã hết hàng
**GET /api/products/out-of-stock**

### Lấy sản phẩm đã hết hạn
**GET /api/products/expired**

### Lấy sản phẩm bán chạy nhất
**GET /api/products/top-selling**

**Parameters:**
- `limit`: Số lượng sản phẩm muốn lấy (mặc định 10)

## 2. Lấy chi tiết sản phẩm

### Theo ID
**GET /api/products/{id}**

### Theo SKU
**GET /api/products/sku/{sku}**

### Theo mã vạch
**GET /api/products/barcode/{barcode}**

## 3. Tạo sản phẩm mới

**POST /api/products**

**Request Body:**
```json
{
  "name": "Royal Canin Medium Adult",
  "description": "Thức ăn hạt cho chó trưởng thành",
  "price": 750000,
  "costPrice": 600000,
  "categoryId": 1,
  "stockQuantity": 50,
  "minStockLevel": 10,
  "sku": "RC-MA-15KG",
  "barcode": "3182550402170",
  "weight": 15.0,
  "brand": "Royal Canin",
  "originCountry": "France",
  "expiryDate": "2024-12-31",
  "imageUrl": "https://example.com/images/royal-canin-medium-adult.jpg",
  "isActive": true
}
```

## 4. Cập nhật sản phẩm

**PUT /api/products/{id}**

**Request Body:**
```json
{
  "name": "Royal Canin Medium Adult (Cập nhật)",
  "description": "Thức ăn hạt cho chó trưởng thành kích cỡ vừa",
  "price": 780000,
  "costPrice": 620000,
  "categoryId": 1,
  "stockQuantity": 60,
  "minStockLevel": 15,
  "sku": "RC-MA-15KG",
  "barcode": "3182550402170",
  "weight": 15.0,
  "brand": "Royal Canin",
  "originCountry": "France",
  "expiryDate": "2024-12-31",
  "imageUrl": "https://example.com/images/royal-canin-medium-adult-new.jpg",
  "isActive": true
}
```

## 5. Cập nhật số lượng tồn kho

### Cập nhật một sản phẩm
**PUT /api/products/{id}/stock?quantity={quantity}**

- `quantity`: Số lượng thay đổi (dương: nhập thêm, âm: xuất kho)

**Example:**
```
PUT /api/products/1/stock?quantity=10
PUT /api/products/1/stock?quantity=-5
```

### Cập nhật nhiều sản phẩm
**POST /api/product-stock/batch-update**

**Request Body:**
```json
[
  {
    "productId": 1,
    "quantity": 10,
    "note": "Nhập hàng ngày 21/06/2023"
  },
  {
    "productId": 2,
    "quantity": -5,
    "note": "Xuất hàng cho cửa hàng chi nhánh"
  }
]
```

## 6. Bật/tắt trạng thái sản phẩm

**PUT /api/products/{id}/toggle-status**

## 7. Xóa sản phẩm (thực chất là vô hiệu hóa)

**DELETE /api/products/{id}**

## Lưu ý:

1. Tất cả các request yêu cầu xác thực JWT token.
2. SKU và barcode phải duy nhất trong hệ thống.
3. Số lượng tồn kho không được âm.
4. Khi "xóa" sản phẩm, hệ thống chỉ vô hiệu hóa mà không xóa hoàn toàn.
5. Sản phẩm sẽ được đánh dấu là "sắp hết hàng" khi số lượng tồn kho nhỏ hơn hoặc bằng mức tồn kho tối thiểu.
