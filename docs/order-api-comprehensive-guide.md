# Tài liệu API đơn hàng YummyPet

Tài liệu này mô tả chi tiết các API đặt hàng trong hệ thống YummyPet, hỗ trợ nhiều kịch bản khác nhau bao gồm đặt hàng trực tiếp tại cửa hàng và online, cho cả khách hàng có tài khoản và khách vãng lai.

## I. Tổng quan các loại đơn hàng

### Phân loại theo kênh bán hàng
1. **Đơn hàng tại cửa hàng (In-store)**: Khách hàng mua trực tiếp tại cửa hàng
2. **Đơn hàng trực tuyến (Online)**: Khách hàng đặt hàng thông qua website hoặc ứng dụng

### Phân loại theo loại khách hàng
1. **Khách hàng có tài khoản**: Đã đăng ký và có thông tin trong hệ thống
2. **Khách vãng lai có thông tin**: Chưa đăng ký tài khoản nhưng cung cấp thông tin liên hệ
3. **Khách vãng lai ẩn danh**: Không cung cấp thông tin liên hệ (chỉ áp dụng cho mua tại cửa hàng)

### Phân loại theo loại mặt hàng
1. **Sản phẩm (Product)**: Thức ăn, đồ chơi, phụ kiện cho thú cưng
2. **Thú cưng (Pet)**: Mua bán thú cưng (mèo, chó, v.v.)
3. **Dịch vụ (Service)**: Dịch vụ tắm, cắt lông, khám bệnh, v.v.
4. **Hỗn hợp**: Kết hợp nhiều loại mặt hàng trong một đơn hàng

## II. API đặt hàng

### A. Đơn hàng tại cửa hàng (In-store)

#### 1. Đơn hàng tại cửa hàng cho khách có tài khoản

**Endpoint:** `POST /api/orders/in-store`

**Request Body:**
```json
{
  "customerId": 123,
  "paymentMethod": "cash",
  "notes": "Khách hàng có tài khoản mua sản phẩm tại cửa hàng",
  "items": [
    {
      "itemType": "product",
      "productId": 10,
      "quantity": 2,
      "unitPrice": 120000
    },
    {
      "itemType": "product",
      "productId": 15,
      "quantity": 1,
      "unitPrice": 250000
    }
  ]
}
```

#### 2. Đơn hàng tại cửa hàng cho khách vãng lai có thông tin

**Endpoint:** `POST /api/orders/in-store`

**Request Body:**
```json
{
  "guestName": "Nguyễn Văn A",
  "guestPhone": "0912345678",
  "paymentMethod": "cash",
  "notes": "Khách vãng lai mua sản phẩm tại cửa hàng",
  "items": [
    {
      "itemType": "product",
      "productId": 10,
      "quantity": 2,
      "unitPrice": 120000
    }
  ]
}
```

#### 3. Đơn hàng tại cửa hàng cho khách vãng lai ẩn danh

**Endpoint:** `POST /api/orders/anonymous`

**Request Body:**
```json
{
  "paymentMethod": "cash",
  "notes": "Khách không cung cấp thông tin",
  "items": [
    {
      "itemType": "product",
      "productId": 10,
      "quantity": 2,
      "unitPrice": 120000
    }
  ]
}
```

### B. Đơn hàng trực tuyến (Online)

> **CHÚ Ý QUAN TRỌNG**: Đơn hàng online **CHỈ HỖ TRỢ** mua sản phẩm (`itemType: "product"`) và/hoặc thú cưng (`itemType: "pet"`). Đơn hàng online **KHÔNG HỖ TRỢ** đặt dịch vụ (`itemType: "service"`). Dịch vụ chỉ có thể được đặt trực tiếp tại cửa hàng.

#### 1. Đơn hàng online cho khách có tài khoản

**Endpoint:** `POST /api/orders/online`

