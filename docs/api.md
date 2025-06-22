
## 1. API quản lý sản phẩm (Product)

| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| GET | `/api/products` | Lấy danh sách tất cả sản phẩm | Public |
| GET | `/api/products/search` | Tìm kiếm sản phẩm theo nhiều tiêu chí | Public |
| GET | `/api/products/{id}` | Xem chi tiết một sản phẩm | Public |
| POST | `/api/products` | Tạo sản phẩm mới | Admin, Staff |
| PUT | `/api/products/{id}` | Cập nhật thông tin sản phẩm | Admin, Staff |
| DELETE | `/api/products/{id}` | Xóa hoặc vô hiệu hóa sản phẩm | Admin |

## 2. API quản lý thú cưng (Pet)

| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| GET | `/api/pets` | Lấy danh sách tất cả thú cưng | Public |
| GET | `/api/pets/search` | Tìm kiếm thú cưng theo nhiều tiêu chí | Public |
| GET | `/api/pets/{id}` | Xem chi tiết một thú cưng | Public |
| POST | `/api/pets` | Thêm thú cưng mới vào hệ thống | Admin, Staff |
| PUT | `/api/pets/{id}` | Cập nhật thông tin thú cưng | Admin, Staff |
| DELETE | `/api/pets/{id}` | Xóa hoặc đánh dấu thú cưng đã bán | Admin |
| GET | `/api/pets/{id}/images` | Lấy danh sách hình ảnh của thú cưng | Public |
| POST | `/api/pets/{id}/images` | Thêm hình ảnh cho thú cưng | Admin, Staff |

## 3. API quản lý dịch vụ (Service)

| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| GET | `/api/services` | Lấy danh sách tất cả dịch vụ | Public |
| GET | `/api/services/{id}` | Xem chi tiết một dịch vụ | Public |
| POST | `/api/services` | Thêm dịch vụ mới | Admin |
| PUT | `/api/services/{id}` | Cập nhật thông tin dịch vụ | Admin |
| DELETE | `/api/services/{id}` | Xóa hoặc vô hiệu hóa dịch vụ | Admin |

## 4. API quản lý danh mục (Category)

| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| GET | `/api/categories` | Lấy danh sách tất cả danh mục | Public |
| GET | `/api/categories/all` | Lấy danh sách tất cả danh mục không phân trang | Public |
| GET | `/api/categories/type/{type}` | Lấy danh mục theo loại (product, pet, service) | Public |
| GET | `/api/categories/{id}` | Xem chi tiết một danh mục | Public |
| POST | `/api/categories` | Thêm danh mục mới | Admin |
| PUT | `/api/categories/{id}` | Cập nhật thông tin danh mục | Admin |
| DELETE | `/api/categories/{id}` | Xóa danh mục | Admin |

## 5. API quản lý voucher (Voucher)

| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| GET | `/api/vouchers` | Lấy danh sách voucher | Admin |
| GET | `/api/vouchers/available` | Lấy danh sách voucher có thể sử dụng | Customer |
| GET | `/api/vouchers/{id}` | Xem chi tiết một voucher | Admin, Customer (nếu đủ điều kiện) |
| POST | `/api/vouchers` | Tạo voucher mới | Admin |
| PUT | `/api/vouchers/{id}` | Cập nhật thông tin voucher | Admin |
| DELETE | `/api/vouchers/{id}` | Xóa hoặc vô hiệu hóa voucher | Admin |
| POST | `/api/vouchers/validate` | Kiểm tra tính hợp lệ của voucher | Customer, Admin, Staff |

## 6. API quản lý tồn kho (Product Stock)

| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| POST | `/api/product-stock/batch-update` | Cập nhật số lượng tồn kho cho nhiều sản phẩm | Admin, Staff |
| GET | `/api/product-stock/low-stock` | Danh sách sản phẩm sắp hết hàng | Admin, Staff |
| POST | `/api/product-stock/{id}/increase` | Tăng số lượng tồn kho một sản phẩm | Admin, Staff |
| POST | `/api/product-stock/{id}/decrease` | Giảm số lượng tồn kho một sản phẩm | Admin, Staff, System |

## 7. API giỏ hàng (Cart) - Chưa thấy trong controller

| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| GET | `/api/cart` | Xem giỏ hàng hiện tại | Customer |
| POST | `/api/cart/add` | Thêm sản phẩm vào giỏ hàng | Customer |
| PUT | `/api/cart/update` | Cập nhật số lượng sản phẩm trong giỏ hàng | Customer |
| DELETE | `/api/cart/{itemId}` | Xóa sản phẩm khỏi giỏ hàng | Customer |
| POST | `/api/cart/checkout` | Chuyển giỏ hàng thành đơn hàng | Customer |
| DELETE | `/api/cart/clear` | Xóa toàn bộ giỏ hàng | Customer |

## 8. API báo cáo và thống kê (Report) - Chưa thấy trong controller

| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| GET | `/api/reports/sales` | Báo cáo doanh thu theo thời gian | Admin |
| GET | `/api/reports/products` | Báo cáo sản phẩm bán chạy | Admin |
| GET | `/api/reports/inventory` | Báo cáo tình trạng tồn kho | Admin |
| GET | `/api/reports/customers` | Báo cáo về khách hàng thân thiết | Admin |
| GET | `/api/reports/services` | Báo cáo về dịch vụ được sử dụng | Admin |

