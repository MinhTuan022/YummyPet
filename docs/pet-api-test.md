# Hướng dẫn Test API Pet (Thú cưng)

Tài liệu này hướng dẫn cách test các API liên quan đến thú cưng trong hệ thống YummyPet.

## Yêu cầu

- Postman hoặc công cụ test API tương tự
- Hệ thống YummyPet đã được cài đặt và chạy (mặc định ở địa chỉ `http://localhost:8080`)
- Database đã được khởi tạo với script trong file `create_database.sql`

## Các bước test API Pet

### 1. Lấy danh sách thú cưng

#### Request

```
GET http://localhost:8080/api/pets
```

Các tham số query tùy chọn:
- `page`: Số trang (mặc định: 0)
- `size`: Số lượng kết quả trên mỗi trang (mặc định: 10)
- `sortBy`: Trường sắp xếp (mặc định: id)
- `sortDir`: Hướng sắp xếp - ASC hoặc DESC (mặc định: ASC)
- `onlyActive`: Chỉ hiển thị thú cưng đang hoạt động - true hoặc false
- `onlyAvailable`: Chỉ hiển thị thú cưng còn hàng - true hoặc false

Thử nghiệm:
1. Lấy tất cả thú cưng:
   ```
   GET http://localhost:8080/api/pets
   ```

2. Lấy thú cưng đang hoạt động và còn hàng với sắp xếp theo giá giảm dần:
   ```
   GET http://localhost:8080/api/pets?onlyActive=true&onlyAvailable=true&sortBy=price&sortDir=DESC
   ```

3. Phân trang với 5 kết quả mỗi trang:
   ```
   GET http://localhost:8080/api/pets?page=0&size=5
   ```

### 2. Lấy thông tin thú cưng theo ID

#### Request

```
GET http://localhost:8080/api/pets/{id}
```

Thử nghiệm:
1. Lấy thú cưng với ID 1:
   ```
   GET http://localhost:8080/api/pets/1
   ```

2. Thử với ID không tồn tại để xem xử lý lỗi:
   ```
   GET http://localhost:8080/api/pets/999
   ```

### 3. Lấy thông tin thú cưng theo mã

#### Request

```
GET http://localhost:8080/api/pets/code/{petCode}
```

Thử nghiệm:
1. Lấy thú cưng với mã từ database:
   ```
   GET http://localhost:8080/api/pets/code/PT-20230101-ABCD
   ```

2. Thử với mã không tồn tại:
   ```
   GET http://localhost:8080/api/pets/code/PT-20230101-XXXX
   ```

### 4. Lấy danh sách thú cưng theo danh mục

#### Request

```
GET http://localhost:8080/api/pets/category/{categoryId}
```

Thử nghiệm:
1. Lấy thú cưng thuộc danh mục "Chó" (ID: 1):
   ```
   GET http://localhost:8080/api/pets/category/1
   ```

2. Lấy thú cưng thuộc danh mục "Mèo" (ID: 2):
   ```
   GET http://localhost:8080/api/pets/category/2
   ```

### 5. Tìm kiếm thú cưng

#### Request

```
GET http://localhost:8080/api/pets/search
```

Các tham số query:
- `name`: Tên thú cưng (tìm kiếm mờ)
- `species`: Loài (tìm kiếm mờ)
- `breed`: Giống (tìm kiếm mờ)
- `categoryId`: ID danh mục
- `gender`: Giới tính (male, female, other)
- `minAgeMonths`, `maxAgeMonths`: Khoảng tuổi (tháng)
- `minPrice`, `maxPrice`: Khoảng giá
- `status`: Trạng thái (available, sold)
- `healthStatus`: Tình trạng sức khỏe
- `vaccinationStatus`: Trạng thái tiêm chủng
- `isActive`: Trạng thái hoạt động
- `page`, `size`, `sortBy`, `sortDir`: Các tham số phân trang và sắp xếp

Thử nghiệm:
1. Tìm thú cưng theo giống:
   ```
   GET http://localhost:8080/api/pets/search?breed=corgi
   ```

2. Tìm thú cưng trong khoảng giá:
   ```
   GET http://localhost:8080/api/pets/search?minPrice=3000000&maxPrice=6000000
   ```