**Request Body:**
```json
{
  "customerId": 123,
  "shippingAddressId": 456,
  "paymentMethod": "banking",
  "notes": "Giao vào buổi chiều",
  "items": [
    {
      "itemType": "product",
      "productId": 10,
      "quantity": 2,
      "unitPrice": 120000
    }
  ],
  "voucherId": 789,
  "usePoints": true
}
```

#### 2. Đơn hàng online cho khách vãng lai có thông tin

**Endpoint:** `POST /api/orders/online`

**Request Body:**
```json
{
  "guestName": "Trần Thị B",
  "guestPhone": "0987654321",
  "guestEmail": "customer@example.com",
  "shippingAddress": {
    "address": "123 Đường ABC, Quận 1",
    "city": "TP HCM",
    "district": "Quận 1",
    "ward": "Phường Bến Nghé"
  },
  "paymentMethod": "cod",
  "notes": "Gọi trước khi giao",
  "items": [
    {
      "itemType": "product",
      "productId": 15,
      "quantity": 1,
      "unitPrice": 250000
    }
  ]
}
```

## III. API đặt dịch vụ

### A. Đặt dịch vụ tại cửa hàng

#### 1. Đặt dịch vụ cho khách có tài khoản (và có thú cưng đã đăng ký)

**Endpoint:** `POST /api/orders/in-store`

**Request Body:**
```json
{
  "customerId": 123,
  "paymentMethod": "cash",
  "notes": "Khách hàng đặt dịch vụ cho thú cưng đã đăng ký",
  "items": [
    {
      "itemType": "service",
      "serviceId": 2,
      "quantity": 1,
      "unitPrice": 350000,
      "petId": 45,
      "serviceNotes": "Chú ý cắt móng nhẹ tay",
      "estimatedDuration": 60
    }
  ]
}
```

#### 2. Đặt dịch vụ cho khách vãng lai có thông tin

**Endpoint:** `POST /api/orders/in-store`

**Request Body:**
```json
{
  "guestName": "Lê Văn C",
  "guestPhone": "0909123456",
  "paymentMethod": "cash",
  "notes": "Khách vãng lai sử dụng dịch vụ tắm cho chó",
  "items": [
    {
      "itemType": "service",
      "serviceId": 2,
      "quantity": 1,
      "unitPrice": 350000,
      "serviceNotes": "Chó Poodle đực màu nâu đỏ, khoảng 5kg, lông bị rối phần chân và đuôi, cần cắt tỉa gọn gàng",
      "estimatedDuration": 90
    }
  ]
}
```

#### 3. Đặt dịch vụ cho khách vãng lai ẩn danh

**Endpoint:** `POST /api/orders/anonymous`

**Request Body:**
```json
{
  "paymentMethod": "cash",
  "notes": "Khách vãng lai không cung cấp thông tin",
  "items": [
    {
      "itemType": "service",
      "serviceId": 1,
      "quantity": 1,
      "unitPrice": 250000,
      "serviceNotes": "Mèo Anh lông ngắn màu xám, khoảng 3.5kg, cần tắm và vệ sinh tai",
      "estimatedDuration": 45,
      "assignedEmployeeId": 5
    }
  ]
}
```

### B. Đặt dịch vụ trực tuyến (chỉ dành cho khách có tài khoản)

**Endpoint:** `POST /api/orders/online`

**Request Body:**
```json
{
  "customerId": 123,
  "paymentMethod": "banking",
  "notes": "Đặt lịch dịch vụ trước",
  "items": [
    {
      "itemType": "service",
      "serviceId": 3,
      "quantity": 1,
      "unitPrice": 450000,
      "petId": 46,
      "serviceNotes": "Spa trọn gói",
      "completionDate": "2025-06-25T15:00:00.000Z"
    }
  ]
}
```

## IV. API đơn hàng hỗn hợp (kết hợp sản phẩm, dịch vụ và thú cưng)

### A. Đơn hàng hỗn hợp tại cửa hàng cho khách có tài khoản

**Endpoint:** `POST /api/orders/in-store`