## 9. API quản lý đánh giá (Review) - Chưa thấy trong controller

| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| GET | `/api/reviews/products/{productId}` | Xem đánh giá của sản phẩm | Public |
| POST | `/api/reviews/products/{productId}` | Thêm đánh giá cho sản phẩm | Customer (đã mua) |
| PUT | `/api/reviews/{id}` | Sửa đánh giá | Customer (chủ đánh giá) |
| DELETE | `/api/reviews/{id}` | Xóa đánh giá | Customer (chủ đánh giá), Admin |
| GET | `/api/reviews/services/{serviceId}` | Xem đánh giá của dịch vụ | Public |
| POST | `/api/reviews/services/{serviceId}` | Thêm đánh giá cho dịch vụ | Customer (đã sử dụng) |

## 10. API quản lý điểm tích lũy (Loyalty Point)

| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| GET | `/api/customers/me/loyalty-points` | Xem điểm tích lũy của bản thân | Customer |
| GET | `/api/customers/{id}/loyalty-points` | Xem điểm tích lũy của khách hàng | Admin, Staff |
| GET | `/api/customers/{id}/loyalty-history` | Xem lịch sử điểm tích lũy | Admin, Staff, Customer (của họ) |
| POST | `/api/customers/{id}/loyalty-points` | Cập nhật điểm tích lũy | Admin, Staff |

## 11. API quản lý nhân viên (Employee) - ✅ ĐÃ TẠO

| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| GET | `/api/employees` | Lấy danh sách tất cả nhân viên (có phân trang) | Admin |
| GET | `/api/employees/{id}` | Xem chi tiết nhân viên theo ID | Admin, Staff |
| GET | `/api/employees/code/{employeeCode}` | Xem chi tiết nhân viên theo mã nhân viên | Admin, Staff |
| POST | `/api/employees` | Tạo nhân viên mới | Admin |
| PUT | `/api/employees/{id}` | Cập nhật thông tin nhân viên | Admin |
| DELETE | `/api/employees/{id}` | Xóa nhân viên (soft delete) | Admin |

**Tính năng đã triển khai:**
- ✅ Tự động tạo mã nhân viên (EMP001, EMP002, ...)
- ✅ Tự động tạo User account khi tạo Employee
- ✅ Mã hóa mật khẩu
- ✅ Soft delete (đặt isActive = false)
- ✅ Phân quyền Admin/Staff
- ✅ Pagination support
- ✅ DTO mapping để bảo mật thông tin

## 12. API quản lý lịch sử tích điểm (Loyalty Points) - ✅ ĐÃ TẠO

| Phương thức | Endpoint | Mô tả | Quyền truy cập |
|------------|----------|-------|---------------|
| GET | `/api/loyalty-points/customers/{id}/history` | Lấy lịch sử tích điểm của khách hàng (có phân trang) | Admin, Staff, Customer (của mình) |
| GET | `/api/loyalty-points/customers/{id}/history/type/{type}` | Lấy lịch sử theo loại điểm | Admin, Staff, Customer (của mình) |
| GET | `/api/loyalty-points/customers/{id}/history/date-range` | Lấy lịch sử theo khoảng thời gian | Admin, Staff, Customer (của mình) |
| GET | `/api/loyalty-points/customers/{id}/summary` | Lấy tóm tắt điểm tích lũy | Admin, Staff, Customer (của mình) |
| GET | `/api/loyalty-points/customers/{id}/recent` | Lấy 10 giao dịch điểm gần nhất | Admin, Staff, Customer (của mình) |
| GET | `/api/loyalty-points/types` | Lấy danh sách loại điểm | Admin, Staff, Customer |

**Tính năng đã triển khai:**
- ✅ Phân quyền chi tiết (Customer chỉ xem được của mình)
- ✅ Lọc theo loại điểm (earned, redeemed, expired, adjusted, restored)
- ✅ Lọc theo khoảng thời gian
- ✅ Tóm tắt thống kê điểm tích lũy
- ✅ Pagination và sorting
- ✅ Hiển thị thông tin đơn hàng liên quan
- ✅ Mô tả loại điểm bằng tiếng Việt
- ✅ Validation ngày tháng

**Loại điểm hỗ trợ:**
- `earned`: Tích điểm (từ mua hàng)
- `redeemed`: Đổi điểm (sử dụng điểm)
- `expired`: Hết hạn
- `adjusted`: Điều chỉnh (admin)
- `restored`: Khôi phục (từ đơn hàng bị hủy)

## Đề xuất bổ sung

Để tài liệu quy trình mua bán đổi trả được đầy đủ, cần bổ sung các API trên vào phần tổng quan API trong tài liệu hiện có. Ngoài ra, cũng nên cân nhắc phát triển thêm một số API sau nếu chưa có:

1. **API quản lý giỏ hàng**: Hỗ trợ thêm/xóa/cập nhật sản phẩm trong giỏ hàng
2. **API đánh giá và bình luận**: Cho phép khách hàng đánh giá sản phẩm/dịch vụ sau khi mua
3. **API báo cáo thống kê**: Hỗ trợ các báo cáo về doanh thu, sản phẩm bán chạy, tồn kho...
4. **API thông báo**: Gửi thông báo đến khách hàng về trạng thái đơn hàng, ưu đãi mới
