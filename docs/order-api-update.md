# Cập nhật API Đơn hàng: Sắp xếp theo ngày tạo mới nhất

## Mô tả

API đơn hàng đã được cập nhật để mặc định sắp xếp đơn hàng theo ngày tạo mới nhất (ngày gần đây nhất hiển thị trước). Điều này giúp người dùng dễ dàng theo dõi các đơn hàng mới nhất và cải thiện trải nghiệm người dùng.

## Các API được cập nhật

Các API sau đây mặc định sẽ trả về đơn hàng theo thứ tự mới nhất trước:

1. `GET /api/orders` - Lấy danh sách đơn hàng
2. `GET /api/orders/guest` - Lấy danh sách đơn hàng của khách vãng lai

## Chi tiết thay đổi

- Các API sẽ sắp xếp dữ liệu theo `createdAt` giảm dần (DESC) nếu không có tiêu chí sắp xếp nào được chỉ định.
- Nếu client chỉ định tiêu chí sắp xếp khác (ví dụ: sắp xếp theo tổng tiền), hệ thống sẽ tôn trọng tiêu chí đó.
- Không có thay đổi nào về cấu trúc API, các tham số truyền vào và kết quả trả về vẫn giữ nguyên.

## Ví dụ

### Mặc định (sắp xếp theo ngày tạo mới nhất)

```
GET /api/orders?page=0&size=10
```

Kết quả sẽ trả về các đơn hàng được sắp xếp theo ngày tạo mới nhất (giảm dần).

### Sắp xếp tùy chỉnh

```
GET /api/orders?page=0&size=10&sort=totalAmount,desc
```

