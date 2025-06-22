# Hướng dẫn Test API Service (Dịch vụ)

Tài liệu này hướng dẫn cách test các API liên quan đến dịch vụ trong hệ thống YummyPet.

## Yêu cầu

- Postman hoặc công cụ test API tương tự
- Hệ thống YummyPet đã được cài đặt và chạy (mặc định ở địa chỉ `http://localhost:8080`)
- Database đã được khởi tạo với script trong file `create_database.sql`

## Các bước test API Service

### 1. Lấy danh sách dịch vụ

#### Request

```
GET http://localhost:8080/api/services
```

Các tham số query tùy chọn:
- `page`: Số trang (mặc định: 0)
- `size`: Số lượng kết quả trên mỗi trang (mặc định: 10)
- `sortBy`: Trường sắp xếp (mặc định: id)
- `sortDir`: Hướng sắp xếp - ASC hoặc DESC (mặc định: ASC)
- `onlyActive`: Chỉ hiển thị dịch vụ đang hoạt động - true hoặc false

Thử nghiệm:
1. Lấy tất cả dịch vụ:
   ```
   GET http://localhost:8080/api/services
   ```

2. Lấy dịch vụ đang hoạt động với sắp xếp theo giá giảm dần:
   ```
   GET http://localhost:8080/api/services?onlyActive=true&sortBy=price&sortDir=DESC
   ```

3. Phân trang với 5 kết quả mỗi trang:
   ```
   GET http://localhost:8080/api/services?page=0&size=5
   ```

### 2. Lấy thông tin dịch vụ theo ID

#### Request

```
GET http://localhost:8080/api/services/{id}
```

Thử nghiệm:
1. Lấy dịch vụ với ID 1:
   ```
   GET http://localhost:8080/api/services/1
   ```

2. Thử với ID không tồn tại để xem xử lý lỗi:
   ```
   GET http://localhost:8080/api/services/999
   ```

### 3. Tìm kiếm dịch vụ

#### Request

```
GET http://localhost:8080/api/services/search
```

Các tham số query:
- `name`: Tìm kiếm theo tên (tìm kiếm mờ)
- `minPrice`: Giá tối thiểu
- `maxPrice`: Giá tối đa
- `minDuration`: Thời gian thực hiện tối thiểu (phút)
- `maxDuration`: Thời gian thực hiện tối đa (phút)
- `isActive`: Trạng thái dịch vụ
- `page`, `size`, `sortBy`, `sortDir`: Các tham số phân trang và sắp xếp

Thử nghiệm:
1. Tìm dịch vụ có tên chứa từ "tắm":
   ```
   GET http://localhost:8080/api/services/search?name=tắm
   ```

2. Tìm dịch vụ trong khoảng giá 100.000đ - 300.000đ:
   ```
   GET http://localhost:8080/api/services/search?minPrice=100000&maxPrice=300000
   ```

3. Tìm dịch vụ có thời gian thực hiện dưới 60 phút và đang hoạt động:
   ```
   GET http://localhost:8080/api/services/search?maxDuration=60&isActive=true
   ```

### 4. Lấy danh sách dịch vụ theo giá tăng dần

#### Request

```
GET http://localhost:8080/api/services/price/asc
```

### 5. Lấy danh sách dịch vụ theo giá giảm dần

#### Request

```
GET http://localhost:8080/api/services/price/desc
```

### 6. Lấy danh sách dịch vụ được đặt nhiều nhất

#### Request

```
GET http://localhost:8080/api/services/top-booked?limit=3
```

Tham số query:
- `limit`: Số lượng dịch vụ muốn lấy (mặc định: 5)

### 7. Tạo dịch vụ mới

#### Request

```
POST http://localhost:8080/api/services
Content-Type: application/json

{
  "name": "Cắt tỉa lông chuyên nghiệp",
  "description": "Dịch vụ cắt tỉa lông chuyên nghiệp cho các giống chó mèo",
  "price": 300000,
  "durationMinutes": 90,
  "isActive": true
}
```

Thử nghiệm validation:

1. Thử tạo dịch vụ không có tên:
```json
{
  "description": "Mô tả dịch vụ",
  "price": 150000,
  "durationMinutes": 45
}
```

2. Thử tạo dịch vụ với giá âm:
```json
{
  "name": "Dịch vụ test",
  "description": "Mô tả dịch vụ",
  "price": -50000,
  "durationMinutes": 45
}
```

3. Thử tạo dịch vụ với tên đã tồn tại (sau khi đã tạo thành công một dịch vụ):
```json
{
  "name": "Cắt tỉa lông chuyên nghiệp",
  "description": "Mô tả khác",
  "price": 350000,
  "durationMinutes": 100
}
```

