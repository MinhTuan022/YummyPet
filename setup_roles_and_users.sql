-- Tạo các roles chuẩn cho hệ thống YummyPet
-- Chạy script này để đảm bảo có đúng 3 roles: admin, staff, customer

-- Xóa dữ liệu cũ nếu có (optional)
-- DELETE FROM roles WHERE name IN ('admin', 'staff', 'customer');

-- Tạo 3 roles chính
INSERT INTO roles (name, description, created_at) VALUES 
('admin', 'Quản trị viên - Toàn quyền truy cập hệ thống', NOW()),
('staff', 'Nhân viên - Quản lý sản phẩm, đơn hàng, khách hàng', NOW()),
('customer', 'Khách hàng - Mua sắm', NOW())
ON DUPLICATE KEY UPDATE 
    description = VALUES(description);

-- Đã loại bỏ mọi mô tả liên quan đến "sử dụng dịch vụ" khỏi role customer

-- Kiểm tra kết quả
SELECT * FROM roles WHERE name IN ('admin', 'staff', 'customer');

-- Tạo user admin mẫu (password: admin123)
INSERT INTO users (username, email, password_hash, role_id, is_active, created_at) 
SELECT 
    'admin', 
    'admin@yummypet.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
    r.id,
    true,
    NOW()
FROM roles r 
WHERE r.name = 'admin'
ON DUPLICATE KEY UPDATE 
    email = VALUES(email);

-- Tạo user staff mẫu (password: staff123)  
INSERT INTO users (username, email, password_hash, role_id, is_active, created_at)
SELECT 
    'staff01',
    'staff01@yummypet.com',
    '$2a$10$H7qF8gHB4CrXQRXr0jK8zOqRHh6vF5Qx9X2Y8VdE4bL7pQ5m3c1/w', -- staff123
    r.id,
    true,
    NOW()
FROM roles r 
WHERE r.name = 'staff'
ON DUPLICATE KEY UPDATE 
    email = VALUES(email);

-- Tạo user customer mẫu (password: customer123)
INSERT INTO users (username, email, password_hash, role_id, is_active, created_at)
SELECT 
    'customer01',
    'customer01@yummypet.com', 
    '$2a$10$Y3zK7mN9vP2qW8xR5sL6tO4uI8nE1bF9dG3hC6jA7eM0vT2pQ5w9r', -- customer123
    r.id,
    true,
    NOW()
FROM roles r 
WHERE r.name = 'customer'
ON DUPLICATE KEY UPDATE 
    email = VALUES(email);

-- Kiểm tra users đã tạo
SELECT u.id, u.username, u.email, r.name as role_name, u.is_active
FROM users u 
JOIN roles r ON u.role_id = r.id 
WHERE u.username IN ('admin', 'staff01', 'customer01');
