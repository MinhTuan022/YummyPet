# API Giỏ Hàng (Cart API) - Hướng dẫn sử dụng

## Tổng quan
API giỏ hàng cho phép người dùng thêm sản phẩm, thú cưng vào giỏ hàng, thay đổi số lượng, xóa sản phẩm khỏi giỏ hàng và tiến hành thanh toán.

## Điều kiện tiên quyết
- Người dùng phải đăng nhập (authenticated) để sử dụng API giỏ hàng
- Token JWT hợp lệ phải được gửi trong header `Authorization`

## API Endpoints

### 1. Lấy thông tin giỏ hàng
**GET** `/api/cart`

Trả về thông tin giỏ hàng hiện tại của người dùng đã đăng nhập.

**Response Example:**
```json
{
  "success": true,
  "message": "Lấy thông tin giỏ hàng thành công",
  "data": {
    "id": 1,
    "items": [
      {
        "id": 12,
        "product": {
          "id": 5,
          "name": "Thức ăn cho chó Royal Canin",
          "price": 350000,
          "image": "https://example.com/image.jpg"
        },
        "quantity": 2,
        "itemType": "product",
        "unitPrice": 350000,
        "subtotal": 700000
      }
    ],
    "subtotal": 700000,
    "itemCount": 2,
    "voucherId": null,
    "voucherCode": null,
    "discountAmount": null,
    "finalTotal": 700000
  }
}
```

### 2. Thêm sản phẩm vào giỏ hàng
**POST** `/api/cart/add`

Thêm một sản phẩm mới hoặc tăng số lượng sản phẩm đã có trong giỏ hàng.

**Request Body:**
```json
{
  "itemType": "product",
  "productId": 5,
  "quantity": 2
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Đã thêm sản phẩm vào giỏ hàng",
  "data": {
    "id": 12,
    "product": {
      "id": 5,
      "name": "Thức ăn cho chó Royal Canin",
      "price": 350000,
      "image": "https://example.com/image.jpg"
    },
    "quantity": 2,
    "itemType": "product",
    "unitPrice": 350000,
    "subtotal": 700000
  }
}
```

### 3. Cập nhật số lượng sản phẩm
**PUT** `/api/cart/update/{cartItemId}`