### 8. Cập nhật thông tin dịch vụ

#### Request

```
PUT http://localhost:8080/api/services/{id}
Content-Type: application/json

{
  "name": "Cắt tỉa lông chuyên nghiệp VIP",
  "description": "Dịch vụ cắt tỉa lông cao cấp cho các giống chó mèo quý hiếm",
  "price": 350000,
  "durationMinutes": 100,
  "isActive": true
}
```

Thử nghiệm:
1. Cập nhật dịch vụ vừa tạo:
   ```
   PUT http://localhost:8080/api/services/[ID vừa tạo]
   ```
   với body JSON như trên.

2. Thử cập nhật dịch vụ không tồn tại:
   ```
   PUT http://localhost:8080/api/services/999
   ```

3. Thử validation tương tự như khi tạo dịch vụ.

### 9. Bật/tắt trạng thái dịch vụ

#### Request

```
PATCH http://localhost:8080/api/services/{id}/toggle-status
```

Thử nghiệm:
1. Bật/tắt trạng thái của dịch vụ vừa tạo:
   ```
   PATCH http://localhost:8080/api/services/[ID vừa tạo]/toggle-status
   ```

2. Kiểm tra lại trạng thái sau khi toggle:
   ```
   GET http://localhost:8080/api/services/[ID vừa tạo]
   ```

3. Toggle lần nữa và kiểm tra lại.

### 10. Xóa dịch vụ

#### Request

```
DELETE http://localhost:8080/api/services/{id}
```

Thử nghiệm:
1. Xóa dịch vụ vừa tạo:
   ```
   DELETE http://localhost:8080/api/services/[ID vừa tạo]
   ```

2. Kiểm tra xem dịch vụ còn tồn tại không:
   ```
   GET http://localhost:8080/api/services/[ID vừa tạo]
   ```

3. Thử xóa dịch vụ không tồn tại:
   ```
   DELETE http://localhost:8080/api/services/999
   ```

## Kịch bản test tích hợp

Sau đây là kịch bản test tích hợp để kiểm tra đầy đủ chu trình sử dụng API Service:

1. Lấy danh sách dịch vụ hiện có
2. Tạo một dịch vụ mới
3. Lấy thông tin chi tiết của dịch vụ vừa tạo
4. Cập nhật thông tin của dịch vụ đó
5. Tắt trạng thái hoạt động của dịch vụ (toggle-status)
6. Tìm kiếm dịch vụ với các bộ lọc
7. Xóa dịch vụ vừa tạo

## Kịch bản test tích hợp với Order

Để kiểm tra sự tích hợp giữa Service API và Order API:

1. Tạo một dịch vụ mới
2. Tạo một đơn hàng có chứa dịch vụ này (xem tài liệu hướng dẫn API Order)
3. Thử xóa dịch vụ đó và quan sát hệ thống hoạt động (nên chỉ vô hiệu hóa dịch vụ thay vì xóa hoàn toàn)
4. Kiểm tra đơn hàng xem dịch vụ vẫn còn trong đơn hàng không
5. Cập nhật thông tin dịch vụ (như giá) và kiểm tra xem đơn hàng đã tạo có bị ảnh hưởng không

## Kiểm tra hiệu suất đơn giản

Để kiểm tra hiệu suất cơ bản của các API dịch vụ:

1. Tạo nhiều dịch vụ (khoảng 50-100 bản ghi)
2. Thực hiện tìm kiếm với các bộ lọc khác nhau
3. Kiểm tra thời gian phản hồi của các API khi số lượng bản ghi lớn
4. Kiểm tra hoạt động phân trang với các kích thước trang khác nhau

## Lỗi thường gặp và cách xử lý

1. **Không tìm thấy dịch vụ (404 Not Found)**
   - Kiểm tra ID dịch vụ có tồn tại không
   - Kiểm tra xem dịch vụ đã bị xóa chưa

2. **Lỗi validation (400 Bad Request)**
   - Kiểm tra dữ liệu đầu vào theo các quy tắc validation đã được đề cập
   - Đảm bảo giá không âm, tên không trống, thời gian dương

3. **Trùng tên dịch vụ (409 Conflict)**
   - Sử dụng tên dịch vụ khác chưa tồn tại trong hệ thống
   - Hoặc cập nhật dịch vụ hiện có thay vì tạo mới

4. **Không thể xóa dịch vụ đang được sử dụng**
   - Thử vô hiệu hóa dịch vụ thay vì xóa hoàn toàn
   - Kiểm tra xem dịch vụ có đang được sử dụng trong đơn hàng nào không
