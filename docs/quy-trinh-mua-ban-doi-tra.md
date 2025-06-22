# Quy Trình Mua Bán, Đổi Trả Của Cửa Hàng YummyPet

## Mục lục
1. [Giới thiệu](#giới-thiệu)
   - [Định nghĩa Enum](#định-nghĩa-enum)
   - [Tổng quan các API chính](#tổng-quan-các-api-chính)
2. [Quy trình mua hàng](#quy-trình-mua-hàng)
   - [Mua hàng trực tuyến](#mua-hàng-trực-tuyến)
   - [Mua hàng tại cửa hàng](#mua-hàng-tại-cửa-hàng)
   - [Xử lý đơn hàng](#xử-lý-đơn-hàng)
   - [Cung cấp dịch vụ](#cung-cấp-dịch-vụ)
3. [Quy trình đổi trả hàng](#quy-trình-đổi-trả-hàng)
   - [Chính sách đổi trả](#chính-sách-đổi-trả)
   - [Điều kiện đổi trả](#điều-kiện-đổi-trả)
   - [Các bước đổi trả và API liên quan](#các-bước-đổi-trả-và-api-liên-quan)
4. [Giỏ hàng và thanh toán](#giỏ-hàng-và-thanh-toán)
   - [Quản lý giỏ hàng](#quản-lý-giỏ-hàng)
   - [Quy trình thanh toán](#quy-trình-thanh-toán)
5. [Hệ thống voucher và khuyến mãi](#hệ-thống-voucher-và-khuyến-mãi)
   - [Quản lý voucher](#quản-lý-voucher)
   - [Quy trình tạo và sử dụng voucher](#quy-trình-tạo-và-sử-dụng-voucher)
6. [Hệ thống tích điểm thưởng](#hệ-thống-tích-điểm-thưởng)
   - [Cách tích điểm](#cách-tích-điểm)
   - [Cách sử dụng điểm](#cách-sử-dụng-điểm)
   - [Quản lý điểm thưởng](#quản-lý-điểm-thưởng)
7. [Lịch hẹn dịch vụ](#lịch-hẹn-dịch-vụ)
   - [Loại dịch vụ](#loại-dịch-vụ)

   - [Quy trình xử lý dịch vụ](#quy-trình-xử-lý-dịch-vụ)
8. [Đánh giá và nhận xét](#đánh-giá-và-nhận-xét)
   - [Hệ thống đánh giá](#hệ-thống-đánh-giá)
   - [Quy trình đánh giá](#quy-trình-đánh-giá)
9. [Quản lý tài khoản và bảo mật](#quản-lý-tài-khoản-và-bảo-mật)
   - [Đăng ký và xác thực tài khoản](#đăng-ký-và-xác-thực-tài-khoản)
   - [Bảo mật thông tin](#bảo-mật-thông-tin)
   - [Các tiêu chuẩn bảo mật ứng dụng](#các-tiêu-chuẩn-bảo-mật-ứng-dụng)
10. [Báo cáo và phân tích dữ liệu](#báo-cáo-và-phân-tích-dữ-liệu)
    - [Báo cáo bán hàng](#báo-cáo-bán-hàng)
    - [Báo cáo tồn kho](#báo-cáo-tồn-kho)
    - [Báo cáo đổi trả](#báo-cáo-đổi-trả)
    - [Bảng điều khiển (Dashboard)](#bảng-điều-khiển-dashboard)
11. [Hệ thống thông báo](#hệ-thống-thông-báo)
    - [Loại thông báo](#loại-thông-báo)
    - [Chiến lược thông báo](#chiến-lược-thông-báo)
    - [Quản lý tần suất thông báo](#quản-lý-tần-suất-thông-báo)
12. [Xử lý sự cố phổ biến](#xử-lý-sự-cố-phổ-biến)
    - [Đơn hàng và thanh toán](#đơn-hàng-và-thanh-toán)
    - [Giao hàng](#giao-hàng)
    - [Đổi trả](#đổi-trả)
    - [Tài khoản và bảo mật](#tài-khoản-và-bảo-mật)

## Giới thiệu

YummyPet là cửa hàng chuyên cung cấp các sản phẩm và dịch vụ dành cho thú cưng. Tài liệu này mô tả chi tiết quy trình mua bán, đổi trả sản phẩm và cung cấp dịch vụ của cửa hàng, bao gồm cả hoạt động online và trực tiếp tại cửa hàng.

### Định nghĩa Enum

Dưới đây là các giá trị enum được sử dụng trong hệ thống API:

#### OrderStatus (Trạng thái đơn hàng)
- `pending`: Đang chờ xử lý
- `confirmed`: Đã xác nhận
- `processing`: Đang xử lý
- `ready`: Sẵn sàng (giao hàng hoặc lấy tại cửa hàng)
- `completed`: Đã hoàn thành
- `cancelled`: Đã hủy

#### PaymentStatus (Trạng thái thanh toán)
- `pending`: Chưa thanh toán
- `paid`: Đã thanh toán
- `refunded`: Đã hoàn tiền
- `partially_refunded`: Đã hoàn tiền một phần

#### PaymentMethod (Phương thức thanh toán)
- `cash`: Tiền mặt
- `card`: Thẻ tín dụng/ghi nợ
- `bank_transfer`: Chuyển khoản ngân hàng
- `wallet`: Ví điện tử (MoMo, ZaloPay, v.v)

#### DeliveryMethod (Phương thức giao hàng)
- `pickup`: Nhận tại cửa hàng
- `delivery`: Giao hàng tận nơi

#### OrderSource (Nguồn đơn hàng)
- `online`: Đơn hàng được đặt online
- `in_store`: Đơn hàng được tạo trực tiếp tại cửa hàng

#### ReturnStatus (Trạng thái đơn đổi trả)
- `pending`: Đang chờ xử lý
- `approved`: Đã phê duyệt
- `rejected`: Đã từ chối
- `completed`: Đã hoàn thành

#### ReturnExchangeType (Loại đơn đổi trả)
- `return_`: Đổi trả (hoàn tiền)
- `exchange`: Đổi hàng

#### ConditionStatus (Tình trạng sản phẩm)
- `new_`: Mới, chưa sử dụng
- `good`: Còn tốt
- `damaged`: Bị hỏng
- `defective`: Bị lỗi

#### ItemType (Loại mặt hàng)
- `product`: Sản phẩm
- `pet`: Thú cưng
- `service`: Dịch vụ

### Tổng quan các API chính

#### API Quản lý đơn hàng
| Phương thức | Endpoint | Mô tả | Enum và trạng thái | Quyền truy cập |
|------------|----------|-------|-------------------|---------------|
| POST | `/api/orders/online` | Tạo đơn hàng trực tuyến | OrderStatus: `pending`<br>OrderSource: `online` | Customer |
| POST | `/api/orders/instore` | Tạo đơn hàng tại cửa hàng | OrderStatus: `pending`<br>OrderSource: `in_store` | Staff, Admin |
| GET | `/api/orders` | Lấy danh sách đơn hàng | - | Staff, Admin |
| GET | `/api/orders/my-orders` | Lấy đơn hàng của khách hàng hiện tại | - | Customer |
| GET | `/api/orders/{id}` | Xem chi tiết đơn hàng | - | Customer (của họ), Staff, Admin |
| PUT | `/api/orders/{id}/status` | Cập nhật trạng thái đơn hàng | OrderStatus: `confirmed`, `processing`, `ready`, `completed`, `cancelled` | Staff, Admin |
| PUT | `/api/orders/{id}/payment` | Cập nhật thông tin thanh toán | PaymentStatus: `paid`, `refunded`, `partially_refunded`<br>PaymentMethod: `cash`, `card`, `bank_transfer`, `wallet` | Staff, Admin |
| PUT | `/api/orders/{id}/cancel` | Hủy đơn hàng | OrderStatus: `cancelled` | Customer (của họ, còn pending), Staff, Admin |

#### API Đổi trả hàng
| Phương thức | Endpoint | Mô tả | Trạng thái | Quyền truy cập |
|------------|----------|-------|------------|---------------|
| POST | `/api/returns` | Tạo yêu cầu đổi trả | Tạo với trạng thái `pending` | Customer, Staff, Admin |
| GET | `/api/returns` | Lấy danh sách đơn đổi trả | - | Customer (của họ), Staff, Admin |
| GET | `/api/returns/{id}` | Xem chi tiết đơn đổi trả | - | Customer (của họ), Staff, Admin |
| PUT | `/api/returns/{id}/approve` | Phê duyệt đơn đổi trả | Chuyển từ `pending` sang `approved` | Staff, Admin |
| PUT | `/api/returns/{id}/complete` | Hoàn tất đơn đổi trả | Chuyển từ `approved` sang `completed` | Staff, Admin |
| PUT | `/api/returns/{id}/reject` | Từ chối đơn đổi trả | Chuyển từ `pending` sang `rejected` | Staff, Admin |

#### API Xác thực & Tài khoản
| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| POST | `/api/auth/register` | Đăng ký tài khoản | Public |
| POST | `/api/auth/login` | Đăng nhập | Public |
| POST | `/api/auth/forgot-password` | Quên mật khẩu | Public |
| POST | `/api/auth/reset-password` | Đặt lại mật khẩu | Public (với token) |
| GET | `/api/customers/me` | Xem thông tin cá nhân | Customer |
| PUT | `/api/customers/me` | Cập nhật thông tin cá nhân | Customer |
| GET | `/api/customers/{id}/loyalty-points` | Xem điểm tích lũy | Admin, Staff, Customer (của họ) |
| POST | `/api/customers/{id}/loyalty-points` | Cập nhật điểm tích lũy | Admin, Staff |
| GET | `/api/customers/{id}/loyalty-history` | Xem lịch sử điểm tích lũy | Admin, Staff, Customer (của họ) |

#### API Quản lý sản phẩm
| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| GET | `/api/products` | Lấy danh sách sản phẩm | Public |
| GET | `/api/products/search` | Tìm kiếm sản phẩm theo nhiều tiêu chí | Public |
| GET | `/api/products/{id}` | Xem chi tiết sản phẩm | Public |
| POST | `/api/products` | Tạo sản phẩm mới | Admin, Staff |
| PUT | `/api/products/{id}` | Cập nhật thông tin sản phẩm | Admin, Staff |
| DELETE | `/api/products/{id}` | Xóa hoặc vô hiệu hóa sản phẩm | Admin |

#### API Quản lý thú cưng
| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| GET | `/api/pets` | Lấy danh sách thú cưng | Public |
| GET | `/api/pets/search` | Tìm kiếm thú cưng theo nhiều tiêu chí | Public |
| GET | `/api/pets/{id}` | Xem chi tiết thú cưng | Public |
| POST | `/api/pets` | Thêm thú cưng mới | Admin, Staff |
| PUT | `/api/pets/{id}` | Cập nhật thông tin thú cưng | Admin, Staff |
| DELETE | `/api/pets/{id}` | Xóa hoặc đánh dấu đã bán | Admin |
| GET | `/api/pets/{id}/images` | Xem hình ảnh thú cưng | Public |
| POST | `/api/pets/{id}/images` | Thêm hình ảnh thú cưng | Admin, Staff |

#### API Quản lý dịch vụ
| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| GET | `/api/services` | Lấy danh sách dịch vụ | Public |
| GET | `/api/services/{id}` | Xem chi tiết dịch vụ | Public |
| POST | `/api/services` | Thêm dịch vụ mới | Admin |
| PUT | `/api/services/{id}` | Cập nhật thông tin dịch vụ | Admin |
| DELETE | `/api/services/{id}` | Xóa hoặc vô hiệu hóa dịch vụ | Admin |

| GET | `/api/services/appointment` | Xem lịch hẹn dịch vụ | Admin, Staff, Customer (của họ) |

#### API Quản lý danh mục
| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| GET | `/api/categories` | Lấy danh sách danh mục | Public |
| GET | `/api/categories/all` | Lấy danh sách không phân trang | Public |
| GET | `/api/categories/type/{type}` | Lấy danh mục theo loại (product, pet, service) | Public |
| POST | `/api/categories` | Thêm danh mục mới | Admin |
| PUT | `/api/categories/{id}` | Cập nhật thông tin danh mục | Admin |
| DELETE | `/api/categories/{id}` | Xóa danh mục | Admin |

#### API Quản lý voucher
| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| GET | `/api/vouchers` | Lấy danh sách voucher | Admin |
| GET | `/api/vouchers/available` | Lấy voucher có thể sử dụng | Customer |
| GET | `/api/vouchers/{id}` | Xem chi tiết voucher | Admin, Customer (nếu đủ điều kiện) |
| POST | `/api/vouchers` | Tạo voucher mới | Admin |
| PUT | `/api/vouchers/{id}` | Cập nhật thông tin voucher | Admin |
| DELETE | `/api/vouchers/{id}` | Xóa voucher | Admin |
| POST | `/api/vouchers/validate` | Kiểm tra tính hợp lệ của voucher | Customer, Admin, Staff |

#### API Quản lý tồn kho
| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| POST | `/api/product-stock/batch-update` | Cập nhật số lượng tồn kho cho nhiều sản phẩm | Admin, Staff |
| GET | `/api/product-stock/low-stock` | Danh sách sản phẩm sắp hết hàng | Admin, Staff |

## Quy trình mua hàng

### Mua hàng trực tuyến

#### 1. Đăng ký và đăng nhập
- Khách hàng có thể đăng ký tài khoản mới hoặc đăng nhập vào tài khoản hiện có
- Khách vãng lai cũng có thể mua hàng mà không cần đăng nhập

#### 2. Tìm kiếm và chọn sản phẩm
- Khách hàng tìm kiếm sản phẩm theo danh mục
- Xem chi tiết sản phẩm, giá cả và thông tin

#### 3. Thêm vào giỏ hàng
- Chọn số lượng sản phẩm
- Thêm sản phẩm vào giỏ hàng
- Có thể tiếp tục mua sắm hoặc thanh toán ngay

#### 4. Tiến hành thanh toán
- Kiểm tra giỏ hàng
- Áp dụng voucher (nếu có)
- Sử dụng điểm tích lũy (nếu có và muốn dùng)
- Chọn phương thức giao hàng (shipping hoặc pickup)
- Nhập địa chỉ giao hàng (nếu chọn shipping)
- Chọn phương thức thanh toán (tiền mặt, thẻ tín dụng, chuyển khoản)

#### 5. Xác nhận đơn hàng
- Hệ thống tạo đơn hàng với mã đơn hàng duy nhất (ORD******)
- Gửi email xác nhận đơn hàng cho khách hàng
- Đơn hàng được chuyển sang trạng thái "pending"

**API tạo đơn hàng online**:
```
POST /api/orders/online
```
```json
{
  "customerId": 1,
  "paymentMethod": "card",  /* Giá trị enum: "cash", "card", "bank_transfer", "wallet" */
  "deliveryMethod": "delivery",  /* Giá trị enum: "pickup", "delivery" */
  "deliveryAddress": "123 Đường Lê Lợi, Quận 1, TP.HCM",
  "notes": "Vui lòng gọi trước khi giao hàng",
  "voucherId": 10,
  "loyaltyPointsUsed": 20,
  "items": [
    {
      "itemType": "product",  /* Giá trị enum: "product", "pet", "service" */
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

**Lưu ý bảo mật**: Hệ thống sẽ tự động sử dụng ID của khách hàng đang đăng nhập, bất kể ID nào được truyền vào trong request. Điều này đảm bảo khách hàng không thể tạo đơn hàng cho người khác.

#### 6. Thanh toán
- Nếu chọn thanh toán online, khách hàng được chuyển đến cổng thanh toán
- Sau khi thanh toán thành công, trạng thái thanh toán được cập nhật thành "paid"
- Nếu chọn thanh toán khi nhận hàng (COD), trạng thái thanh toán vẫn là "pending"

**API xác nhận thanh toán (Admin/Staff)**:
```
PUT /api/orders/{id}/payment
```
```json
{
  "paymentStatus": "paid",  /* Giá trị enum: "pending", "paid", "refunded", "partially_refunded" */
  "paymentMethod": "card",  /* Giá trị enum: "cash", "card", "bank_transfer", "wallet" */
  "paymentReference": "Trans123456"
}
```

**Lưu ý bảo mật**: Chỉ admin và staff mới có quyền xác nhận thanh toán đơn hàng.

### Mua hàng tại cửa hàng

#### 1. Tư vấn và chọn sản phẩm
- Khách hàng đến cửa hàng và được nhân viên tư vấn
- Chọn sản phẩm, dịch vụ phù hợp

#### 2. Tạo đơn hàng
- Nhân viên tạo đơn hàng trực tiếp trên hệ thống POS
- Nếu khách hàng đã có tài khoản, nhân viên có thể tìm kiếm theo số điện thoại
- Nếu là khách vãng lai, nhân viên có thể tạo đơn không cần thông tin khách hàng

#### 3. Thanh toán
- Khách hàng thanh toán trực tiếp bằng tiền mặt, thẻ, hoặc chuyển khoản
- Nhân viên cập nhật trạng thái thanh toán thành "paid"
- Hệ thống tự động in hóa đơn cho khách hàng

### Xử lý đơn hàng

#### 1. Xác nhận đơn hàng (Từ trạng thái "pending" sang "confirmed")
- Nhân viên kiểm tra đơn hàng và tồn kho
- Chỉ admin và staff có quyền thay đổi trạng thái đơn hàng
- Hệ thống cập nhật đơn hàng sang trạng thái "confirmed"

**API để xác nhận đơn hàng**:
```
PUT /api/orders/{id}/status
```
```json
{
  "status": "confirmed"  /* Giá trị enum OrderStatus: "pending", "confirmed", "processing", "ready", "completed", "cancelled" */
}
```

**Lưu ý bảo mật**: Chỉ admin và staff mới có quyền thay đổi trạng thái đơn hàng.

#### 2. Xử lý đơn hàng (Từ "confirmed" sang "processing")
- Nhân viên tiến hành lấy sản phẩm từ kho
- Cập nhật trạng thái đơn hàng sang "processing"

**API để chuyển sang trạng thái xử lý**:
```
PUT /api/orders/{id}/status
```
```json
{
  "status": "processing"
}
```

**Lưu ý bảo mật**: Chỉ admin và staff mới có quyền thay đổi trạng thái đơn hàng.

#### 3. Giao hàng (Từ "processing" sang "ready")
- Đối với đơn online chọn giao hàng:
   - Nhân viên đóng gói sản phẩm
   - Cập nhật trạng thái sang "ready"
   - Cung cấp thông tin vận chuyển cho khách hàng
- Đối với đơn online chọn nhận tại cửa hàng:
   - Nhân viên chuẩn bị sản phẩm chờ khách đến lấy
   - Cập nhật trạng thái sang "ready"

**API để chuyển sang trạng thái sẵn sàng giao hàng**:
```
PUT /api/orders/{id}/status
```
```json
{
  "status": "ready",
  "shippingInfo": "Đơn vị vận chuyển: GHN, Mã vận đơn: GHN12345678"
}
```

**Lưu ý bảo mật**: Chỉ admin và staff mới có quyền thay đổi trạng thái đơn hàng.

#### 4. Hoàn thành đơn hàng (Sang trạng thái "completed")
- Khi khách hàng đã nhận được hàng, đơn hàng được cập nhật sang trạng thái "completed"
- Đối với COD, nhân viên cập nhật trạng thái thanh toán thành "paid"
- Điểm tích lũy được cộng vào tài khoản khách hàng (nếu có)

**API để hoàn thành đơn hàng**:
```
PUT /api/orders/{id}/status
```
```json
{
  "status": "completed"
}
```

**Lưu ý bảo mật**: Chỉ admin và staff mới có quyền đánh dấu đơn hàng là đã hoàn thành.

#### 5. Hủy đơn hàng (Sang trạng thái "cancelled")
- Khách hàng chỉ có thể hủy đơn khi đơn còn ở trạng thái "pending"
- Admin và staff có thể hủy đơn ở mọi trạng thái trừ "completed"
- Lý do hủy đơn cần được ghi lại
- Nếu đã thanh toán, tiền sẽ được hoàn lại cho khách hàng

**API để khách hàng hủy đơn**:
```
PUT /api/orders/{id}/cancel
```
```json
{
  "reason": "Muốn thay đổi sản phẩm"
}
```

**API để admin/staff hủy đơn hàng**:
```
PUT /api/orders/{id}/status
```
```json
{
  "status": "cancelled",
  "cancelReason": "Sản phẩm hết hàng"
}
```

**Lưu ý bảo mật**: 
- Khách hàng chỉ có thể hủy đơn hàng của chính mình và chỉ khi đơn hàng ở trạng thái "pending"
- Admin và staff có thể hủy bất kỳ đơn hàng nào chưa hoàn thành

### Cung cấp dịch vụ


- Chọn loại dịch vụ, thời gian, và cung cấp thông tin thú cưng

#### 2. Xác nhận lịch hẹn
- Nhân viên xác nhận lịch hẹn
- Gửi thông báo nhắc lịch cho khách

#### 3. Thực hiện dịch vụ
- Khách hàng mang thú cưng đến cửa hàng theo lịch hẹn
- Nhân viên tiến hành dịch vụ
- Cập nhật trạng thái dịch vụ trong hệ thống

#### 4. Thanh toán và hoàn thành
- Khách hàng thanh toán sau khi dịch vụ hoàn tất
- Nhân viên cập nhật trạng thái thành "completed"

## Quy trình đổi trả hàng

### Chính sách đổi trả

- **Thời gian đổi trả**: Trong vòng 7 ngày kể từ ngày nhận hàng
- **Sản phẩm đủ điều kiện**: Sản phẩm còn nguyên vẹn, chưa qua sử dụng hoặc còn trong tình trạng tốt
- **Sản phẩm không đổi trả**: Thức ăn tươi sống, thuốc đã mở bao bì, sản phẩm giảm giá đặc biệt

### Điều kiện đổi trả

1. **Đơn hàng phải ở trạng thái "completed"**: Chỉ có thể đổi trả các đơn hàng đã hoàn thành
2. **Tình trạng sản phẩm**: 
   - **Mới (new_)**: Hoàn tiền 100%
   - **Tốt (good)**: Hoàn tiền 80-90% tùy sản phẩm
   - **Hỏng (damaged)**: Chỉ đổi trả nếu là lỗi từ phía cửa hàng
   - **Lỗi (defective)**: Đổi sản phẩm mới hoặc hoàn tiền 100%
3. **Có hóa đơn hoặc mã đơn hàng** kèm theo

### Các bước đổi trả và API liên quan

#### 1. Yêu cầu đổi trả (Khách hàng)
- Khách hàng gửi yêu cầu đổi trả qua website hoặc trực tiếp đến cửa hàng
- Cung cấp thông tin đơn hàng, lý do đổi trả, và tình trạng sản phẩm
- Yêu cầu được tạo với mã đổi trả duy nhất (RTN******) và ở trạng thái "pending"
- **Lưu ý an toàn**: Hệ thống tự động xác thực khách hàng và chỉ cho phép đổi trả đơn hàng của chính họ

**API để gọi**:
```
POST /api/returns
```
```json
{
  "orderId": 123,
  "customerId": 1,
  "type": "return_",  /* Giá trị enum: "return_" hoặc "exchange" */
  "reason": "Sản phẩm bị lỗi",
  "notes": "Vui lòng hoàn tiền",
  "items": [
    {
      "orderItemId": 245,
      "itemType": "product",  /* Giá trị enum: "product", "pet", hoặc "service" */
      "quantity": 1,
      "conditionStatus": "new_",  /* Giá trị enum: "new_", "good", "damaged", "defective" */
      "notes": "Chưa sử dụng"
    }
  ]
}
```

**Lưu ý bảo mật**: API tự động xác thực và ghi đè `customerId` thành ID của khách hàng đang đăng nhập nếu là tài khoản khách hàng thông thường (không phải admin/staff). Điều này ngăn chặn việc khách hàng gửi yêu cầu đổi trả cho tài khoản khác.

#### 2. Kiểm tra và phê duyệt (Admin/Staff)
- Nhân viên kiểm tra thông tin đổi trả và tình trạng sản phẩm
- Chỉ Admin và Staff có quyền phê duyệt đơn đổi trả
- Nhân viên cập nhật trạng thái đơn đổi trả thành "approved" hoặc "rejected"
- Nếu phê duyệt, sản phẩm được hoàn lại vào kho

**API để xem đơn đổi trả**:
```
GET /api/returns
GET /api/returns/{id}
GET /api/returns/code/{returnCode}
```

**API để phê duyệt đơn đổi trả**:
```
PUT /api/returns/{id}/approve
```
```json
{
  "processedById": 5  /* Optional - ID của nhân viên xử lý */
}
```

**Lưu ý bảo mật**: Chỉ tài khoản có quyền admin hoặc staff mới có thể gọi API này. Nếu không cung cấp processedById, hệ thống sẽ tự động sử dụng ID của người dùng đang đăng nhập.

#### 3. Hoàn tiền hoặc đổi sản phẩm (Admin/Staff)
- Nếu là đổi sản phẩm khác: Nhân viên chuẩn bị sản phẩm thay thế
- Nếu là hoàn tiền: Nhân viên xác định số tiền hoàn trả dựa trên tình trạng sản phẩm
- Chỉ Admin và Staff có quyền xác nhận hoàn tiền
- Nhân viên cập nhật trạng thái đơn đổi trả thành "completed"

**API để hoàn tất đơn đổi trả**:
```
PUT /api/returns/{id}/complete
```
```json
{
  "refundAmount": 150000  /* Số tiền hoàn trả */
}
```

**Lưu ý bảo mật**: Chỉ tài khoản có quyền admin hoặc staff mới có thể gọi API này. Hệ thống sẽ kiểm tra quyền truy cập trước khi thực hiện thao tác.

#### 4. Từ chối đơn đổi trả (Admin/Staff)
- Nếu sản phẩm không đáp ứng điều kiện đổi trả
- Nhân viên giải thích lý do từ chối và ghi lại trong hệ thống
- Trạng thái đơn đổi trả được cập nhật thành "rejected"

**API để từ chối đơn đổi trả**:
```
PUT /api/returns/{id}/reject
```
```json
{
  "reason": "Sản phẩm đã qua sử dụng nhiều",
  "processedById": 5  /* Optional - ID của nhân viên xử lý */
}
```

**Lưu ý bảo mật**: Chỉ tài khoản có quyền admin hoặc staff mới có thể gọi API này. Hệ thống sẽ tự động lưu lại thông tin người từ chối để đảm bảo tính minh bạch.

## Quản lý tài khoản và bảo mật

### Đăng ký và xác thực tài khoản
- Khách hàng đăng ký bằng email, số điện thoại và mật khẩu
- Xác thực email hoặc số điện thoại để kích hoạt tài khoản

**API đăng ký tài khoản**:
```
POST /api/auth/register
```
```json
{
  "email": "nguyenvana@example.com",
  "password": "matkhau123",
  "phone": "0987654321",
  "fullName": "Nguyễn Văn A"
}
```

**API đăng nhập**:
```
POST /api/auth/login
```
```json
{
  "email": "nguyenvana@example.com",
  "password": "matkhau123"
}
```

**API quên mật khẩu**:
```
POST /api/auth/forgot-password
```
```json
{
  "email": "nguyenvana@example.com"
}
```

**API đặt lại mật khẩu**:
```
POST /api/auth/reset-password
```
```json
{
  "token": "reset_token",
  "newPassword": "matkhaumoi123"
}
```

### Bảo mật thông tin
- **Phân quyền hệ thống**:
  - Customer: Chỉ xem và thao tác với dữ liệu của chính mình
  - Staff: Xem và xử lý đơn hàng, không thể thay đổi quyền hạn
  - Admin: Toàn quyền quản lý hệ thống
- **Xác thực và phân quyền API**:
  - Sử dụng JWT (JSON Web Token) để xác thực người dùng
  - Kiểm tra quyền truy cập trước mọi thao tác API
  - Ghi log tất cả các thao tác nhạy cảm
- **Bảo vệ dữ liệu khách hàng**:
  - Dữ liệu khách hàng được mã hóa
  - Các thao tác liên quan đến dữ liệu cá nhân đều được xác thực

**API xem thông tin cá nhân**:
```
GET /api/customers/me
```

**API cập nhật thông tin cá nhân**:
```
PUT /api/customers/me
```
```json
{
  "fullName": "Nguyễn Văn A",
  "phone": "0987654321",
  "address": "123 Đường Lê Lợi, Quận 1, TP.HCM"
}
```

**API xem lịch sử đơn hàng của bản thân**:
```
GET /api/orders/my-orders
```

**API xem chi tiết đơn hàng của bản thân**:
```
GET /api/orders/{id}
```

**Lưu ý bảo mật**: Hệ thống kiểm tra xem khách hàng chỉ có thể xem đơn hàng của chính mình. Admin và staff có thể xem mọi đơn hàng.

### Các tiêu chuẩn bảo mật ứng dụng

#### Xác thực và phân quyền
1. **Sử dụng JWT có thời hạn ngắn**: Token JWT hết hạn trong 1 giờ để giảm thiểu rủi ro
2. **Kiểm tra phân quyền nhiều lớp**:
   - Lớp Controller: Kiểm tra quyền trước khi thực hiện API
   - Lớp Service: Kiểm tra lại logic nghiệp vụ và quyền
   - Sử dụng Spring Security với cấu hình chi tiết

#### Bảo vệ dữ liệu
1. **Mã hóa dữ liệu nhạy cảm**:
   - Mật khẩu sử dụng BCrypt
   - Thông tin thanh toán được mã hóa
2. **Kiểm tra đầu vào**:
   - Sử dụng Bean Validation (@Valid)
   - Lọc dữ liệu để tránh SQL Injection, XSS

#### Ghi log và kiểm soát hoạt động
1. **Ghi log hoạt động nhạy cảm**:
   - Đăng nhập/đăng xuất
   - Thay đổi đơn hàng
   - Phê duyệt/từ chối đổi trả
2. **Kiểm soát phiên**:
   - Giới hạn số phiên đồng thời cho một tài khoản
   - Tính năng đăng xuất khỏi tất cả thiết bị

#### Bảo mật giao tiếp
1. **Sử dụng HTTPS**: Bắt buộc sử dụng HTTPS cho mọi kết nối
2. **Bảo vệ từ CSRF và CORS**:
   - Cấu hình CORS phù hợp cho API
   - Tokens CSRF cho các hoạt động quan trọng

## Hệ thống tích điểm thưởng

### Cách tích điểm
- Mỗi 10,000đ chi tiêu sẽ được tích 1 điểm thưởng
- Chỉ áp dụng cho đơn hàng đã hoàn thành
- Không áp dụng cho số tiền đã được giảm giá qua voucher
- Áp dụng cho cả mua hàng online và tại cửa hàng
- Có thể thay đổi tỷ lệ qua cài đặt hệ thống (LOYALTY_POINTS_RATE)

### Cách sử dụng điểm
- 1 điểm = 1,000đ khi áp dụng vào đơn hàng
- Khách hàng có thể chọn số điểm muốn dùng khi thanh toán
- Không thể sử dụng quá số điểm hiện có
- Điểm được hoàn lại nếu đơn hàng bị hủy
- Có thể thay đổi giá trị điểm qua cài đặt hệ thống (LOYALTY_POINT_VALUE)

### Quản lý điểm thưởng
- Admin và staff có thể thêm/trừ điểm thủ công cho khách hàng
- Điểm không bị trừ khi đổi trả hàng
- Hệ thống lưu lại lịch sử tích điểm và sử dụng điểm

**API xem điểm tích lũy**:
```
GET /api/customers/{id}/loyalty-points
```

**API cập nhật điểm tích lũy (Admin/Staff)**:
```
POST /api/customers/{id}/loyalty-points
```
```json
{
  "points": 10,
  "pointType": "EARN",
  "notes": "Thêm điểm khuyến mãi"
}
```

**API xem lịch sử điểm tích lũy**:
```
GET /api/customers/{id}/loyalty-history
```

## Báo cáo và phân tích dữ liệu

### Báo cáo bán hàng
- **Báo cáo doanh thu theo thời gian**:
  - Theo ngày, tuần, tháng, quý, năm
  - So sánh với cùng kỳ năm trước
- **Báo cáo doanh thu theo danh mục**:
  - Phân tích sản phẩm, thú cưng, dịch vụ nào bán chạy nhất
  - Tỷ lệ đóng góp của từng danh mục vào doanh thu
- **Báo cáo doanh thu theo khách hàng**:
  - Khách hàng tiềm năng
  - Tần suất mua hàng

**API thống kê đơn hàng**:
```
GET /api/orders/statistics
```

**Tham số truy vấn**:
- `fromDate`: Ngày bắt đầu (format: yyyy-MM-dd)
- `toDate`: Ngày kết thúc (format: yyyy-MM-dd)

**Phản hồi mẫu**:
```json
{
  "success": true,
  "message": "Thống kê đơn hàng",
  "data": {
    "totalOrders": 105,
    "totalRevenue": 158000000,
    "averageOrderValue": 1505000,
    "ordersByStatus": {
      "pending": 5,
      "confirmed": 10,
      "processing": 15,
      "ready": 20,
      "completed": 50,
      "cancelled": 5
    },
    "revenueByCategory": {
      "product": 95000000,
      "pet": 55000000,
      "service": 8000000
    },
    "topProducts": [
      {
        "productId": 5,
        "productName": "Royal Canin Medium Adult",
        "totalSold": 45,
        "revenue": 40050000
      },
      {...}
    ]
  }
}
```

### Báo cáo tồn kho
- **Báo cáo hàng tồn**:
  - Sản phẩm sắp hết hàng
  - Sản phẩm tồn kho lâu
- **Dự báo nhu cầu**:
  - Dựa trên dữ liệu bán hàng trước đó
  - Gợi ý nhập hàng theo thời vụ

**API xem sản phẩm sắp hết hàng**:
```
GET /api/product-stock/low-stock
```

### Báo cáo đổi trả
- **Tỷ lệ đổi trả**:
  - Theo danh mục
  - Theo sản phẩm
- **Lý do đổi trả**:
  - Phân tích lý do phổ biến
  - Đề xuất cải thiện

### Bảng điều khiển (Dashboard)
- **Tổng quan hoạt động hàng ngày**:
  - Số đơn hàng mới
  - Doanh thu
  - Tỷ lệ hoàn thành
- **Chỉ số hiệu quả (KPI)**:
  - Thời gian xử lý đơn hàng
  - Tỷ lệ chuyển đổi
  - Giá trị đơn hàng trung bình

## Hệ thống voucher và khuyến mãi

### Quản lý voucher
- **Loại voucher**:
  - Giảm theo phần trăm (PERCENT): Giảm theo % giá trị đơn hàng
  - Giảm giá cố định (FIXED): Giảm một số tiền cố định
- **Điều kiện sử dụng**:
  - Giá trị đơn hàng tối thiểu
  - Giới hạn số lượng sử dụng
  - Thời gian hiệu lực
  - Giới hạn giá trị giảm tối đa (cho voucher %)

### Quy trình tạo và sử dụng voucher
1. **Tạo voucher**:
   - Admin tạo voucher với các điều kiện cụ thể
   - Có thể tạo voucher chung hoặc dành riêng cho khách hàng VIP
   - Thiết lập thời gian hiệu lực và giới hạn sử dụng

2. **Hiển thị voucher**:
   - Khách hàng có thể xem các voucher khả dụng trong tài khoản
   - Lọc voucher theo điều kiện sử dụng

3. **Áp dụng voucher**:
   - Khách hàng chọn voucher khi thanh toán
   - Hệ thống kiểm tra tính hợp lệ (đủ điều kiện, còn hiệu lực)
   - Tính toán số tiền giảm giá
   - Tăng số lần sử dụng voucher nếu áp dụng thành công

4. **Hủy voucher**:
   - Nếu đơn hàng bị hủy, voucher không bị tính lần sử dụng

**API lấy voucher khả dụng**:
```
GET /api/vouchers/available
```

**API kiểm tra tính hợp lệ của voucher**:
```
POST /api/vouchers/validate
```
```json
{
  "code": "WELCOME10",
  "totalAmount": 500000
}
```

**Phản hồi mẫu**:
```json
{
  "success": true,
  "message": "Voucher hợp lệ",
  "data": {
    "id": 1,
    "code": "WELCOME10",
    "name": "Giảm 10% cho khách hàng mới",
    "discountType": "PERCENT",
    "discountValue": 10,
    "minOrderAmount": 500000,
    "maxDiscountAmount": 100000,
    "usageLimit": 100,
    "usedCount": 25,
    "startDate": "2025-06-01T00:00:00",
    "endDate": "2025-07-01T23:59:59",
    "isActive": true,
    "isValid": true,
    "calculatedDiscount": 50000
  }
}
```

## Giỏ hàng và thanh toán

### Quản lý giỏ hàng
- **Thêm sản phẩm vào giỏ**:
  - Lưu trạng thái giỏ hàng trong database hoặc localStorage
  - Có thể thêm sản phẩm, thú cưng vào giỏ
  - Dịch vụ thường được đặt riêng biệt

- **Cập nhật giỏ hàng**:
  - Thay đổi số lượng
  - Xóa sản phẩm
  - Lưu giỏ hàng cho khách đăng nhập

- **Kiểm tra tồn kho**:
  - Mỗi khi thêm sản phẩm hoặc tiến đến thanh toán
  - Cảnh báo nếu sản phẩm hết hàng hoặc không đủ số lượng

**API thêm vào giỏ hàng**:
```
POST /api/cart/items
```
```json
{
  "itemType": "product",
  "productId": 5,
  "quantity": 2
}
```

**API xem giỏ hàng**:
```
GET /api/cart
```

**API cập nhật số lượng**:
```
PUT /api/cart/items/{cartItemId}
```
```json
{
  "quantity": 3
}
```

**API xóa sản phẩm khỏi giỏ**:
```
DELETE /api/cart/items/{cartItemId}
```

### Quy trình thanh toán
1. **Xem lại giỏ hàng**:
   - Kiểm tra sản phẩm và số lượng
   - Cập nhật nếu cần thiết

2. **Chọn phương thức giao hàng**:
   - Giao hàng tận nơi (delivery)
   - Nhận tại cửa hàng (pickup)

3. **Áp dụng voucher và điểm thưởng**:
   - Chọn voucher từ danh sách khả dụng
   - Quyết định số điểm tích lũy muốn sử dụng

4. **Chọn phương thức thanh toán**:
   - Tiền mặt (cash): Thanh toán khi nhận hàng hoặc tại cửa hàng
   - Thẻ (card): Thanh toán qua thẻ tín dụng/ghi nợ
   - Chuyển khoản (bank_transfer): Thanh toán qua ngân hàng
   - Ví điện tử (wallet): Thanh toán qua MoMo, ZaloPay, VNPay...

5. **Xác nhận đơn hàng**:
   - Kiểm tra lại thông tin
   - Xác nhận và thanh toán (nếu chọn thanh toán online)

**API thanh toán đơn hàng**:
```
POST /api/orders/checkout
```
```json
{
  "cartId": 123,
  "paymentMethod": "card",
  "deliveryMethod": "delivery",
  "deliveryAddress": "123 Đường Lê Lợi, Quận 1, TP.HCM",
  "voucherId": 10,
  "loyaltyPointsUsed": 20,
  "notes": "Giao hàng vào buổi chiều"
}
```

**Phản hồi mẫu**:
```json
{
  "success": true,
  "message": "Đặt hàng thành công",
  "data": {
    "orderId": 123,
    "orderCode": "ORD000123",
    "totalAmount": 1200000,
    "paymentMethod": "card",
    "paymentUrl": "https://payment-gateway.com/checkout/123456789",
    "estimatedDeliveryDate": "2025-06-25"
  }
}
```

## Đánh giá và nhận xét

### Hệ thống đánh giá
- **Đối tượng đánh giá**:
  - Sản phẩm
  - Thú cưng
  - Dịch vụ
  - Trải nghiệm mua hàng tổng thể

- **Thành phần đánh giá**:
  - Số sao (1-5)
  - Nhận xét văn bản
  - Hình ảnh đính kèm (tùy chọn)

- **Điều kiện đánh giá**:
  - Chỉ khách hàng đã mua sản phẩm mới có thể đánh giá
  - Đơn hàng phải ở trạng thái "completed"
  - Mỗi mặt hàng chỉ được đánh giá một lần

### Quy trình đánh giá
1. **Gửi email nhắc nhở**:
   - Sau khi đơn hàng hoàn thành 3-5 ngày
   - Kèm theo link đánh giá trực tiếp

2. **Đánh giá sản phẩm**:
   - Khách hàng chọn số sao
   - Viết nhận xét chi tiết
   - Tải lên hình ảnh (nếu muốn)

3. **Kiểm duyệt đánh giá**:
   - Admin/Staff kiểm duyệt các đánh giá trước khi hiển thị
   - Lọc nội dung không phù hợp

4. **Hiển thị đánh giá**:
   - Hiển thị trên trang sản phẩm, thú cưng hoặc dịch vụ
   - Tổng hợp điểm đánh giá trung bình

5. **Phản hồi đánh giá**:
   - Admin/Staff có thể phản hồi các đánh giá của khách hàng
   - Khách hàng được thông báo khi có phản hồi

**API gửi đánh giá**:
```
POST /api/reviews
```
```json
{
  "orderId": 123,
  "orderItemId": 245,
  "itemType": "product",
  "itemId": 5,
  "rating": 5,
  "comment": "Sản phẩm chất lượng cao, thú cưng của tôi rất thích!",
  "images": ["base64Image1", "base64Image2"]
}
```

**API lấy đánh giá của sản phẩm**:
```
GET /api/reviews/product/{productId}
```

**API kiểm duyệt đánh giá**:
```
PUT /api/reviews/{id}/approve
```

**API phản hồi đánh giá**:
```
POST /api/reviews/{id}/reply
```
```json
{
  "reply": "Cảm ơn quý khách đã tin tưởng và sử dụng sản phẩm của chúng tôi!"
}
```

## Lịch hẹn dịch vụ

### Loại dịch vụ
- **Dịch vụ chăm sóc**: Tắm, cắt tỉa lông, vệ sinh
- **Dịch vụ y tế**: Khám bệnh, tiêm phòng, điều trị
- **Dịch vụ khác**: Huấn luyện, trông giữ thú cưng


```json
{
  "reason": "Có việc bận đột xuất"
}
```

**API đổi lịch hẹn**:
```
PUT /api/services/appointment/{id}/reschedule
```
```json
{
  "newAppointmentDate": "2025-06-26",
  "newAppointmentTime": "10:00"
}
```

### Quy trình xử lý dịch vụ
1. **Chuẩn bị dịch vụ**:
   - Nhân viên xem danh sách lịch hẹn trong ngày
   - Chuẩn bị dụng cụ, vật tư cần thiết

2. **Đón tiếp khách hàng**:
   - Xác nhận thông tin lịch hẹn
   - Kiểm tra tình trạng thú cưng trước khi tiến hành dịch vụ

3. **Thực hiện dịch vụ**:
   - Nhân viên được phân công thực hiện dịch vụ
   - Cập nhật trạng thái dịch vụ sang "processing"

4. **Hoàn thành dịch vụ**:
   - Kiểm tra lại kết quả dịch vụ
   - Cập nhật trạng thái dịch vụ sang "completed"
   - Ghi nhận các quan sát và khuyến nghị

5. **Thanh toán và lịch hẹn tiếp theo**:
   - Khách hàng thanh toán cho dịch vụ
   - Đề xuất lịch hẹn tiếp theo (nếu cần)

**API cập nhật trạng thái dịch vụ**:
```
PUT /api/services/appointment/{id}/status
```
```json
{
  "status": "completed",
  "healthObservations": "Thú cưng khỏe mạnh, lông đã được cắt tỉa gọn gàng",
  "recommendations": "Nên đặt lịch tắm định kỳ 2 tuần/lần",
  "nextServiceDate": "2025-07-09"
}
```

## Xử lý sự cố phổ biến

### Đơn hàng và thanh toán
- **Thanh toán không thành công**: 
  - **Nguyên nhân**: Thông tin thẻ không hợp lệ, lỗi cổng thanh toán, số dư không đủ
  - **Giải pháp**: Hướng dẫn khách hàng kiểm tra thông tin thanh toán và thử lại
  - **Quy trình xử lý**: 
    1. Kiểm tra logs thanh toán để xác định lỗi cụ thể
    2. Liên hệ với khách hàng thông báo về lỗi
    3. Đề xuất phương thức thanh toán thay thế
    4. Theo dõi đến khi thanh toán thành công

- **Không nhận được email xác nhận**: 
  - **Nguyên nhân**: Địa chỉ email không đúng, email rơi vào spam
  - **Giải pháp**: Kiểm tra hộp thư rác hoặc liên hệ hotline để xác nhận đơn hàng
  - **Quy trình xử lý**:
    1. Kiểm tra hệ thống đã gửi email thành công chưa
    2. Gửi lại email xác nhận nếu cần
    3. Xác nhận với khách đơn hàng đã được ghi nhận

- **Muốn thay đổi đơn hàng**: 
  - **Nguyên nhân**: Khách hàng muốn thêm/bớt sản phẩm, thay đổi địa chỉ
  - **Giải pháp**: Chỉ có thể thay đổi khi đơn hàng còn ở trạng thái "pending"
  - **Quy trình xử lý**:
    1. Nếu đơn hàng đã xác nhận, hướng dẫn khách hàng hủy đơn cũ và đặt đơn mới
    2. Nếu đơn hàng còn pending, nhân viên có thể chỉnh sửa theo yêu cầu

- **Mã voucher không áp dụng được**:
  - **Nguyên nhân**: Voucher hết hạn, không đủ điều kiện, đã hết lượt sử dụng
  - **Giải pháp**: Kiểm tra điều kiện áp dụng voucher và thông báo cho khách hàng
  - **Quy trình xử lý**:
    1. Kiểm tra trạng thái và điều kiện voucher
    2. Giải thích cụ thể lý do không áp dụng được
    3. Đề xuất voucher thay thế nếu có

### Giao hàng
- **Chậm giao hàng**: 
  - **Nguyên nhân**: Vấn đề kho hàng, vận chuyển, địa chỉ không rõ ràng
  - **Giải pháp**: Cung cấp thông tin vận chuyển cập nhật và lý do chậm trễ
  - **Quy trình xử lý**:
    1. Kiểm tra trạng thái đơn hàng trong hệ thống
    2. Liên hệ với đơn vị vận chuyển để lấy thông tin
    3. Thông báo cho khách hàng về tình trạng và thời gian dự kiến

- **Hàng giao sai địa chỉ**: 
  - **Nguyên nhân**: Nhập địa chỉ sai, lỗi từ đơn vị vận chuyển
  - **Giải pháp**: Xác minh thông tin và sắp xếp giao lại
  - **Quy trình xử lý**:
    1. Kiểm tra địa chỉ trong hệ thống
    2. Liên hệ với khách hàng xác nhận địa chỉ chính xác
    3. Yêu cầu đơn vị vận chuyển điều chỉnh

- **Sản phẩm bị hư hỏng khi giao**: 
  - **Nguyên nhân**: Đóng gói không đúng, vận chuyển thiếu cẩn thận
  - **Giải pháp**: Tiến hành quy trình đổi trả ngay lập tức
  - **Quy trình xử lý**:
    1. Yêu cầu khách chụp ảnh sản phẩm hư hỏng
    2. Tạo đơn đổi trả với mã ưu tiên
    3. Xử lý gấp để gửi sản phẩm thay thế

- **Giao thiếu hàng**:
  - **Nguyên nhân**: Lỗi đóng gói, nhầm lẫn từ kho
  - **Giải pháp**: Kiểm tra và giao bổ sung sản phẩm thiếu
  - **Quy trình xử lý**:
    1. Đối chiếu đơn hàng với báo cáo đã giao
    2. Xác nhận sản phẩm thiếu
    3. Sắp xếp giao bổ sung trong thời gian sớm nhất

### Đổi trả
- **Đã quá thời hạn đổi trả**: 
  - **Nguyên nhân**: Khách hàng không biết chính sách, phát hiện lỗi muộn
  - **Giải pháp**: Xem xét từng trường hợp dựa trên lý do
  - **Quy trình xử lý**:
    1. Kiểm tra lịch sử đơn hàng và tình trạng sản phẩm
    2. Đối với sản phẩm lỗi do nhà sản xuất, có thể linh động về thời gian
    3. Đối với các lý do khác, giải thích chính sách và đưa ra hướng giải quyết

- **Không có hóa đơn**: 
  - **Nguyên nhân**: Khách hàng làm mất, không nhận được hóa đơn
  - **Giải pháp**: Tra cứu thông qua số điện thoại hoặc email đặt hàng
  - **Quy trình xử lý**:
    1. Yêu cầu thông tin để tìm kiếm đơn hàng (email, SĐT, ngày mua)
    2. Xác minh danh tính người mua
    3. Trích xuất thông tin đơn hàng từ hệ thống

- **Không đồng ý với quyết định từ chối đổi trả**: 
  - **Nguyên nhân**: Khách hàng không hiểu điều kiện đổi trả, đánh giá tình trạng sản phẩm khác với nhân viên
  - **Giải pháp**: Chuyển yêu cầu lên cấp quản lý cao hơn
  - **Quy trình xử lý**:
    1. Ghi nhận khiếu nại của khách hàng
    2. Chuyển thông tin và hình ảnh cho quản lý
    3. Quản lý đánh giá lại và ra quyết định cuối cùng
    4. Giải thích chi tiết lý do cho khách hàng

- **Hoàn tiền chậm**:
  - **Nguyên nhân**: Quy trình xử lý ngân hàng, lỗi thông tin tài khoản
  - **Giải pháp**: Cung cấp thông tin về trạng thái hoàn tiền và thời gian dự kiến
  - **Quy trình xử lý**:
    1. Kiểm tra trạng thái hoàn tiền trong hệ thống
    2. Xác nhận với bộ phận tài chính về việc đã thực hiện hoàn tiền
    3. Thông báo cho khách hàng về thời gian xử lý (thường 3-5 ngày làm việc)

### Tài khoản và bảo mật
- **Quên mật khẩu**: 
  - **Nguyên nhân**: Khách hàng quên mật khẩu đã đặt
  - **Giải pháp**: Sử dụng chức năng quên mật khẩu trên website
  - **Quy trình xử lý**:
    1. Khách hàng nhập email đăng ký
    2. Hệ thống gửi email kèm link đặt lại mật khẩu
    3. Khách hàng đặt mật khẩu mới

- **Tài khoản bị khóa**: 
  - **Nguyên nhân**: Đăng nhập sai nhiều lần, hoạt động đáng ngờ
  - **Giải pháp**: Xác minh danh tính để mở khóa tài khoản
  - **Quy trình xử lý**:
    1. Khách hàng liên hệ hỗ trợ
    2. Nhân viên yêu cầu thông tin xác minh (CMND/CCCD, email, SĐT)
    3. Mở khóa tài khoản sau khi xác minh thành công

- **Thông tin cá nhân không chính xác**: 
  - **Nguyên nhân**: Nhập sai khi đăng ký, thông tin đã thay đổi
  - **Giải pháp**: Cập nhật thông tin trong phần quản lý tài khoản
  - **Quy trình xử lý**:
    1. Khách hàng đăng nhập và vào phần "Thông tin cá nhân"
    2. Cập nhật thông tin mới
    3. Lưu thay đổi

## Kết luận

### Tổng kết quy trình

Tài liệu này đã mô tả chi tiết toàn bộ quy trình mua bán, đổi trả và các chức năng liên quan của hệ thống YummyPet, bao gồm:

1. **Quy trình mua hàng**: Từ việc duyệt sản phẩm, thêm vào giỏ hàng, thanh toán đến xử lý đơn hàng và giao hàng.
2. **Quy trình đổi trả**: Chính sách, điều kiện và các bước thực hiện đổi trả sản phẩm.
3. **Các hệ thống hỗ trợ**: Giỏ hàng, voucher, điểm tích lũy, đánh giá sản phẩm, lịch hẹn dịch vụ.
4. **Bảo mật và quản lý tài khoản**: Đảm bảo an toàn thông tin và quyền riêng tư của khách hàng.
5. **Báo cáo và phân tích**: Cung cấp thông tin kinh doanh để đưa ra quyết định.
6. **Xử lý sự cố**: Hướng dẫn xử lý các tình huống thường gặp.

### Đảm bảo chất lượng hệ thống

Để đảm bảo hệ thống hoạt động ổn định và cung cấp trải nghiệm tốt cho người dùng:

1. **Kiểm tra thường xuyên**:
   - Kiểm tra hiệu suất hệ thống định kỳ
   - Rà soát và cập nhật bảo mật
   - Kiểm tra tính nhất quán dữ liệu

2. **Cập nhật tài liệu**:
   - Cập nhật tài liệu khi có thay đổi về quy trình
   - Đảm bảo API và tài liệu luôn đồng bộ
   - Thông báo cho đội phát triển về các thay đổi

3. **Thu thập phản hồi**:
   - Lắng nghe ý kiến từ khách hàng
   - Thu thập đề xuất từ nhân viên
   - Phân tích hành vi người dùng để cải thiện

### Hướng phát triển tiếp theo

Dựa trên nền tảng hiện tại, YummyPet có thể mở rộng với các tính năng:

1. **Trí tuệ nhân tạo**:
   - Gợi ý sản phẩm dựa trên hành vi mua hàng
   - Dự đoán nhu cầu tồn kho
   - Phân tích tự động phản hồi khách hàng

2. **Ứng dụng di động**:
   - Phát triển ứng dụng chuyên dụng cho iOS và Android
   - Tích hợp thông báo đẩy
   - Quét mã và tra cứu sản phẩm ngay tại cửa hàng

3. **Mở rộng kênh bán hàng**:
   - Tích hợp với sàn thương mại điện tử
   - Phát triển chương trình đại lý
   - Mở rộng dịch vụ chăm sóc thú cưng