3. Tìm thú cưng theo nhiều điều kiện:
   ```
   GET http://localhost:8080/api/pets/search?categoryId=1&gender=male&minAgeMonths=6&maxAgeMonths=24&status=available
   ```

### 6. Lấy danh sách thú cưng theo khoảng ngày nhập

#### Request

```
GET http://localhost:8080/api/pets/arrival-date-range?startDate=2023-01-01&endDate=2023-06-30
```

### 7. Lấy danh sách thú cưng theo giá tăng dần

#### Request

```
GET http://localhost:8080/api/pets/price/asc
```

### 8. Lấy danh sách thú cưng theo giá giảm dần

#### Request

```
GET http://localhost:8080/api/pets/price/desc
```

### 9. Tạo thú cưng mới

#### Request

```
POST http://localhost:8080/api/pets
Content-Type: application/json

{
  "name": "Mochi",
  "categoryId": 1,
  "species": "Canine",
  "breed": "Shiba Inu",
  "gender": "male",
  "ageMonths": 8,
  "weight": 7.5,
  "color": "Nâu đỏ",
  "price": 6000000,
  "costPrice": 4500000,
  "description": "Chó Shiba Inu thuần chủng, đã tiêm phòng đầy đủ",
  "arrivalDate": "2023-06-15",
  "status": "available",
  "certificateInfo": "Giấy chứng nhận sức khỏe, tiêm phòng",
  "healthStatus": "excellent",
  "vaccinationStatus": "fully_vaccinated",
  "isActive": true,
  "images": [
    {
      "imageUrl": "https://example.com/images/pets/shiba-1.jpg",
      "altText": "Shiba Inu đứng nghiêng",
      "isPrimary": true,
      "displayOrder": 0
    },
    {
      "imageUrl": "https://example.com/images/pets/shiba-2.jpg",
      "altText": "Shiba Inu đứng thẳng",
      "isPrimary": false,
      "displayOrder": 1
    }
  ]
}
```

Thử nghiệm validation:

1. Thử tạo thú cưng không có tên:
```json
{
  "categoryId": 1,
  "species": "Canine",
  "breed": "Shiba Inu",
  "gender": "male",
  "ageMonths": 8,
  "weight": 7.5,
  "price": 6000000
}
```

2. Thử tạo thú cưng với giá âm:
```json
{
  "name": "Mochi",
  "categoryId": 1,
  "species": "Canine",
  "breed": "Shiba Inu",
  "price": -5000
}
```

3. Thử tạo thú cưng với categoryId không tồn tại:
```json
{
  "name": "Mochi",
  "categoryId": 999,
  "species": "Canine",
  "breed": "Shiba Inu",
  "price": 6000000
}
```

4. Thử tạo thú cưng với danh sách hình ảnh không hợp lệ:
```json
{
  "name": "Mochi",
  "categoryId": 1,
  "species": "Canine",
  "breed": "Shiba Inu",
  "price": 6000000,
  "images": [
    {
      "imageUrl": "",
      "altText": "Hình ảnh không hợp lệ"
    }
  ]
}
```

### 10. Cập nhật thông tin thú cưng

#### Request

```
PUT http://localhost:8080/api/pets/{id}
Content-Type: application/json

{
  "name": "Mochi Updated",
  "categoryId": 1,
  "species": "Canine",
  "breed": "Shiba Inu",
  "gender": "male",
  "ageMonths": 9,
  "weight": 8.0,
  "color": "Nâu đỏ",
  "price": 6500000,
  "costPrice": 4500000,
  "description": "Chó Shiba Inu thuần chủng, đã tiêm phòng đầy đủ, rất ngoan",
  "arrivalDate": "2023-06-15",
  "status": "available",
  "certificateInfo": "Giấy chứng nhận sức khỏe, tiêm phòng",
  "healthStatus": "excellent",
  "vaccinationStatus": "fully_vaccinated",
  "isActive": true,
  "images": [
    {
      "imageUrl": "https://example.com/images/pets/shiba-updated-1.jpg",
      "altText": "Shiba Inu đứng nghiêng - cập nhật",
      "isPrimary": true,
      "displayOrder": 0
    },
    {
      "imageUrl": "https://example.com/images/pets/shiba-updated-2.jpg",
      "altText": "Shiba Inu ngồi - cập nhật",
      "isPrimary": false,
      "displayOrder": 1
    }
  ]
}
```