Cập nhật số lượng một sản phẩm đã có trong giỏ hàng.

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Đã cập nhật giỏ hàng",
  "data": {
    "id": 12,
    "product": {
      "id": 5,
      "name": "Thức ăn cho chó Royal Canin",
      "price": 350000,
      "image": "https://example.com/image.jpg"
    },
    "quantity": 3,
    "itemType": "product",
    "unitPrice": 350000,
    "subtotal": 1050000
  }
}
```

### 4. Xóa sản phẩm khỏi giỏ hàng
**DELETE** `/api/cart/remove/{cartItemId}`

Xóa một sản phẩm khỏi giỏ hàng.

**Response Example:**
```json
{
  "success": true,
  "message": "Đã xóa sản phẩm khỏi giỏ hàng",
  "data": null
}
```

### 5. Xóa tất cả sản phẩm trong giỏ hàng
**DELETE** `/api/cart/clear`

Xóa tất cả sản phẩm trong giỏ hàng của người dùng.

**Response Example:**
```json
{
  "success": true,
  "message": "Đã xóa tất cả sản phẩm khỏi giỏ hàng",
  "data": null
}
```

### 6. Lấy số lượng sản phẩm trong giỏ hàng
**GET** `/api/cart/count`

Trả về số lượng sản phẩm trong giỏ hàng của người dùng.

**Response Example:**
```json
{
  "success": true,
  "message": "Lấy số lượng sản phẩm trong giỏ hàng thành công",
  "data": 5
}
```

### 7. Áp dụng mã giảm giá
**POST** `/api/cart/apply-voucher/{code}`

Áp dụng mã giảm giá cho giỏ hàng.

**Response Example:**
```json
{
  "success": true,
  "message": "Đã áp dụng mã giảm giá thành công",
  "data": {
    "id": 1,
    "items": [
      {
        "id": 12,
        "product": {
          "id": 5,
          "name": "Thức ăn cho chó Royal Canin",
          "price": 350000,
          "image": "https://example.com/image.jpg"
        },
        "quantity": 3,
        "itemType": "product",
        "unitPrice": 350000,
        "subtotal": 1050000
      }
    ],
    "subtotal": 1050000,
    "itemCount": 3,
    "voucherId": 2,
    "voucherCode": "SUMMER2023",
    "discountAmount": 150000,
    "finalTotal": 900000
  }
}
```

### 8. Hủy mã giảm giá
**DELETE** `/api/cart/remove-voucher`

Hủy mã giảm giá đã áp dụng cho giỏ hàng.

**Response Example:**
```json
{
  "success": true,
  "message": "Đã hủy mã giảm giá thành công",
  "data": {
    "id": 1,
    "items": [
      {
        "id": 12,
        "product": {
          "id": 5,
          "name": "Thức ăn cho chó Royal Canin",
          "price": 350000,
          "image": "https://example.com/image.jpg"
        },
        "quantity": 3,
        "itemType": "product",
        "unitPrice": 350000,
        "subtotal": 1050000
      }
    ],
    "subtotal": 1050000,
    "itemCount": 3,
    "voucherId": null,
    "voucherCode": null,
    "discountAmount": null,
    "finalTotal": 1050000
  }
}
```

### 9. Thanh toán giỏ hàng
**POST** `/api/cart/checkout`

Chuyển đổi giỏ hàng thành đơn hàng và tiến hành thanh toán.

**Request Body:**
```json
{
  "paymentMethod": "cod",
  "deliveryAddress": "123 Nguyễn Huệ, Quận 1, TP.HCM",
  "notes": "Giao vào buổi sáng"
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Đặt hàng thành công. Mã đơn hàng: ORD-20230801-12345",
  "data": {
    "id": 25,
    "orderCode": "ORD-20230801-12345",
    "status": "pending",
    "paymentStatus": "unpaid",
    "paymentMethod": "cod",
    "deliveryMethod": "delivery",
    "deliveryAddress": "123 Nguyễn Huệ, Quận 1, TP.HCM",
    "notes": "Giao vào buổi sáng",
    "subtotal": 1050000,
    "discountAmount": 0,
    "totalAmount": 1050000,
    "items": [
      {
        "id": 35,
        "product": {
          "id": 5,
          "name": "Thức ăn cho chó Royal Canin",
          "price": 350000,
          "image": "https://example.com/image.jpg"
        },
        "quantity": 3,
        "itemType": "product",
        "unitPrice": 350000,
        "subtotal": 1050000
      }
    ],
    "customer": {
      "id": 8,
      "fullName": "Nguyễn Văn A",
      "phone": "0901234567"
    },
    "createdAt": "2023-08-01T15:30:45",
    "updatedAt": "2023-08-01T15:30:45"
  }
}
```

## Xử lý lỗi

### 1. Lỗi xác thực
```json
{
  "success": false,
  "message": "Bạn cần đăng nhập để sử dụng tính năng này",
  "data": null
}
```

### 2. Lỗi validation
```json
{
  "success": false,
  "message": "Địa chỉ giao hàng không được để trống",
  "data": null
}
```

### 3. Lỗi tồn kho
```json
{
  "success": false,
  "message": "Sản phẩm Thức ăn cho chó Royal Canin chỉ còn 2 trong kho",
  "data": null
}
```

### 4. Lỗi mã giảm giá
```json
{
  "success": false,
  "message": "Mã giảm giá đã hết hạn hoặc không khả dụng",
  "data": null
}
```

## Quy trình đặt hàng online

1. **Thêm sản phẩm vào giỏ hàng**
   - Gọi API `/api/cart/add` để thêm sản phẩm vào giỏ hàng
   - Có thể thêm nhiều sản phẩm khác nhau

2. **Xem giỏ hàng**
   - Gọi API `/api/cart` để xem danh sách sản phẩm trong giỏ hàng
   - Kiểm tra tổng giá trị đơn hàng

3. **Áp dụng mã giảm giá (nếu có)**
   - Gọi API `/api/cart/apply-voucher/{code}` để áp dụng mã giảm giá
   - Kiểm tra giá trị giảm và tổng tiền sau khi áp dụng

4. **Thanh toán**
   - Gọi API `/api/cart/checkout` với thông tin giao hàng và phương thức thanh toán
   - Hệ thống sẽ tự động chuyển đổi giỏ hàng thành đơn hàng và làm trống giỏ hàng
   
5. **Theo dõi đơn hàng**
   - Sử dụng Order API để theo dõi trạng thái đơn hàng

## Lưu ý quan trọng

1. API checkout sẽ xóa tất cả sản phẩm trong giỏ hàng sau khi đặt hàng thành công
2. Các sản phẩm phải có đủ tồn kho mới cho phép thanh toán
3. Chức năng đặt hàng online chỉ hỗ trợ cho sản phẩm và thú cưng, không hỗ trợ cho dịch vụ
4. Khách hàng phải đăng nhập mới có thể sử dụng chức năng giỏ hàng
5. Nếu bạn gặp phải lỗi "org.hibernate.ObjectDeletedException", vui lòng thử tải lại trang và đăng nhập lại.

## Xử lý lỗi Hibernate ObjectDeletedException

Trong một số trường hợp hiếm gặp, khi checkout giỏ hàng, bạn có thể gặp phải lỗi "org.hibernate.ObjectDeletedException: deleted instance passed to merge". Đây là lỗi liên quan đến Hibernate Session và object state, xảy ra khi hệ thống cố gắng sử dụng một entity đã bị xóa trong cùng một transaction.

**Nguyên nhân:**
- Transaction xóa giỏ hàng sau khi tạo đơn hàng vẫn đang tham chiếu đến các CartItem đã bị xóa

**Giải pháp:**
- Chúng tôi đã cải tiến quá trình checkout để tách biệt hai transaction: tạo đơn hàng và xóa giỏ hàng
- Điều này giúp giải quyết vấn đề tham chiếu đến các entity đã xóa

**Nếu vẫn gặp lỗi:**
- Làm mới trang và thử lại
- Đăng xuất và đăng nhập lại
- Liên hệ admin nếu vấn đề vẫn tiếp tục xảy ra
