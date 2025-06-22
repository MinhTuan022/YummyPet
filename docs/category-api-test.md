# API Test Category YummyPet

## 1. Tạo danh mục cha/cấp cao nhất

### Tạo danh mục sản phẩm
```
POST http://localhost:8080/api/categories
Content-Type: application/json

{
  "name": "Thức ăn thú cưng",
  "description": "Danh mục các loại thức ăn cho thú cưng",
  "categoryType": "product",
  "isActive": true
}
```

### Tạo danh mục thú cưng
```
POST http://localhost:8080/api/categories
Content-Type: application/json

{
  "name": "Chó cảnh",
  "description": "Danh mục các loại chó cảnh",
  "categoryType": "pet",
  "isActive": true
}
```

## 2. Tạo danh mục con

```
POST http://localhost:8080/api/categories
Content-Type: application/json

{
  "name": "Thức ăn cho chó",
  "description": "Danh mục thức ăn dành cho chó",
  "parentId": 1,
  "categoryType": "product",
  "isActive": true
}
```

```
POST http://localhost:8080/api/categories
Content-Type: application/json

{
  "name": "Thức ăn cho mèo",
  "description": "Danh mục thức ăn dành cho mèo",
  "parentId": 1,
  "categoryType": "product",
  "isActive": true
}
```

```
POST http://localhost:8080/api/categories
Content-Type: application/json

{
  "name": "Chó Corgi",
  "description": "Danh mục chó Corgi",
  "parentId": 2,
  "categoryType": "pet",
  "isActive": true
}
```

## 3. Lấy danh sách danh mục

### Lấy tất cả danh mục
```
GET http://localhost:8080/api/categories/all
```

### Lấy danh mục theo loại
```
GET http://localhost:8080/api/categories/type/product
```

```
GET http://localhost:8080/api/categories/type/pet
```

### Lấy danh mục cấp cao nhất
```
GET http://localhost:8080/api/categories/top-level
```

### Lấy danh mục con
```
GET http://localhost:8080/api/categories/subcategories/1
```

## 4. Lấy chi tiết danh mục
```
GET http://localhost:8080/api/categories/1
```

## 5. Cập nhật danh mục
```
PUT http://localhost:8080/api/categories/3
Content-Type: application/json

{
  "name": "Thức ăn cao cấp cho chó",
  "description": "Danh mục thức ăn cao cấp dành cho chó",
  "parentId": 1,
  "categoryType": "product",
  "isActive": true
}
```

## 6. Vô hiệu hóa/Kích hoạt danh mục
```
PUT http://localhost:8080/api/categories/3/toggle-status
```

## 7. Xóa danh mục
```
DELETE http://localhost:8080/api/categories/3
```