Thử nghiệm:
1. Cập nhật chỉ trường giá:
```json
{
  "price": 7000000
}
```

2. Cập nhật với danh sách hình ảnh mới:
```json
{
  "images": [
    {
      "imageUrl": "https://example.com/images/pets/shiba-new-1.jpg",
      "altText": "Shiba Inu mới",
      "isPrimary": true,
      "displayOrder": 0
    },
    {
      "imageUrl": "https://example.com/images/pets/shiba-new-2.jpg",
      "altText": "Shiba Inu mới 2",
      "isPrimary": false,
      "displayOrder": 1
    },
    {
      "imageUrl": "https://example.com/images/pets/shiba-new-3.jpg",
      "altText": "Shiba Inu mới 3",
      "isPrimary": false,
      "displayOrder": 2
    }
  ]
}
```

### 11. Bật/tắt trạng thái thú cưng

#### Request

```
PATCH http://localhost:8080/api/pets/{id}/toggle-status
```

Thử nghiệm:
1. Toggle trạng thái của thú cưng vừa tạo và kiểm tra lại trạng thái.
2. Toggle lần nữa để khôi phục.

### 12. Đánh dấu thú cưng đã bán

#### Request

```
PATCH http://localhost:8080/api/pets/{id}/mark-sold
```

### 13. Đánh dấu thú cưng còn hàng

#### Request

```
PATCH http://localhost:8080/api/pets/{id}/mark-available
```

### 14. Xóa thú cưng

#### Request

```
DELETE http://localhost:8080/api/pets/{id}
```

Lưu ý: Thao tác này sẽ đặt trạng thái isActive = false thay vì xóa hoàn toàn.

### 15. Làm việc với hình ảnh thú cưng

#### Lấy danh sách hình ảnh

```
GET http://localhost:8080/api/pets/{petId}/images
```

#### Thêm hình ảnh mới

```
POST http://localhost:8080/api/pets/{petId}/images
Content-Type: application/json

{
  "imageUrl": "https://example.com/images/pets/shiba-1.jpg",
  "altText": "Shiba Inu đứng nghiêng",
  "isPrimary": true,
  "displayOrder": 0
}
```

#### Đặt hình ảnh làm ảnh đại diện

```
PATCH http://localhost:8080/api/pets/{petId}/images/{imageId}/set-primary
```

#### Xóa hình ảnh

```
DELETE http://localhost:8080/api/pets/images/{imageId}
```

## Hướng dẫn Tạo Mới Thú Cưng với Nhiều Hình Ảnh

YummyPet hỗ trợ tạo mới thú cưng với nhiều hình ảnh trong cùng một request. Điều này giúp tối ưu quy trình tạo thú cưng và đảm bảo thông tin hình ảnh được liên kết ngay từ đầu.

### Cách tạo mới thú cưng với nhiều hình ảnh

#### Request

```
POST http://localhost:8080/api/pets
Content-Type: application/json

{
  "name": "Mochi",
  "categoryId": 1,
  "species": "Canine",
  "breed": "Shiba Inu",
  "gender": "male",
  "ageMonths": 8,
  "weight": 7.5,
  "color": "Nâu đỏ",
  "price": 6000000,
  "costPrice": 4000000,
  "description": "Chó Shiba Inu thuần chủng, đã tiêm phòng đầy đủ, rất ngoan",
  "arrivalDate": "2023-06-15",
  "status": "available",
  "certificateInfo": "Giấy chứng nhận sức khỏe, tiêm phòng",
  "healthStatus": "excellent",
  "vaccinationStatus": "fully_vaccinated",
  "isActive": true,
  "images": [
    {
      "imageUrl": "https://example.com/images/pets/shiba1.jpg",
      "altText": "Shiba Inu đứng nghiêng",
      "isPrimary": true,
      "displayOrder": 0
    },
    {
      "imageUrl": "https://example.com/images/pets/shiba2.jpg", 
      "altText": "Shiba Inu ngồi",
      "isPrimary": false,
      "displayOrder": 1
    },
    {
      "imageUrl": "https://example.com/images/pets/shiba3.jpg",
      "altText": "Shiba Inu nằm",
      "isPrimary": false,
      "displayOrder": 2
    }
  ]
}
```

