# CHANGELOG: YummyPet System

## [1.3.6] - 2025-06-25

### Changed
- **Sắp xếp API đơn hàng theo ngày tạo mới nhất** - Tất cả API lấy danh sách đơn hàng giờ đây mặc định sắp xếp theo ngày tạo mới nhất
- Cập nhật getAllOrders, getGuestOrders để đảm bảo sắp xếp theo thứ tự mới nhất trước
- Tạo tài liệu mô tả chi tiết về thay đổi và cách sử dụng [order-api-update.md]

### Fixed
- Cải thiện trải nghiệm người dùng khi làm việc với đơn hàng
- Đảm bảo tính nhất quán giữa các API đơn hàng
- Tối ưu quy trình làm việc cho nhân viên và quản trị viên

## [1.3.5] - 2025-06-25

### Added
- **Thêm API tìm kiếm khách hàng theo một phần số điện thoại** - Endpoint mới `/api/customers/search/phone?phone=xyz` cho phép tìm kiếm khách hàng có số điện thoại chứa chuỗi được chỉ định
- Cập nhật tài liệu API khách hàng với hướng dẫn sử dụng endpoint mới
- Hỗ trợ tìm kiếm linh hoạt hơn với khả năng tìm kiếm bất kỳ phần nào của số điện thoại (ví dụ: "090", "091", v.v.)

### Fixed
- Cải thiện trải nghiệm tìm kiếm khách hàng trong cửa hàng, cho phép nhân viên tìm khách hàng ngay cả khi chỉ nhớ một phần số điện thoại

## [1.3.4] - 2025-06-25

### Added
- **Thêm API tìm kiếm khách hàng theo số điện thoại** - Endpoint mới `/api/customers/phone/{phone}` cho phép nhân viên và quản trị viên tìm kiếm khách hàng theo số điện thoại
- Cập nhật tài liệu API khách hàng với hướng dẫn sử dụng endpoint mới

### Fixed
- Cải thiện quy trình tìm kiếm khách hàng trong cửa hàng, giúp nhân viên phục vụ nhanh chóng tìm thấy thông tin khách hàng qua số điện thoại

## [1.3.3] - 2025-06-23

### Removed
- **Loại bỏ trường `estimatedTimeRemaining`** - Trường này đã được loại bỏ khỏi OrderItemDTO và không còn được tính toán trong OrderItemMapper
- Loại bỏ tham chiếu đến TimeEstimationUtil trong OrderItemMapper

### Fixed
- Đơn giản hóa API bằng cách loại bỏ thông tin không cần thiết
- Cải thiện hiệu suất bằng cách loại bỏ xử lý tính toán thời gian còn lại
- Cập nhật tài liệu API và hướng dẫn để phản ánh thay đổi

## [1.3.2] - 2025-06-23

### Changed
- **Cập nhật tài liệu API đơn hàng tổng hợp** - Nhấn mạnh rõ hơn giới hạn: đơn hàng online không hỗ trợ dịch vụ, trường `completionDate` chỉ áp dụng cho đơn tại cửa hàng. [Tài liệu cập nhật](./docs/order-api-comprehensive-guide.md)
- Bổ sung chú thích rõ ràng hơn cho trường `completionDate` trong OrderItemRequest.java
- Thêm phần mới "Sử dụng completionDate và estimatedDuration" trong tài liệu API tổng hợp với các ví dụ cụ thể
- Cập nhật hướng dẫn ước tính thời gian nhấn mạnh giới hạn của completionDate

### Fixed
- Làm rõ hơn về giới hạn của các trường và tính năng theo loại đơn hàng
- Thống nhất thông tin giữa các tài liệu hướng dẫn và code

## [1.3.1] - 2025-06-22

### Changed
- **Cập nhật quy trình dịch vụ khách vãng lai** - Loại bỏ yêu cầu `petId` cho dịch vụ khách vãng lai, thay vào đó sử dụng `serviceNotes` để mô tả thông tin thú cưng. [Chi tiết](./docs/NOTIFICATION-update-guest-service.md)
- Cập nhật tài liệu hướng dẫn dịch vụ khách vãng lai - [Hướng dẫn mới](./docs/dichvu-khach-vang-lai-guide.md)
- Cập nhật hướng dẫn ước tính thời gian dịch vụ - [Tài liệu cập nhật](./docs/updated-service-time-estimation-guide.md)

### Fixed
- Chính xác hóa quy trình xử lý dịch vụ cho khách vãng lai
- Đơn giản hóa API bằng cách không yêu cầu petId cho dịch vụ không đăng ký thú cưng
- Cải thiện hướng dẫn ghi chú dịch vụ (serviceNotes) với thông tin chi tiết hơn về thú cưng

## [1.3.0] - 2025-06-22

### Removed
- **Loại bỏ trường `petIdServiced`** - Trường này đã được loại bỏ vì trùng lặp với `petId`. Tham khảo [Hướng dẫn di chuyển](./docs/migration-guide-remove-petIdServiced.md) để biết thêm chi tiết.
- Loại bỏ quan hệ `petServiced` trong entity `OrderItem`
- Loại bỏ trường `petServicedId` và `petServicedName` trong `OrderItemDTO`
- Loại bỏ cột `pet_id_serviced` trong cơ sở dữ liệu

### Changed
- Cập nhật API Guide cho dịch vụ - [API Guide](./docs/updated-service-api-guide.md)
- Cập nhật OrderService để sử dụng `petId` cho tất cả các trường hợp
- Cập nhật OrderItemMapper để loại bỏ mapping của trường không còn sử dụng

### Fixed
- Đơn giản hóa API và mô hình dữ liệu bằng cách loại bỏ trường dư thừa
- Cải thiện tính nhất quán trong API bằng cách chỉ sử dụng một trường để tham chiếu đến thú cưng

### Added
- Thêm tài liệu hướng dẫn kiểm thử sau khi loại bỏ trường - [Hướng dẫn kiểm thử](./docs/testing-after-remove-petIdServiced.md)

## [1.2.0] - 2025-06-15

### Added
- Tính năng ước tính thời gian hoàn thành dịch vụ
- Thêm trường `estimatedDuration` để ghi đè thời gian mặc định của dịch vụ
- Tự động tính toán thời gian hoàn thành dịch vụ dựa trên thời điểm hiện tại và thời lượng dịch vụ
- Thêm trường `estimatedTimeRemaining` để hiển thị thời gian còn lại đến khi hoàn thành
- Tiện ích TimeEstimationUtil để tính toán và định dạng thời gian

### Changed
- Cập nhật OrderItemDTO để bổ sung thông tin thời gian
- Tối ưu hóa OrderItemMapper để tính toán thời gian còn lại

## [1.1.0] - 2025-06-01

### Added
- Hỗ trợ đơn hàng dịch vụ cho khách vãng lai
- API tạo đơn hàng ẩn danh cho khách vãng lai
- API tạo đơn hàng với thông tin khách vãng lai
- Cập nhật trạng thái dịch vụ riêng lẻ

### Changed
- Cho phép chuyển đơn hàng từ trạng thái pending sang completed trực tiếp cho khách vãng lai
- Tối ưu hóa quy trình xử lý đơn hàng dịch vụ

## [1.0.0] - 2025-05-15

### Added
- Phát hành phiên bản đầu tiên của YummyPet
- Quản lý sản phẩm, dịch vụ và thú cưng
- Quản lý khách hàng và nhân viên
- Xử lý đơn hàng và thanh toán
- Báo cáo thống kê
