# API Test Product YummyPet

## 1. Tạo sản phẩm mới

```
POST http://localhost:8080/api/products
Content-Type: application/json

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

```
POST http://localhost:8080/api/products
Content-Type: application/json

{
  "name": "Pedigree Adult",
  "description": "Thức ăn hạt cho chó trưởng thành",
  "price": 250000,
  "costPrice": 180000,
  "categoryId": 1,
  "stockQuantity": 100,
  "minStockLevel": 20,
  "sku": "PD-MA-10KG",
  "barcode": "8850124501234",
  "weight": 10.0,
  "brand": "Pedigree",
  "originCountry": "Thailand",
  "expiryDate": "2024-06-30",
  "imageUrl": "https://example.com/images/pedigree-adult.jpg",
  "isActive": true
}
```

## 2. Lấy danh sách sản phẩm

### Danh sách có phân trang
```
GET http://localhost:8080/api/products?page=0&size=20&sort=name,asc
```

### Lấy sản phẩm theo danh mục
```
GET http://localhost:8080/api/products/category/1?page=0&size=20
```

### Tìm kiếm sản phẩm
```
GET http://localhost:8080/api/products/search?name=royal&minPrice=500000&maxPrice=800000
```

### Lấy sản phẩm sắp hết hàng
```
GET http://localhost:8080/api/products/low-stock
```

### Lấy sản phẩm đã hết hàng
```
GET http://localhost:8080/api/products/out-of-stock
```

### Lấy sản phẩm hết hạn
```
GET http://localhost:8080/api/products/expired
```

### Lấy sản phẩm bán chạy
```
GET http://localhost:8080/api/products/top-selling?limit=5
```

## 3. Lấy chi tiết sản phẩm

### Theo ID
```
GET http://localhost:8080/api/products/1
```

### Theo SKU
```
GET http://localhost:8080/api/products/sku/RC-MA-15KG
```

### Theo mã vạch
```
GET http://localhost:8080/api/products/barcode/3182550402170
```

## 4. Cập nhật sản phẩm

```
PUT http://localhost:8080/api/products/1
Content-Type: application/json

{
  "name": "Royal Canin Medium Adult (Cập nhật)",
  "description": "Thức ăn hạt cao cấp cho chó trưởng thành kích cỡ vừa",
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

### Cập nhật một sản phẩm - Nhập kho
```
PUT http://localhost:8080/api/products/1/stock?quantity=10
```

### Cập nhật một sản phẩm - Xuất kho
```
PUT http://localhost:8080/api/products/1/stock?quantity=-5
```

### Cập nhật nhiều sản phẩm
```
POST http://localhost:8080/api/product-stock/batch-update
Content-Type: application/json

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

## 6. Vô hiệu hóa/Kích hoạt sản phẩm
```
PUT http://localhost:8080/api/products/1/toggle-status
```

## 7. Xóa sản phẩm (thực chất là vô hiệu hóa)
```
DELETE http://localhost:8080/api/products/1
```