#### Quy tắc xử lý hình ảnh

1. **Ảnh đại diện (Primary Image)**: 
   - Hệ thống sẽ kiểm tra nếu có ảnh nào được đánh dấu `isPrimary: true`.
   - Nếu không có ảnh nào được đánh dấu là primary, ảnh đầu tiên trong danh sách sẽ tự động trở thành ảnh đại diện.
   - Ảnh đại diện sẽ được hiển thị trong các kết quả tìm kiếm hoặc danh sách tổng quan.

2. **Display Order**:
   - Nếu không chỉ định `displayOrder`, hệ thống sẽ tự động gán theo thứ tự trong mảng (0, 1, 2, ...).
   - Thứ tự này sẽ quyết định vị trí hiển thị của hình ảnh trong gallery của thú cưng.

3. **Validation**:
   - Mỗi hình ảnh phải có `imageUrl` không được trống.
   - Các trường khác như `altText`, `isPrimary`, `displayOrder` là tùy chọn.

### Ví dụ thực tế

#### Tạo thú cưng với 1 hình ảnh duy nhất

```json
{
  "name": "Luna",
  "categoryId": 2,
  "species": "Feline",
  "breed": "Scottish Fold",
  "price": 5000000,
  "images": [
    {
      "imageUrl": "https://example.com/images/pets/scottish-fold.jpg",
      "altText": "Mèo Scottish Fold"
    }
  ]
}
```

> Lưu ý: Trong trường hợp chỉ có 1 hình ảnh, hình ảnh này sẽ tự động trở thành ảnh đại diện (isPrimary = true).

#### Tạo thú cưng với nhiều hình ảnh và chỉ định ảnh đại diện

```json
{
  "name": "Charlie",
  "categoryId": 1,
  "species": "Canine",
  "breed": "Golden Retriever",
  "price": 8000000,
  "images": [
    {
      "imageUrl": "https://example.com/images/pets/golden1.jpg",
      "altText": "Golden Retriever - hình nghiêng"
    },
    {
      "imageUrl": "https://example.com/images/pets/golden2.jpg", 
      "altText": "Golden Retriever - hình đối diện",
      "isPrimary": true
    },
    {
      "imageUrl": "https://example.com/images/pets/golden3.jpg",
      "altText": "Golden Retriever - đang chơi đùa"
    }
  ]
}
```

> Lưu ý: Trong ví dụ này, hình thứ hai với URL `golden2.jpg` sẽ được đặt làm ảnh đại diện.

## Kịch bản test tích hợp

Sau đây là kịch bản test tích hợp để kiểm tra đầy đủ chu trình sử dụng API Pet:

1. Lấy danh sách thú cưng hiện có
2. Tạo một thú cưng mới
3. Lấy thông tin chi tiết của thú cưng vừa tạo
4. Thêm hình ảnh cho thú cưng
5. Đặt một hình ảnh làm ảnh đại diện
6. Cập nhật thông tin của thú cưng
7. Đánh dấu thú cưng là đã bán
8. Đánh dấu thú cưng là còn hàng
9. Tìm kiếm thú cưng với các bộ lọc
10. Xóa hình ảnh của thú cưng
11. Xóa (vô hiệu hóa) thú cưng

## Kịch bản test tích hợp với Category và Order

Để kiểm tra sự tích hợp giữa Pet API với các API khác:

1. Tạo một danh mục mới sử dụng Category API
2. Tạo một thú cưng thuộc danh mục vừa tạo
3. Tạo một đơn hàng có chứa thú cưng này (xem tài liệu hướng dẫn API Order)
4. Kiểm tra xem sau khi đơn hàng hoàn tất, thú cưng có tự động chuyển sang trạng thái `sold` không

## Kiểm tra hiệu suất đơn giản

Để kiểm tra hiệu suất cơ bản của các API thú cưng:

1. Tạo nhiều thú cưng (khoảng 50-100 bản ghi)
2. Thực hiện tìm kiếm với các bộ lọc khác nhau
3. Kiểm tra thời gian phản hồi của các API khi số lượng bản ghi lớn
4. Kiểm tra hoạt động phân trang với các kích thước trang khác nhau

