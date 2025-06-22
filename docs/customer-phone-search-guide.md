# Hướng dẫn tìm kiếm khách hàng theo số điện thoại

## Giới thiệu

YummyPet cung cấp hai cách để tìm kiếm khách hàng dựa trên số điện thoại:

1. **Tìm kiếm chính xác**: Tìm kiếm khách hàng có số điện thoại chính xác như đã nhập
2. **Tìm kiếm một phần**: Tìm kiếm khách hàng có số điện thoại chứa chuỗi được chỉ định

Tài liệu này hướng dẫn cụ thể cách sử dụng hai phương thức tìm kiếm này.

## 1. Tìm kiếm chính xác theo số điện thoại

### Mô tả
API này trả về thông tin của một khách hàng cụ thể có số điện thoại chính xác như đã nhập. Nếu không tìm thấy khách hàng nào, API sẽ trả về lỗi.

### Endpoint
```
GET /api/customers/phone/{phone}
```

### Tham số
- `{phone}`: Số điện thoại cần tìm kiếm (chính xác)

### Quyền truy cập
- Admin
- Staff

### Ví dụ

**Request:**
```
GET /api/customers/phone/0987654321
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200 OK):**
```json
{
  "success": true,
  "message": "Lấy thông tin khách hàng theo số điện thoại thành công",
  "data": {
    "id": 1,
    "customerCode": "CUS000001",
    "fullName": "Nguyễn Văn A",
    "phone": "0987654321",
    "email": "nguyenvana@example.com",
    "address": "123 Đường Lê Lợi, Quận 1, TP.HCM",
    "dateOfBirth": "1990-01-15",
    "gender": "male",
    "loyaltyPoints": 150,
    "isActive": true,
    "createdAt": "2025-01-01T10:00:00",
    "updatedAt": "2025-06-15T14:30:00",
    "hasAccount": true
  }
}
```

**Response lỗi (400 Bad Request):**
```json
{
  "success": false,
  "message": "Không tìm thấy khách hàng với số điện thoại: 0987654321",
  "data": null
}
```

## 2. Tìm kiếm theo một phần số điện thoại

### Mô tả
API này trả về danh sách các khách hàng có số điện thoại chứa chuỗi được chỉ định. Kết quả được phân trang và có thể sắp xếp theo các trường khác nhau.

### Endpoint
```
GET /api/customers/search/phone?phone={phonePartial}
```

### Tham số
- `phone` (bắt buộc): Phần số điện thoại cần tìm kiếm
- `page` (tùy chọn, mặc định: 0): Số trang
- `size` (tùy chọn, mặc định: 10): Số lượng bản ghi trên mỗi trang
- `sortBy` (tùy chọn, mặc định: "id"): Trường để sắp xếp
- `sortDir` (tùy chọn, mặc định: "asc"): Hướng sắp xếp ("asc" hoặc "desc")

### Quyền truy cập
- Admin
- Staff

### Ví dụ

**Request:**
```
GET /api/customers/search/phone?phone=090&page=0&size=10&sortBy=id&sortDir=asc
Authorization: Bearer {your_jwt_token}
```

**Response thành công (200 OK):**
```json
{
  "success": true,
  "message": "Tìm kiếm khách hàng theo số điện thoại thành công",
  "data": {
    "content": [
      {
        "id": 1,
        "customerCode": "CUS000001",
        "fullName": "Nguyễn Văn A",
        "phone": "0907654321",
        "email": "nguyenvana@example.com",
        "loyaltyPoints": 150,
        "isActive": true,
        "hasAccount": true
      },
      {
        "id": 3,
        "customerCode": "CUS000003",
        "fullName": "Lê Văn C",
        "phone": "0901234567",
        "email": "levanc@example.com",
        "loyaltyPoints": 50,
        "isActive": true,
        "hasAccount": false
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": true,
        "unsorted": false,
        "empty": false
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "totalElements": 2,
    "totalPages": 1,
    "last": true,
    "size": 10,
    "number": 0,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "numberOfElements": 2,
    "first": true,
    "empty": false
  }
}
```

## Trường hợp sử dụng

### Khi nào sử dụng tìm kiếm chính xác?

- Khi bạn biết chính xác số điện thoại của khách hàng
- Khi bạn muốn tìm kiếm nhanh một khách hàng cụ thể
- Khi bạn cần xác nhận một khách hàng đã có trong hệ thống hay chưa

### Khi nào sử dụng tìm kiếm một phần?

- Khi bạn chỉ nhớ một phần của số điện thoại khách hàng
- Khi bạn muốn tìm tất cả khách hàng có số điện thoại chứa một chuỗi số cụ thể
- Khi bạn cần lọc khách hàng theo đầu số hoặc vùng địa lý (ví dụ: "090" cho một nhà mạng cụ thể)

## Lưu ý

- Tìm kiếm không phân biệt định dạng số điện thoại (có dấu cách, dấu gạch ngang, v.v.)
- Các ký tự đặc biệt trong số điện thoại (như "+", "-", " ") không ảnh hưởng đến kết quả tìm kiếm
- Kết quả tìm kiếm một phần được xếp hạng theo độ phù hợp và có thể được sắp xếp theo các trường khác nhau
