# API Documentation for Order Management

## Overview

This document outlines the available API endpoints for managing orders in the YummyPet system. The API provides functionalities for creating online orders, in-store orders, tracking order status, and retrieving order details.

## Authentication

Most of the endpoints require authentication. Please include a valid JWT token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

### Security Rules

1. **Customer Authentication**:
   - Khách hàng chỉ có thể truy cập và quản lý đơn hàng của chính mình
   - Khi khách hàng đăng nhập và tạo đơn hàng, hệ thống sẽ tự động sử dụng ID của khách hàng đó, bất kể ID nào được truyền vào request
   
2. **Order Status Management**:
   - Chỉ Admin và Staff có quyền thay đổi trạng thái đơn hàng
   - Khách hàng chỉ có thể hủy đơn hàng khi đơn hàng còn ở trạng thái "pending"
   
3. **Payment Confirmation**:
   - Chỉ Admin và Staff có quyền xác nhận thanh toán đơn hàng

## Order Endpoints

### Create Online Order

**Endpoint:** `POST /api/orders/online`

**Access:** Authenticated customers

**Description:** Creates a new online order. Online orders can include products and pets but cannot include services.

**Request Body:**
```json
{
  "customerId": 1,
  "paymentMethod": "credit_card",
  "deliveryMethod": "shipping",
  "deliveryAddress": "123 Đường Lê Lợi, Quận 1, TP.HCM",
  "notes": "Vui lòng gọi trước khi giao hàng",
  "voucherId": 10,
  "loyaltyPointsUsed": 20,
  "items": [
    {
      "itemType": "product",
      "productId": 5,
      "quantity": 2,
      "unitPrice": 150000
    },
    {
      "itemType": "pet",
      "petId": 3,
      "quantity": 1,
      "unitPrice": 2500000
    }
  ]
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Đơn hàng online đã được tạo thành công",
  "data": {
    "id": 123,
    "orderCode": "ORD000123",
    "customer": {
      "id": 1,
      "customerCode": "CUS000001",
      "fullName": "Nguyễn Văn A",
      "phone": "0987654321",
      "email": "nguyenvana@example.com"
    },
    "isGuestOrder": false,
    "subtotal": 2800000,
    "discountAmount": 70000,
    "totalAmount": 2730000,
    "loyaltyPointsUsed": 20,
    "paymentMethod": "credit_card",
    "paymentStatus": "pending",
    "deliveryAddress": "123 Đường Lê Lợi, Quận 1, TP.HCM",
    "deliveryMethod": "shipping",
    "status": "pending",
    "orderSource": "online",
    "notes": "Vui lòng gọi trước khi giao hàng",
    "createdAt": "2025-06-21T15:30:00",
    "updatedAt": "2025-06-21T15:30:00",
    "voucherId": 10,
    "voucherCode": "SUMMER2025",
    "orderItems": [
      {
        "id": 245,
        "itemType": "product",
        "product": {
          "id": 5,
          "name": "Royal Canin Medium Adult",
          "sku": "RC-MA-001"
        },
        "quantity": 2,
        "unitPrice": 150000,
        "totalPrice": 300000
      },
      {
        "id": 246,
        "itemType": "pet",
        "pet": {
          "id": 3,
          "name": "Lucky",
          "species": "Chó",
          "breed": "Golden Retriever"
        },
        "quantity": 1,
        "unitPrice": 2500000,
        "totalPrice": 2500000
      }
    ]
  }
}
```

### Important Notes for Online Orders

1. **Customer Authentication**: Only registered customers can create online orders. The customer must be logged in.

2. **Delivery Address**: A delivery address is mandatory for online orders.

3. **Item Types**: Online orders can include products and pets only. Service items are not allowed in online orders.

4. **Loyalty Points**:
   - Customers can use loyalty points to get discounts (1 point = 1,000 VND).
   - Customers cannot use more points than they have.
   - When an order is completed, customers earn loyalty points (1 point per 10,000 VND spent).
   - If an order is canceled, used loyalty points are refunded to the customer.

5. **Vouchers**:
   - Customers can apply a valid voucher to get discounts.
   - The system validates the voucher to ensure it's active, not expired, and hasn't reached its usage limit.

6. **Process Flow**:
   - Order is created with status "pending"
   - Staff reviews and confirms the order (status changes to "confirmed")
   - Order enters processing stage (status changes to "processing")
   - Order is ready for delivery/pickup (status changes to "ready")
   - Order is completed (status changes to "completed")
   - At any stage before completion, the order can be cancelled

### Checking Order Status

**Endpoint:** `GET /api/orders/{id}`

**Access:** Admin, Staff, and Customer (who placed the order)

**Description:** Retrieves details of a specific order by ID.

**Response**: Returns complete order details with status information.

### Viewing Customer Orders

**Endpoint:** `GET /api/orders/customer/{customerId}`

**Access:** Admin, Staff, and Customer (their own orders)

**Parameters (Query String):**
- `page` (optional, default: 0): Page number
- `size` (optional, default: 10): Page size
- `sort` (optional): Sort field

**Description:** Retrieves a paginated list of orders for a specific customer.

**Response**: Returns a paginated list of orders for the given customer.

## Order Lifecycle

1. **Created (pending)**: Order is submitted but not yet reviewed by staff
2. **Confirmed**: Order has been reviewed and confirmed by staff
3. **Processing**: Order is being prepared
4. **Ready**: Order is ready for pickup/delivery
5. **Completed**: Order has been delivered/picked up
6. **Cancelled**: Order has been cancelled (can happen at any stage before completion)

## Payment Status

1. **Pending**: Payment has not been received
2. **Paid**: Payment has been received
3. **Refunded**: Payment has been refunded

