# YummyPet - Hệ thống quản lý cửa hàng thú cưng

## Tính năng chính

- Quản lý thú cưng
- Quản lý đơn hàng
- Quản lý khách hàng
- Quản lý dịch vụ
- Quản lý nhân viên
- Báo cáo thống kê
- Xuất PDF báo cáo với hỗ trợ tiếng Việt đầy đủ

## Công nghệ sử dụng

- React + TypeScript
- Vite
- Ant Design
- Redux
- React Router
- Recharts
- jsPDF (xuất báo cáo PDF)

## Hướng dẫn cài đặt

```bash
# Cài đặt dependencies
yarn install

# Chạy ở môi trường dev
yarn dev

# Build cho production
yarn build
```

## Hướng dẫn xuất báo cáo PDF

1. Truy cập vào trang "Báo cáo" từ menu bên trái
2. Chọn loại báo cáo muốn xuất (doanh thu, khách hàng, sản phẩm, dịch vụ...)
3. Đối với báo cáo doanh thu, có thể lọc theo khoảng thời gian
4. Nhấn nút "Xuất báo cáo PDF" để tạo file PDF
5. File PDF được tự động tải xuống với tên theo định dạng `[loại_báo_cáo]_report_[ngày].pdf`

## Lưu ý về font tiếng Việt

Hệ thống đã được tích hợp font Roboto hỗ trợ tiếng Việt đầy đủ cho việc xuất báo cáo PDF. Các ký tự tiếng Việt (ă, â, ê, ô, ơ, ư, đ...) sẽ được hiển thị chính xác trong file PDF.