**Request Body:**
```json
{
  "customerId": 123,
  "paymentMethod": "card",
  "notes": "Mua thú cưng kèm dịch vụ và thức ăn",
  "items": [
    {
      "itemType": "pet",
      "petId": 50,
      "quantity": 1,
      "unitPrice": 3500000
    },
    {
      "itemType": "service",
      "serviceId": 4,
      "quantity": 1,
      "unitPrice": 200000,
      "petId": 50,
      "serviceNotes": "Kiểm tra sức khỏe cho thú cưng mới mua"
    },
    {
      "itemType": "product",
      "productId": 25,
      "quantity": 2,
      "unitPrice": 185000
    }
  ]
}
```

### B. Đơn hàng hỗn hợp tại cửa hàng cho khách vãng lai có thông tin

**Endpoint:** `POST /api/orders/in-store`

**Request Body:**
```json
{
  "guestName": "Phạm Thị D",
  "guestPhone": "0977888999",
  "paymentMethod": "cash",
  "notes": "Sử dụng dịch vụ và mua sản phẩm",
  "items": [
    {
      "itemType": "service",
      "serviceId": 1,
      "quantity": 1,
      "unitPrice": 250000,
      "serviceNotes": "Chó Alaska màu trắng xám, khoảng 15kg, cần tắm và làm khô lông",
      "estimatedDuration": 120
    },
    {
      "itemType": "product",
      "productId": 30,
      "quantity": 1,
      "unitPrice": 320000
    }
  ]
}
```

## V. API quản lý đơn hàng

### 1. Cập nhật trạng thái đơn hàng

**Endpoint:** `PUT /api/orders/{id}/status`

**Query Parameters:**
- `status`: Trạng thái mới của đơn hàng (`pending`, `confirmed`, `processing`, `ready`, `completed`, `cancelled`)

**Ví dụ:**
```
PUT /api/orders/123/status?status=confirmed
PUT /api/orders/123/status?status=completed
```

**Quy tắc và ràng buộc:**
- Đơn hàng có dịch vụ (service) KHÔNG ĐƯỢC phép chuyển trực tiếp từ `pending` sang `completed`
- Đơn hàng có dịch vụ chỉ được chuyển sang trạng thái `completed` khi tất cả các dịch vụ trong đơn đã hoàn thành
- API sẽ trả về lỗi 400 Bad Request nếu cố gắng hoàn thành đơn hàng có dịch vụ chưa hoàn thành
- Đơn hàng chỉ có sản phẩm (product) và/hoặc thú cưng (pet) có thể chuyển trực tiếp từ `pending` sang `completed`

**Response khi có lỗi:**
```json
{
  "status": "error",
  "code": "ORDER_SERVICE_INCOMPLETE",
  "message": "Không thể hoàn thành đơn hàng vì có dịch vụ chưa hoàn thành",
  "details": {
    "incompleteServices": [
      {
        "id": 67890,
        "serviceName": "Tắm và vệ sinh tai cho chó",
        "serviceStatus": "pending"
      }
    ]
  }
}
```

### 2. Cập nhật trạng thái dịch vụ riêng lẻ

**Endpoint:** `PUT /api/order-items/{id}/service-status`

**Query Parameters:**
- `status`: Trạng thái mới của dịch vụ (`pending`, `in_progress`, `completed`, `cancelled`)
- `employeeId`: ID của nhân viên được gán (tùy chọn)

**Ví dụ:**
```
PUT /api/order-items/456/service-status?status=in_progress&employeeId=10
PUT /api/order-items/456/service-status?status=completed
```

### 3. Thanh toán đơn hàng

**Endpoint:** `POST /api/orders/{id}/payment`

**Request Body:**
```json
{
  "paymentMethod": "cash",
  "amount": 750000,
  "notes": "Thanh toán bằng tiền mặt"
}
```

### 4. Hủy đơn hàng

**Endpoint:** `PUT /api/orders/{id}/cancel`

**Request Body:**
```json
{
  "reason": "Khách hàng yêu cầu hủy",
  "notes": "Khách hẹn quay lại sau"
}
```

