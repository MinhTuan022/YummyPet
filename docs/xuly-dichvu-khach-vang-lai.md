# Hướng dẫn xử lý đơn hàng dịch vụ cho khách vãng lai

Hệ thống YummyPet đã được cập nhật để hỗ trợ đơn hàng dịch vụ cho khách vãng lai. Dưới đây là các quy trình và API liên quan.

## I. Luồng tạo đơn hàng dịch vụ cho khách vãng lai

### 1. Tạo đơn hàng dịch vụ vãng lai ẩn danh

**Endpoint:** `POST /api/orders/anonymous`

**Body Request:**
```json
{
  "paymentMethod": "cash",
  "notes": "Khách vãng lai sử dụng dịch vụ tắm cho mèo",
  "items": [
    {
      "itemType": "service",
      "serviceId": 1,
      "quantity": 1,
      "unitPrice": 250000,
      "serviceNotes": "Mèo lông dài màu tam thể, khoảng 3kg, bị rối lông, cần tắm và chải lông",
      "estimatedDuration": 60
    }
  ]
}
```

### 2. Tạo đơn hàng dịch vụ có thông tin khách vãng lai

**Endpoint:** `POST /api/orders/in-store`

**Body Request:**
```json
{  "guestName": "Nguyễn Văn A",
  "guestPhone": "0912345678",
  "paymentMethod": "cash",
  "notes": "Khách vãng lai sử dụng dịch vụ tắm cho mèo",  
  "items": [
    {
      "itemType": "service",
      "serviceId": 1,
      "quantity": 1,
      "unitPrice": 250000,
      "serviceNotes": "Mèo Anh lông ngắn, màu xám, khoảng 4kg, cần tắm và vệ sinh tai"
    }
  ]
}
```

## II. Luồng cập nhật trạng thái dịch vụ

### 1. Cập nhật trạng thái đơn hàng

```
pending → confirmed → processing → ready → completed
```

**Khi một đơn hàng chuyển trạng thái:**
- Khi đơn hàng chuyển sang `confirmed`: Tất cả dịch vụ sẽ tự động chuyển sang trạng thái `in_progress`
- Khi đơn hàng chuyển sang `completed`: Tất cả dịch vụ sẽ tự động chuyển sang `completed`
- Khi đơn hàng bị `cancelled`: Tất cả dịch vụ sẽ tự động chuyển sang `cancelled`

**Đối với khách vãng lai:**
- Có thể chuyển trực tiếp từ `pending` sang `completed` 

**Cập nhật trạng thái đơn hàng:**
```
PUT /api/orders/{id}/status?status=confirmed
PUT /api/orders/{id}/status?status=processing
PUT /api/orders/{id}/status?status=ready
PUT /api/orders/{id}/status?status=completed
```

### 2. Cập nhật trạng thái từng dịch vụ riêng lẻ

Hệ thống hỗ trợ việc cập nhật trạng thái riêng cho từng dịch vụ trong đơn hàng:

**Endpoint:** `PUT /api/order-items/{id}/service-status?status=STATUS&employeeId=EMP_ID`

- `status`: trạng thái dịch vụ (`pending`, `in_progress`, `completed`, `cancelled`)
- `employeeId`: ID của nhân viên được gán cho dịch vụ (tùy chọn)

**Ví dụ:**
```
PUT /api/order-items/5/service-status?status=in_progress&employeeId=2
PUT /api/order-items/5/service-status?status=completed
```

## III. Quy trình xử lý đơn hàng dịch vụ cho khách vãng lai

1. **Tiếp nhận khách và tạo đơn hàng**
   - Tạo đơn hàng mới với trạng thái `pending` (mặc định)
   - Thêm thông tin khách vãng lai (nếu có) hoặc để trống (ẩn danh)
   - Nhập chi tiết dịch vụ và mô tả thông tin thú cưng vào trường `serviceNotes`
   - Ước tính thời gian hoàn thành dịch vụ với trường `estimatedDuration`

2. **Xác nhận đơn hàng**
   - Xác nhận đơn hàng: `PUT /api/orders/{id}/status?status=confirmed` 
   - Tự động cập nhật dịch vụ sang trạng thái `in_progress`
   - Nhân viên bắt đầu thực hiện dịch vụ

3. **Theo dõi và cập nhật**
   - **Tuỳ chọn:** Cập nhật trạng thái từng dịch vụ: `PUT /api/order-items/{id}/service-status?status=...`
   - **Tuỳ chọn:** Gán nhân viên thực hiện: `PUT /api/order-items/{id}/service-status?status=in_progress&employeeId=...`

4. **Hoàn thành**
   - Cập nhật trạng thái đơn hàng sang completed: `PUT /api/orders/{id}/status?status=completed`
   - Thanh toán (nếu chưa thanh toán): `POST /api/orders/{id}/payment`

5. **Quy trình rút gọn cho khách vãng lai**
   - Tạo đơn hàng: `POST /api/orders/anonymous` hoặc `POST /api/orders/in-store`
   - Chuyển trực tiếp sang completed: `PUT /api/orders/{id}/status?status=completed`
   - Thanh toán: `POST /api/orders/{id}/payment`

## IV. Hướng dẫn mô tả thú cưng trong serviceNotes

Đối với dịch vụ khách vãng lai, thông tin thú cưng được ghi vào trường `serviceNotes`. Để đảm bảo đầy đủ thông tin, nên bao gồm các chi tiết sau:

1. **Loài và giống**: Chó Poodle, Mèo Anh lông ngắn, Chó Golden Retriever, v.v.
2. **Màu sắc và đặc điểm nhận dạng**: Màu trắng, đen trắng, tam thể, có đốm, v.v.
3. **Kích thước và cân nặng**: Khoảng 3kg, 5kg, 10kg, v.v.
4. **Tình trạng lông/da**: Lông rối, da khô, v.v.
5. **Vấn đề cần giải quyết**: Cắt móng, tắm, cắt tỉa lông, v.v.
6. **Yêu cầu đặc biệt**: Nhẹ tay khi cắt móng, sợ máy sấy, v.v.

**Ví dụ mô tả tốt:**
```
"Chó Poodle đực màu trắng sữa, khoảng 2.5kg, 6 tháng tuổi. Lông bị rối nhiều ở phần chân và bụng, cần cắt tỉa gọn gàng kiểu teddy. Chó hơi nhút nhát và sợ máy cắt lông, cần nhẹ nhàng khi làm việc với chân."
```

## V. Lưu ý

- Đối với khách vãng lai: Hệ thống cho phép chuyển trực tiếp từ `pending` sang `completed`, bỏ qua các trạng thái trung gian
- Trạng thái dịch vụ được tự động cập nhật theo trạng thái đơn hàng, nhưng có thể cập nhật riêng nếu cần
- Khi một đơn hàng bị hủy, tất cả dịch vụ cũng sẽ bị hủy
- Dịch vụ đã hoàn thành hoặc đã hủy sẽ không bị thay đổi trạng thái khi đơn hàng thay đổi
- Đối với dịch vụ khách vãng lai, không cần cung cấp `petId`, thay vào đó hãy mô tả chi tiết thú cưng trong `serviceNotes`