## Lỗi thường gặp và cách xử lý

1. **Không tìm thấy thú cưng (404 Not Found)**
   - Kiểm tra ID hoặc mã thú cưng có tồn tại không
   - Kiểm tra xem thú cưng đã bị vô hiệu hóa chưa (isActive = false)

2. **Lỗi validation (400 Bad Request)**
   - Kiểm tra dữ liệu đầu vào theo các quy tắc validation đã được đề cập
   - Đảm bảo tên không trống, giá không âm, danh mục tồn tại

3. **Lỗi khi thêm hình ảnh**
   - Kiểm tra URL hình ảnh có hợp lệ không
   - Kiểm tra thú cưng có tồn tại không

4. **Lỗi khi đặt ảnh đại diện**
   - Kiểm tra ID hình ảnh có thuộc về thú cưng không

### Cập nhật thú cưng với nhiều hình ảnh

Khi cập nhật thú cưng, nếu bạn muốn cập nhật cả hình ảnh, hệ thống sẽ xử lý như sau:

1. **Thay thế toàn bộ hình ảnh cũ**: Tất cả hình ảnh cũ của thú cưng sẽ bị xóa và thay thế bằng danh sách hình ảnh mới được gửi lên.
2. **Áp dụng quy tắc ảnh đại diện**: Tương tự như khi tạo mới, hệ thống sẽ xác định ảnh đại diện dựa trên thuộc tính `isPrimary` hoặc vị trí đầu tiên trong danh sách.

#### Request mẫu để cập nhật thú cưng và thay đổi hình ảnh

```
PUT http://localhost:8080/api/pets/{id}
Content-Type: application/json

{
  "name": "Mochi Updated",
  "categoryId": 1,
  "species": "Canine",
  "breed": "Shiba Inu",
  "price": 6500000,
  "images": [
    {
      "imageUrl": "https://example.com/images/pets/shiba-new1.jpg",
      "altText": "Shiba Inu - hình mới 1",
      "isPrimary": true
    },
    {
      "imageUrl": "https://example.com/images/pets/shiba-new2.jpg",
      "altText": "Shiba Inu - hình mới 2"
    }
  ]
}
```

#### Cập nhật thú cưng mà không thay đổi hình ảnh

Nếu bạn không muốn thay đổi hình ảnh, chỉ cần bỏ trường `images` trong request:

```json
{
  "name": "Mochi Updated",
  "categoryId": 1,
  "price": 6500000
}
```

> **Lưu ý quan trọng**: Khi cập nhật thú cưng, nếu bạn gửi trường `images` trong request (dù là mảng trống), hệ thống sẽ xóa tất cả hình ảnh hiện có. Để giữ nguyên hình ảnh cũ, hãy bỏ hoàn toàn trường `images` trong request.

## Các Endpoints Thao Tác Với Hình Ảnh Thú Cưng

Ngoài việc thêm hình ảnh khi tạo mới hoặc cập nhật thú cưng, hệ thống cũng cung cấp các endpoints riêng để thao tác với hình ảnh thú cưng.

### 1. Lấy danh sách hình ảnh của một thú cưng

#### Request

```
GET http://localhost:8080/api/pets/{petId}/images
```

#### Response

```json
{
  "success": true,
  "message": "Lấy danh sách hình ảnh thú cưng thành công",
  "data": [
    {
      "id": 1,
      "petId": 1,
      "imageUrl": "https://example.com/images/pets/shiba1.jpg",
      "altText": "Shiba Inu đứng nghiêng",
      "isPrimary": true,
      "displayOrder": 0,
      "createdAt": "2023-06-15T10:30:00"
    },
    {
      "id": 2,
      "petId": 1,
      "imageUrl": "https://example.com/images/pets/shiba2.jpg",
      "altText": "Shiba Inu ngồi",
      "isPrimary": false,
      "displayOrder": 1,
      "createdAt": "2023-06-15T10:30:00"
    }
  ]
}
```

### 2. Thêm một hình ảnh mới cho thú cưng

#### Request

```
POST http://localhost:8080/api/pets/{petId}/images
Content-Type: application/json

{
  "imageUrl": "https://example.com/images/pets/shiba3.jpg",
  "altText": "Shiba Inu nằm",
  "isPrimary": false,
  "displayOrder": 2
}
```