## VI. Trả về dữ liệu

Tất cả các API đặt hàng thành công sẽ trả về dữ liệu theo cấu trúc sau:

```json
{
  "status": "success",
  "message": "Đơn hàng đã được tạo thành công",
  "data": {
    "id": 12345,
    "orderCode": "OD-20250622-12345",
    "orderStatus": "pending",
    "paymentStatus": "unpaid",
    "orderType": "in-store",
    "customer": {
      "id": 123,
      "name": "Nguyễn Văn A"
    },
    "guest": {
      "name": "Phạm Thị D",
      "phone": "0977888999"
    },
    "totalAmount": 570000,
    "discountAmount": 0,
    "finalAmount": 570000,
    "createdAt": "2025-06-22T10:15:30",
    "items": [
      {
        "id": 67890,
        "itemType": "service",
        "serviceId": 1,
        "serviceName": "Tắm và vệ sinh tai cho chó",
        "quantity": 1,
        "unitPrice": 250000,
        "totalPrice": 250000,        "serviceNotes": "Chó Alaska màu trắng xám, khoảng 15kg, cần tắm và làm khô lông",
        "serviceStatus": "pending",
        "completionDate": "2025-06-22T12:15:30",
        "serviceDuration": 120
      },
      {
        "id": 67891,
        "itemType": "product",
        "productId": 30,
        "productName": "Thức ăn khô cho chó vị thịt bò",
        "productSku": "DOG-FOOD-123",
        "quantity": 1,
        "unitPrice": 320000,
        "totalPrice": 320000
      }
    ]
  }
}
```

## VII. Quy trình xử lý theo loại khách hàng

### A. Đối với khách có tài khoản
1. Tạo đơn hàng với `customerId`
2. Cập nhật trạng thái đơn hàng qua các bước: `pending → confirmed → processing → ready → completed`
3. Tích điểm và áp dụng chương trình khách hàng thân thiết

### B. Đối với khách vãng lai có thông tin
1. Tạo đơn hàng với thông tin `guestName` và `guestPhone`
2. Cập nhật trạng thái đơn hàng (có thể rút gọn quy trình)
3. Không tích điểm

### C. Đối với khách vãng lai ẩn danh
1. Tạo đơn hàng không có thông tin khách hàng
2. Có thể chuyển trực tiếp từ `pending` sang `completed` NHƯNG CHỈ ÁP DỤNG cho đơn hàng chỉ có sản phẩm (không có dịch vụ)
3. Không tích điểm

## VIII. Xử lý đặc biệt cho dịch vụ khách vãng lai

Đối với dịch vụ cho khách vãng lai, lưu ý các điểm sau:

1. **Không cần cung cấp petId**: Thông tin thú cưng được mô tả chi tiết trong trường `serviceNotes`
2. **Mô tả đầy đủ thông tin thú cưng**: Bao gồm loài, giống, màu sắc, cân nặng, v.v.
3. **Cung cấp thời gian dự kiến**: Sử dụng trường `estimatedDuration` để ước tính thời gian hoàn thành (tính bằng phút)
4. **Gán nhân viên thực hiện**: Có thể gán nhân viên ngay khi tạo đơn hoặc cập nhật sau
5. **Quy trình đầy đủ cho dịch vụ**: Đơn hàng có dịch vụ KHÔNG THỂ chuyển trực tiếp từ `pending` sang `completed` mà phải tuân theo quy trình: `pending → confirmed → processing → ready → completed`. Trạng thái `completed` chỉ được cập nhật sau khi dịch vụ thực sự hoàn thành.

## IX. Quy trình xử lý theo kênh bán hàng

### A. Đối với đơn hàng tại cửa hàng
1. Tạo đơn với `in-store` hoặc `anonymous`
2. Có thể thanh toán ngay hoặc sau khi hoàn thành
3. Có thể xử lý ngay tại chỗ