## Error Handling

Common error responses:

- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Business rule violation
- **500 Internal Server Error**: Server-side error

Error response format:
```json
{
  "success": false,
  "message": "Thông báo lỗi",
  "errors": {
    "field1": "Lỗi trường 1",
    "field2": "Lỗi trường 2"
  }
}
```

## Đổi trả hàng

### Tạo yêu cầu đổi trả hàng

**Endpoint:** `POST /api/returns`

**Access:** Admin, Staff, và Customer (cho đơn hàng của họ)

**Description:** Tạo một yêu cầu đổi trả hàng. Chỉ có thể đổi trả các đơn hàng đã hoàn thành.

**Request Body:**
```json
{
  "orderId": 123,
  "customerId": 1,
  "type": "return_",  /* Giá trị hợp lệ: "return_" hoặc "exchange" */
  "reason": "Sản phẩm không đúng mô tả",
  "notes": "Khách hàng muốn hoàn tiền",
  "items": [
    {
      "orderItemId": 245,
      "itemType": "product",  /* Loại mục: "product" hoặc "pet" */
      "quantity": 1,
      "conditionStatus": "new_",  /* Giá trị hợp lệ: "new_", "good", "damaged", "defective" */
      "notes": "Còn nguyên seal"
    }
  ]
}
```

**Lưu ý quan trọng**:
- Trường `type` phải là một trong hai giá trị: "return_" (đổi trả) hoặc "exchange" (đổi hàng). Trường này là bắt buộc và phải chính xác giá trị enum.
- Trường `orderItemId` trong mỗi item là bắt buộc và phải tham chiếu đến một OrderItem hợp lệ thuộc đơn hàng đang được đổi trả.

**Response Example:**
```json
{
  "success": true,
  "message": "Đơn đổi trả đã được tạo thành công",
  "data": {
    "id": 15,
    "returnCode": "RTN000015",
    "orderId": 123,
    "orderCode": "ORD000123",
    "customer": {
      "id": 1,
      "customerCode": "CUS000001",
      "fullName": "Nguyễn Văn A",
      "phone": "0987654321",
      "email": "nguyenvana@example.com"
    },
    "type": "return_",
    "reason": "Sản phẩm không đúng mô tả",
    "totalAmount": 150000,
    "refundAmount": null,
    "status": "pending",
    "notes": "Khách hàng muốn hoàn tiền",
    "createdAt": "2025-06-21T15:30:00",
    "updatedAt": null,
    "items": [
      {
        "id": 20,
        "itemType": "product",
        "product": {
          "id": 5,
          "name": "Royal Canin Medium Adult",
          "sku": "RC-MA-001"
        },
        "quantity": 1,
        "unitPrice": 150000,
        "totalPrice": 150000,
        "conditionStatus": "new_",
        "notes": "Còn nguyên seal",
        "createdAt": "2025-06-21T15:30:00"
      }
    ]
  }
}
```

### Xem đơn đổi trả theo ID

**Endpoint:** `GET /api/returns/{id}`

**Access:** Admin, Staff, và Customer (cho đơn đổi trả của họ)

**Description:** Lấy thông tin chi tiết về đơn đổi trả bằng ID.

### Xem đơn đổi trả theo mã đổi trả

**Endpoint:** `GET /api/returns/code/{returnCode}`

**Access:** Admin, Staff, và Customer (cho đơn đổi trả của họ)

**Description:** Lấy thông tin chi tiết về đơn đổi trả bằng mã đổi trả.

### Phê duyệt đơn đổi trả

**Endpoint:** `PUT /api/returns/{id}/approve`

**Access:** Admin, Staff

**Description:** Phê duyệt yêu cầu đổi trả. Khi phê duyệt, hàng sẽ được hoàn trả vào kho.

**Parameters (Query String):**
- `processedById`: ID của nhân viên xử lý (optional)

### Hoàn thành đơn đổi trả

**Endpoint:** `PUT /api/returns/{id}/complete`

**Access:** Admin, Staff

**Description:** Đánh dấu đơn đổi trả là đã hoàn thành (đã hoàn tiền cho khách).

**Parameters (Query String):**
- `refundAmount`: Số tiền hoàn trả cho khách

### Từ chối đơn đổi trả

**Endpoint:** `PUT /api/returns/{id}/reject`

**Access:** Admin, Staff

**Description:** Từ chối yêu cầu đổi trả.

**Parameters (Query String):**
- `reason`: Lý do từ chối (mandatory)
- `processedById`: ID của nhân viên xử lý (optional)

## Quy trình đổi trả hàng

1. **Tạo đơn đổi trả (pending)**: Khách hàng hoặc nhân viên tạo yêu cầu đổi trả
2. **Kiểm tra và phê duyệt (approved)**: Nhân viên kiểm tra tình trạng sản phẩm và phê duyệt đơn
3. **Hoàn thành (completed)**: Hoàn tiền cho khách (nếu đổi trả) hoặc giao sản phẩm thay thế (nếu đổi)
4. **Từ chối (rejected)**: Nhân viên từ chối đơn nếu không đáp ứng điều kiện đổi trả

### Notes
- Khách hàng chỉ có thể đổi trả các đơn hàng đã hoàn thành.
- Sản phẩm đổi trả phải trong điều kiện tốt (new, good) mới được hoàn tiền đầy đủ.
- Số lượng đổi trả không thể vượt quá số lượng đã mua trong đơn hàng.
- Tương tự như đơn hàng, khách hàng chỉ có thể tạo và xem đơn đổi trả của chính mình.
- Việc phê duyệt, từ chối và hoàn thành đơn đổi trả chỉ có thể được thực hiện bởi Staff và Admin.