#### Response

```json
{
  "success": true,
  "message": "Thêm hình ảnh thú cưng thành công",
  "data": {
    "id": 3,
    "petId": 1,
    "imageUrl": "https://example.com/images/pets/shiba3.jpg",
    "altText": "Shiba Inu nằm",
    "isPrimary": false,
    "displayOrder": 2,
    "createdAt": "2023-06-20T14:15:00"
  }
}
```

### 3. Xóa một hình ảnh của thú cưng

#### Request

```
DELETE http://localhost:8080/api/pets/images/{imageId}
```

#### Response

```json
{
  "success": true,
  "message": "Xóa hình ảnh thú cưng thành công",
  "data": null
}
```

### 4. Đặt một hình ảnh làm ảnh đại diện

#### Request

```
PATCH http://localhost:8080/api/pets/{petId}/images/{imageId}/set-primary
```

#### Response

```json
{
  "success": true,
  "message": "Đặt hình ảnh đại diện thành công",
  "data": {
    "id": 2,
    "petId": 1,
    "imageUrl": "https://example.com/images/pets/shiba2.jpg",
    "altText": "Shiba Inu ngồi",
    "isPrimary": true,
    "displayOrder": 1,
    "createdAt": "2023-06-15T10:30:00"
  }
}
```

## Lưu ý và Thực hành tốt nhất

### 1. Quản lý hình ảnh thú cưng

- **Luôn có ảnh đại diện**: Mỗi thú cưng nên có ít nhất một hình ảnh được đánh dấu là ảnh đại diện (`isPrimary: true`). Nếu không chỉ định, hệ thống sẽ tự động chọn hình ảnh đầu tiên.
- **URL hình ảnh hợp lệ**: Đảm bảo URL hình ảnh là hợp lệ và có thể truy cập được. Hệ thống chỉ lưu trữ URL, không lưu trữ file hình ảnh.
- **Alt Text**: Nên cung cấp mô tả alt text cho mỗi hình ảnh để hỗ trợ SEO và accessibility.

### 2. Tối ưu hiệu suất

- **Số lượng hình ảnh hợp lý**: Không nên thêm quá nhiều hình ảnh cho một thú cưng (khuyến nghị tối đa 5-10 hình ảnh).
- **Display Order**: Sử dụng `displayOrder` để sắp xếp hình ảnh theo thứ tự mong muốn.

### 3. Xử lý lỗi

- **Validation**: Luôn kiểm tra dữ liệu đầu vào, đặc biệt là URL hình ảnh.
- **Xử lý null**: Khi không có hình ảnh, trường `images` trong kết quả API có thể là null hoặc mảng rỗng.

### 4. Flow làm việc hiệu quả

- **Tạo thú cưng kèm hình ảnh**: Luôn cố gắng tạo thú cưng với đầy đủ hình ảnh ngay từ đầu để tránh phải thực hiện nhiều requests.
- **Cập nhật có chọn lọc**: Khi chỉ muốn cập nhật thông tin cơ bản mà không thay đổi hình ảnh, đừng gửi trường `images` trong request.
- **Thay đổi ảnh đại diện**: Sử dụng endpoint `PATCH /api/pets/{petId}/images/{imageId}/set-primary` để thay đổi ảnh đại diện thay vì cập nhật toàn bộ thú cưng.

### 5. Tích hợp với UI

- **Gallery hiển thị**: Sắp xếp hình ảnh theo `displayOrder` trong gallery.
- **Hiển thị ảnh đại diện**: Sử dụng trường `primaryImageUrl` trong `PetDTO` để hiển thị ảnh đại diện trong danh sách sản phẩm.

### 6. Ví dụ flow hoàn chỉnh

1. Tạo thú cưng mới kèm theo 3 hình ảnh (1 ảnh đại diện)
2. Lấy thông tin chi tiết thú cưng để hiển thị đầy đủ thông tin và hình ảnh
3. Thêm 1 hình ảnh mới cho thú cưng
4. Đặt hình ảnh mới làm ảnh đại diện
5. Cập nhật thông tin thú cưng mà không thay đổi hình ảnh