### B. Đối với đơn hàng trực tuyến
1. Tạo đơn với `online`
2. Xác nhận đơn hàng và phương thức thanh toán
3. Xử lý giao hàng hoặc đặt lịch dịch vụ
4. Cập nhật trạng thái theo quy trình đầy đủ

## X. Sử dụng completionDate và estimatedDuration

Khi đặt dịch vụ tại cửa hàng, có hai cách để xác định thời gian hoàn thành dịch vụ:

### A. Sử dụng completionDate (thời điểm cụ thể)

**completionDate** là trường chỉ định thời điểm cụ thể khi dịch vụ sẽ hoàn thành. Trường này:
- **CHỈ áp dụng cho đơn hàng tại cửa hàng**
- **KHÔNG áp dụng cho đơn hàng online** (vì đơn online không hỗ trợ dịch vụ)
- Được dùng khi nhân viên muốn ghi nhận thời gian hoàn thành chính xác cho một dịch vụ
- Định dạng: ISO-8601 timestamp (ví dụ: "2023-11-15T14:30:00.000Z")

**Ví dụ 1: Đặt dịch vụ cho một thời điểm cụ thể**
```json
{
  "itemType": "service",
  "serviceId": 3,
  "quantity": 1,
  "unitPrice": 250000,
  "petId": 12,
  "completionDate": "2023-11-15T14:30:00.000Z",
  "serviceNotes": "Khách đã đặt lịch trước cho thời điểm này"
}
```

**Ví dụ 2: Ghi nhận thời gian hoàn thành dịch vụ**
```json
{
  "itemType": "service",
  "serviceId": 5,
  "quantity": 1,
  "unitPrice": 350000,
  "serviceNotes": "Mèo tam thể, 3.5kg, đã hoàn thành tắm và vệ sinh tai",
  "completionDate": "2023-11-14T11:45:00.000Z"
}
```

### B. Sử dụng estimatedDuration (thời lượng ước tính)

**estimatedDuration** là trường chỉ định thời gian dự kiến để hoàn thành dịch vụ, tính bằng phút:
- Dùng khi chỉ cần ước tính thời gian hoàn thành, không cần chỉ định thời điểm cụ thể
- Hệ thống sẽ tự động tính thời điểm hoàn thành dựa trên thời điểm bắt đầu dịch vụ
- Nếu không cung cấp, hệ thống sẽ sử dụng thời lượng mặc định của loại dịch vụ đó

**Ví dụ:**
```json
{
  "itemType": "service",
  "serviceId": 2,
  "quantity": 1,
  "unitPrice": 400000,
  "serviceNotes": "Chó Husky đực, 18kg, lông dày cần tắm kỹ",
  "estimatedDuration": 120
}
```

## XI. Lưu ý quan trọng

- Đơn hàng trực tuyến (online) **KHÔNG HỖ TRỢ** đặt dịch vụ, chỉ hỗ trợ mua sản phẩm và thú cưng
- Đơn hàng trực tuyến không hỗ trợ khách vãng lai ẩn danh
- Đối với dịch vụ khách vãng lai, thông tin thú cưng được lưu trong `serviceNotes`
- Đơn hàng thú cưng luôn có `quantity = 1`
- Các dịch vụ có thể cập nhật trạng thái độc lập với đơn hàng
- Khi một đơn bị hủy, tất cả các dịch vụ cũng sẽ bị hủy
- Dịch vụ đã hoàn thành sẽ không bị ảnh hưởng nếu đơn hàng thay đổi trạng thái

## XII. Quy trình xử lý đơn hàng theo loại mặt hàng

### A. Đơn hàng chỉ có sản phẩm (Product)
1. Có thể áp dụng quy trình rút gọn: `pending → completed` (trong trường hợp giao dịch tại cửa hàng và thanh toán ngay)
2. Đơn online vẫn phải tuân theo quy trình đầy đủ: `pending → confirmed → processing → ready → completed`

### B. Đơn hàng có dịch vụ (Service)
1. KHÔNG THỂ áp dụng quy trình rút gọn, bắt buộc phải tuân theo quy trình đầy đủ
2. Mỗi dịch vụ trong đơn hàng có trạng thái riêng: `pending → in_progress → completed`
3. Đơn hàng chỉ có thể chuyển sang `completed` khi tất cả dịch vụ đã hoàn thành
4. Thời gian hoàn thành đơn hàng phụ thuộc vào thời gian hoàn thành dịch vụ (thông qua `estimatedDuration` hoặc `completionDate`)

### C. Đơn hàng có thú cưng (Pet)
1. Có thể áp dụng quy trình rút gọn tương tự như đơn hàng chỉ có sản phẩm
2. Khác biệt: cần xác nhận tình trạng sức khỏe thú cưng trước khi bàn giao

### D. Đơn hàng hỗn hợp
1. Nếu có dịch vụ: tuân theo quy trình của đơn hàng có dịch vụ (không rút gọn)
2. Nếu chỉ có sản phẩm và thú cưng: có thể áp dụng quy trình rút gọn trong một số trường hợp

## XIII. Triển khai API và kiểm tra logic

### A. Kiểm tra trạng thái dịch vụ trên API Server

Để đảm bảo quy trình xử lý đơn hàng có dịch vụ tuân theo các quy tắc đã nêu, API server cần thực hiện các kiểm tra sau:

1. **Kiểm tra trước khi cập nhật trạng thái đơn hàng**:
   - Khi API nhận request cập nhật trạng thái đơn hàng thành `completed`
   - Kiểm tra đơn hàng có chứa dịch vụ hay không
   - Nếu có dịch vụ, kiểm tra tất cả dịch vụ đã ở trạng thái `completed` chưa
   - Nếu còn dịch vụ chưa hoàn thành, từ chối request và trả về mã lỗi

2. **Chặn quy trình rút gọn cho đơn có dịch vụ**:
   - Khi có request chuyển trạng thái đơn từ `pending` trực tiếp sang `completed`
   - Kiểm tra đơn hàng có chứa dịch vụ hay không
   - Nếu có dịch vụ, từ chối request và yêu cầu tuân theo quy trình đầy đủ

3. **Tự động kiểm tra hoàn thành đơn hàng**:
   - Khi một dịch vụ được cập nhật thành `completed`
   - Kiểm tra xem tất cả dịch vụ khác trong đơn đã hoàn thành chưa
   - Nếu tất cả đã hoàn thành và đơn hàng đang ở trạng thái `ready`, có thể tự động chuyển đơn sang `completed`

### B. Xử lý phía Client

Client cần được cập nhật để xử lý các trường hợp sau:

1. **Giao diện người dùng thích ứng**:
   - Hiển thị trạng thái riêng của từng dịch vụ
   - Vô hiệu hóa nút "Hoàn thành đơn hàng" nếu còn dịch vụ chưa hoàn thành
   - Hiển thị thông báo giải thích tại sao đơn hàng chưa thể hoàn thành

2. **Xử lý lỗi từ API**:
   - Hiển thị thông báo lỗi khi API từ chối cập nhật trạng thái
   - Hướng dẫn người dùng hoàn thành các dịch vụ trước khi hoàn thành đơn hàng

3. **Quy trình làm việc**:
   - Nhắc nhở nhân viên cập nhật trạng thái của từng dịch vụ
   - Hỗ trợ chuyển đổi giữa xem trạng thái đơn hàng tổng thể và trạng thái từng dịch vụ

### C. Khuyến nghị triển khai

Để triển khai các thay đổi này, chúng ta nên:

1. **Sửa API Server**:
   - Thêm logic kiểm tra vào API cập nhật trạng thái đơn hàng
   - Thêm các mã lỗi và phản hồi chi tiết
   - Thêm logic tự động cập nhật trạng thái đơn khi tất cả dịch vụ hoàn thành

2. **Cập nhật Client**:
   - Điều chỉnh giao diện để hiển thị trạng thái dịch vụ riêng
   - Thêm xử lý lỗi và thông báo người dùng
   - Cập nhật luồng làm việc của ứng dụng


