-- Tạo database
CREATE DATABASE IF NOT EXISTS yummy_pet_db;
USE yummy_pet_db;

-- Xóa các bảng nếu đã tồn tại
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS loyalty_point_history;
DROP TABLE IF EXISTS return_exchange_items;
DROP TABLE IF EXISTS return_exchanges;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS pet_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS vouchers;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS system_settings;
SET FOREIGN_KEY_CHECKS = 1;

-- Tạo bảng roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Tạo bảng customers
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_code VARCHAR(20) UNIQUE,
    user_id INT,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(150),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    loyalty_points INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tạo bảng employees
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    employee_code VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(150),
    address TEXT,
    date_of_birth DATE,
    hire_date DATE NOT NULL,
    salary DECIMAL(10, 2),
    position VARCHAR(50),
    department VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tạo bảng categories
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INT,
    category_type VARCHAR(20) DEFAULT 'product',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Tạo bảng products
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),
    stock_quantity INT DEFAULT 0,
    min_stock_level INT DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(50),
    weight DECIMAL(10, 2),
    brand VARCHAR(100),
    origin_country VARCHAR(100),
    expiry_date DATE,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tạo bảng product_images
CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Tạo bảng pets
CREATE TABLE pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pet_code VARCHAR(20) UNIQUE,
    category_id INT NOT NULL,
    name VARCHAR(100),
    species VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    gender VARCHAR(10),
    age_months INT,
    weight DECIMAL(5, 2),
    color VARCHAR(50),
    price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),
    description TEXT,
    arrival_date DATE,
    status VARCHAR(20) DEFAULT 'available',
    certificate_info VARCHAR(255),
    health_status VARCHAR(20) DEFAULT 'unknown',
    vaccination_status VARCHAR(20) DEFAULT 'unknown',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tạo bảng pet_images
CREATE TABLE pet_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id)
);

-- Tạo bảng services
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng vouchers
CREATE TABLE vouchers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2),
    max_discount_amount DECIMAL(10, 2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    start_date DATETIME,
    end_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng orders
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(20) NOT NULL UNIQUE,
    customer_id INT,
    guest_name VARCHAR(100),
    guest_phone VARCHAR(20),
    is_guest_order BOOLEAN DEFAULT FALSE,
    subtotal DECIMAL(10, 2),
    discount_amount DECIMAL(10, 2),
    total_amount DECIMAL(10, 2),
    voucher_id INT,
    loyalty_points_used INT DEFAULT 0,
    payment_method VARCHAR(20) DEFAULT 'cash',
    payment_status VARCHAR(20) DEFAULT 'pending',
    delivery_address TEXT,
    delivery_method VARCHAR(20) DEFAULT 'pickup',
    status VARCHAR(20) DEFAULT 'pending',
    order_source VARCHAR(20) DEFAULT 'in_store',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (voucher_id) REFERENCES vouchers(id)
);

-- Tạo bảng order_items
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_type VARCHAR(20) NOT NULL,
    product_id INT,
    pet_id INT,
    service_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    completion_date DATETIME,
    actual_completion_date DATETIME,
    service_status VARCHAR(20) DEFAULT 'pending',
    assigned_employee_id INT,
    service_notes TEXT,
    pet_id_serviced INT,
    service_details TEXT,
    health_observations TEXT,
    recommendations TEXT,
    next_service_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (pet_id) REFERENCES pets(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (assigned_employee_id) REFERENCES employees(id),
    FOREIGN KEY (pet_id_serviced) REFERENCES pets(id)
);

-- Tạo bảng return_exchanges
CREATE TABLE return_exchanges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    return_code VARCHAR(20) NOT NULL UNIQUE,
    order_id INT NOT NULL,
    customer_id INT,
    return_type VARCHAR(20) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(10, 2),
    processed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (processed_by) REFERENCES employees(id)
);

-- Tạo bảng return_exchange_items
CREATE TABLE return_exchange_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    return_exchange_id INT NOT NULL,
    order_item_id INT NOT NULL,
    quantity INT NOT NULL,
    reason TEXT,
    condition_status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (return_exchange_id) REFERENCES return_exchanges(id),
    FOREIGN KEY (order_item_id) REFERENCES order_items(id)
);

-- Tạo bảng loyalty_point_history
CREATE TABLE loyalty_point_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    points INT NOT NULL,
    point_type VARCHAR(20),
    order_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Tạo bảng system_settings
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Thêm dữ liệu mẫu

-- Thêm roles
INSERT INTO roles (name, description) VALUES 
('ROLE_ADMIN', 'Quản trị viên hệ thống'),
('ROLE_STAFF', 'Nhân viên cửa hàng'),
('ROLE_CUSTOMER', 'Khách hàng');

-- Thêm users (mật khẩu: 123456)
INSERT INTO users (username, email, password_hash, role_id, is_active) VALUES 
('admin', 'admin@yummypet.com', '$2a$10$QKV9Xa6KjZPL4hAosmUhTO1mSFfs42luJ3zpKEqvfCYRO5G7tT9Oi', 1, true),
('staff1', 'staff1@yummypet.com', '$2a$10$QKV9Xa6KjZPL4hAosmUhTO1mSFfs42luJ3zpKEqvfCYRO5G7tT9Oi', 2, true),
('staff2', 'staff2@yummypet.com', '$2a$10$QKV9Xa6KjZPL4hAosmUhTO1mSFfs42luJ3zpKEqvfCYRO5G7tT9Oi', 2, true),
('customer1', 'customer1@example.com', '$2a$10$QKV9Xa6KjZPL4hAosmUhTO1mSFfs42luJ3zpKEqvfCYRO5G7tT9Oi', 3, true),
('customer2', 'customer2@example.com', '$2a$10$QKV9Xa6KjZPL4hAosmUhTO1mSFfs42luJ3zpKEqvfCYRO5G7tT9Oi', 3, true);

-- Thêm employees
INSERT INTO employees (user_id, employee_code, full_name, phone, email, address, hire_date, salary, position, department) VALUES
(1, 'EMP-2023-001', 'Nguyễn Văn Admin', '0901234567', 'admin@yummypet.com', 'Quận 1, TP.HCM', '2023-01-01', 15000000, 'Quản lý', 'Ban giám đốc'),
(2, 'EMP-2023-002', 'Trần Thị Nhân Viên', '0902345678', 'staff1@yummypet.com', 'Quận 2, TP.HCM', '2023-02-15', 8000000, 'Nhân viên bán hàng', 'Kinh doanh'),
(3, 'EMP-2023-003', 'Lê Văn Chăm Sóc', '0903456789', 'staff2@yummypet.com', 'Quận 3, TP.HCM', '2023-03-20', 9000000, 'Nhân viên chăm sóc thú cưng', 'Dịch vụ');

-- Thêm customers
INSERT INTO customers (customer_code, user_id, full_name, phone, email, address, date_of_birth, gender, loyalty_points) VALUES
('CUS-2023-001', 4, 'Phạm Thị Khách Hàng', '0904567890', 'customer1@example.com', 'Quận 7, TP.HCM', '1990-05-15', 'FEMALE', 150),
('CUS-2023-002', 5, 'Huỳnh Văn Mua Sắm', '0905678901', 'customer2@example.com', 'Quận 8, TP.HCM', '1985-10-20', 'MALE', 75);

-- Thêm categories
INSERT INTO categories (name, description, parent_id, category_type) VALUES
-- Danh mục chính
('Thức ăn', 'Các loại thức ăn cho thú cưng', NULL, 'product'),
('Phụ kiện', 'Phụ kiện cho thú cưng', NULL, 'product'),
('Thú cưng', 'Các loại thú cưng', NULL, 'pet'),
('Dịch vụ', 'Các loại dịch vụ cho thú cưng', NULL, 'service'),

-- Danh mục con cho thức ăn
('Thức ăn cho chó', 'Thức ăn dành cho chó', 1, 'product'),
('Thức ăn cho mèo', 'Thức ăn dành cho mèo', 1, 'product'),
('Thức ăn cho cá', 'Thức ăn dành cho cá', 1, 'product'),
('Thức ăn cho chim', 'Thức ăn dành cho chim', 1, 'product'),

-- Danh mục con cho phụ kiện
('Chuồng, nhà', 'Chuồng và nhà cho thú cưng', 2, 'product'),
('Vòng cổ, dây dắt', 'Vòng cổ và dây dắt', 2, 'product'),
('Đồ chơi', 'Đồ chơi cho thú cưng', 2, 'product'),
('Áo quần', 'Quần áo cho thú cưng', 2, 'product'),
('Bát ăn, bình nước', 'Bát ăn và bình nước', 2, 'product'),

-- Danh mục con cho thú cưng
('Chó', 'Các loại chó cưng', 3, 'pet'),
('Mèo', 'Các loại mèo cưng', 3, 'pet'),
('Cá cảnh', 'Các loại cá cảnh', 3, 'pet'),
('Chim cảnh', 'Các loại chim cảnh', 3, 'pet'),
('Hamster', 'Chuột hamster', 3, 'pet'),

-- Danh mục con cho dịch vụ
('Cắt tỉa lông', 'Dịch vụ cắt tỉa lông', 4, 'service'),
('Tắm, vệ sinh', 'Dịch vụ tắm và vệ sinh', 4, 'service'),
('Khám và điều trị', 'Dịch vụ khám và điều trị bệnh', 4, 'service'),
('Huấn luyện', 'Dịch vụ huấn luyện thú cưng', 4, 'service'),
('Khách sạn thú cưng', 'Dịch vụ trông giữ thú cưng', 4, 'service');

-- Thêm products
INSERT INTO products (category_id, name, description, price, cost_price, stock_quantity, min_stock_level, sku, brand, image_url) VALUES
-- Thức ăn cho chó
(5, 'Royal Canin Medium Adult 10kg', 'Thức ăn cho chó trưởng thành cỡ vừa', 890000, 650000, 20, 5, 'RC-MA-10KG', 'Royal Canin', 'royal_canin_medium.jpg'),
(5, 'Pedigree Adult vị bò và rau củ 1.5kg', 'Thức ăn cho chó trưởng thành', 120000, 80000, 30, 10, 'PED-ADULT-1.5KG', 'Pedigree', 'pedigree_adult.jpg'),
(5, 'SmartHeart Puppy 3kg', 'Thức ăn cho chó con', 250000, 180000, 25, 8, 'SH-PUPPY-3KG', 'SmartHeart', 'smartheart_puppy.jpg'),

-- Thức ăn cho mèo
(6, 'Whiskas túi 1.2kg vị cá biển', 'Thức ăn cho mèo trưởng thành', 115000, 80000, 35, 12, 'WSKM-FISH-1.2KG', 'Whiskas', 'whiskas_fish.jpg'),
(6, 'Royal Canin Kitten 2kg', 'Thức ăn cho mèo con', 450000, 350000, 15, 5, 'RC-KITTEN-2KG', 'Royal Canin', 'royal_canin_kitten.jpg'),
(6, 'Me-O Adult vị cá ngừ 1.2kg', 'Thức ăn cho mèo trưởng thành', 125000, 90000, 28, 10, 'MEO-TUNA-1.2KG', 'Me-O', 'meo_tuna.jpg'),

-- Phụ kiện
(10, 'Vòng cổ cho chó size M', 'Vòng cổ da bền đẹp', 150000, 90000, 40, 15, 'DOG-COLLAR-M', 'PetZone', 'dog_collar.jpg'),
(11, 'Chuột đồ chơi cho mèo', 'Đồ chơi hình chuột phát tiếng', 80000, 40000, 50, 20, 'CAT-TOY-MOUSE', 'PetToy', 'cat_toy_mouse.jpg'),
(13, 'Bát ăn inox cho chó mèo', 'Bát ăn chất liệu inox cao cấp', 120000, 70000, 45, 15, 'PET-BOWL-INOX', 'PetLife', 'pet_bowl.jpg');

-- Thêm thú cưng
INSERT INTO pets (pet_code, category_id, name, species, breed, gender, age_months, weight, color, price, cost_price, description, arrival_date, status, health_status, vaccination_status) VALUES
-- Chó
('PET-DOG-001', 15, 'Lucky', 'Chó', 'Poodle', 'MALE', 5, 3.5, 'Trắng', 5000000, 3500000, 'Chó Poodle đực 5 tháng tuổi, màu trắng, hoạt bát', '2025-06-01', 'available', 'good', 'fully_vaccinated'),
('PET-DOG-002', 15, 'Bella', 'Chó', 'Corgi', 'FEMALE', 6, 4.2, 'Vàng trắng', 12000000, 9000000, 'Chó Corgi cái 6 tháng tuổi, màu vàng trắng, đáng yêu', '2025-06-05', 'available', 'good', 'fully_vaccinated'),
('PET-DOG-003', 15, 'Max', 'Chó', 'Husky', 'MALE', 8, 7.5, 'Xám trắng', 15000000, 10000000, 'Chó Husky đực 8 tháng tuổi, màu xám trắng, năng động', '2025-06-10', 'available', 'good', 'partially_vaccinated'),

-- Mèo
('PET-CAT-001', 16, 'Kitty', 'Mèo', 'Anh lông ngắn', 'FEMALE', 4, 2.0, 'Xám', 8000000, 6000000, 'Mèo Anh lông ngắn cái 4 tháng tuổi, màu xám, hiền lành', '2025-06-03', 'available', 'good', 'fully_vaccinated'),
('PET-CAT-002', 16, 'Tom', 'Mèo', 'Ragdoll', 'MALE', 7, 3.2, 'Trắng xám', 14000000, 10000000, 'Mèo Ragdoll đực 7 tháng tuổi, màu trắng xám, dễ thương', '2025-06-08', 'available', 'good', 'fully_vaccinated'),
('PET-CAT-003', 16, 'Miu', 'Mèo', 'Munchkin', 'FEMALE', 5, 1.8, 'Vàng', 11000000, 8000000, 'Mèo Munchkin cái 5 tháng tuổi, màu vàng, chân ngắn đáng yêu', '2025-06-12', 'available', 'good', 'partially_vaccinated');

-- Thêm pet images
INSERT INTO pet_images (pet_id, image_url, is_primary) VALUES
(1, 'pets/poodle_white.jpg', true),
(2, 'pets/corgi_golden.jpg', true),
(3, 'pets/husky_gray.jpg', true),
(4, 'pets/british_gray.jpg', true),
(5, 'pets/ragdoll.jpg', true),
(6, 'pets/munchkin_yellow.jpg', true);

-- Thêm product images
INSERT INTO product_images (product_id, image_url, is_primary) VALUES
(1, 'products/royal_canin_medium.jpg', true),
(2, 'products/pedigree_adult.jpg', true),
(3, 'products/smartheart_puppy.jpg', true),
(4, 'products/whiskas_fish.jpg', true),
(5, 'products/royal_canin_kitten.jpg', true),
(6, 'products/meo_tuna.jpg', true),
(7, 'products/dog_collar.jpg', true),
(8, 'products/cat_toy_mouse.jpg', true),
(9, 'products/pet_bowl.jpg', true);

-- Thêm dịch vụ
INSERT INTO services (name, description, price, duration_minutes) VALUES
('Tắm, vệ sinh cho chó nhỏ', 'Dịch vụ tắm và vệ sinh toàn diện cho chó dưới 10kg', 150000, 60),
('Tắm, vệ sinh cho chó lớn', 'Dịch vụ tắm và vệ sinh toàn diện cho chó trên 10kg', 250000, 90),
('Cắt tỉa lông cho chó nhỏ', 'Dịch vụ cắt tỉa lông theo yêu cầu cho chó dưới 10kg', 250000, 120),
('Cắt tỉa lông cho chó lớn', 'Dịch vụ cắt tỉa lông theo yêu cầu cho chó trên 10kg', 350000, 150),
('Tắm, vệ sinh cho mèo', 'Dịch vụ tắm và vệ sinh toàn diện cho mèo', 200000, 60),
('Cắt tỉa lông cho mèo', 'Dịch vụ cắt tỉa lông cho mèo', 280000, 120),
('Khám sức khỏe tổng quát', 'Dịch vụ khám sức khỏe tổng quát cho thú cưng', 300000, 30),
('Điều trị ngoại ký sinh', 'Dịch vụ điều trị ve, rận, bọ chét cho thú cưng', 200000, 30),
('Tiêm phòng vắc xin', 'Dịch vụ tiêm phòng vắc xin cho thú cưng', 350000, 15),
('Trông giữ thú cưng (theo ngày)', 'Dịch vụ trông giữ thú cưng theo ngày', 150000, 1440);

-- Thêm vouchers
INSERT INTO vouchers (code, name, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, start_date, end_date) VALUES
('WELCOME10', 'Giảm 10% cho khách hàng mới', 'PERCENT', 10, 500000, 100000, 100, '2025-06-01 00:00:00', '2025-07-01 23:59:59'),
('SUMMER50K', 'Giảm 50k cho đơn hàng mùa hè', 'FIXED', 50000, 300000, NULL, 200, '2025-06-01 00:00:00', '2025-08-31 23:59:59'),
('VIPLOY20', 'Giảm 20% cho khách VIP', 'PERCENT', 20, 1000000, 200000, 50, '2025-06-01 00:00:00', '2025-12-31 23:59:59');

-- Thêm orders mẫu
INSERT INTO orders (order_code, customer_id, subtotal, discount_amount, total_amount, voucher_id, loyalty_points_used, payment_method, payment_status, delivery_method, status, order_source, notes, created_at) VALUES
-- Đơn hàng khách hàng thường
('ORD-2025-001', 1, 1040000, 50000, 990000, 2, 0, 'cash', 'completed', 'pickup', 'completed', 'in_store', 'Khách thanh toán tiền mặt', '2025-06-15 10:30:00'),
('ORD-2025-002', 2, 750000, 75000, 675000, 1, 0, 'bank_transfer', 'completed', 'delivery', 'completed', 'online', 'Giao hàng vào buổi chiều', '2025-06-16 15:45:00'),
('ORD-2025-003', 1, 15325000, 200000, 15125000, 3, 0, 'momo', 'completed', 'pickup', 'completed', 'in_store', 'Khách đã chọn thú cưng', '2025-06-18 09:15:00'),

-- Đơn hàng khách vãng lai có thông tin
('ORD-2025-004', NULL, 500000, 0, 500000, NULL, 0, 'cash', 'completed', 'pickup', 'completed', 'in_store', 'Khách vãng lai có thông tin', '2025-06-19 11:20:00'),
-- Đơn hàng khách vãng lai ẩn danh
('ORD-2025-005', NULL, 320000, 0, 320000, NULL, 0, 'cash', 'completed', 'pickup', 'completed', 'in_store', 'Khách vãng lai ẩn danh', '2025-06-20 14:10:00');

-- Cập nhật đơn hàng khách vãng lai
UPDATE orders SET 
guest_name = 'Nguyễn Văn Khách', 
guest_phone = '0987654321', 
is_guest_order = true 
WHERE id = 4;

UPDATE orders SET 
guest_name = 'Khách vãng lai', 
is_guest_order = true 
WHERE id = 5;

-- Thêm order_items
INSERT INTO order_items (order_id, item_type, product_id, pet_id, service_id, quantity, unit_price, total_price, created_at) VALUES
-- Đơn hàng 1
(1, 'product', 1, NULL, NULL, 1, 890000, 890000, '2025-06-15 10:30:00'),
(1, 'product', 7, NULL, NULL, 1, 150000, 150000, '2025-06-15 10:30:00'),

-- Đơn hàng 2
(2, 'product', 5, NULL, NULL, 1, 450000, 450000, '2025-06-16 15:45:00'),
(2, 'product', 6, NULL, NULL, 1, 125000, 125000, '2025-06-16 15:45:00'),
(2, 'product', 8, NULL, NULL, 1, 80000, 80000, '2025-06-16 15:45:00'),
(2, 'service', NULL, NULL, 5, 1, 200000, 200000, '2025-06-16 15:45:00'),

-- Đơn hàng 3
(3, 'pet', NULL, 2, NULL, 1, 12000000, 12000000, '2025-06-18 09:15:00'),
(3, 'product', 7, NULL, NULL, 1, 150000, 150000, '2025-06-18 09:15:00'),
(3, 'product', 9, NULL, NULL, 2, 120000, 240000, '2025-06-18 09:15:00'),
(3, 'product', 2, NULL, NULL, 1, 120000, 120000, '2025-06-18 09:15:00'),
(3, 'service', NULL, NULL, 3, 1, 250000, 250000, '2025-06-18 09:15:00'),

-- Đơn hàng 4 (khách vãng lai có thông tin)
(4, 'service', NULL, NULL, 1, 1, 150000, 150000, '2025-06-19 11:20:00'),
(4, 'service', NULL, NULL, 7, 1, 300000, 300000, '2025-06-19 11:20:00'),
(4, 'product', 8, NULL, NULL, 1, 80000, 80000, '2025-06-19 11:20:00'),

-- Đơn hàng 5 (khách vãng lai ẩn danh)
(5, 'product', 8, NULL, NULL, 2, 80000, 160000, '2025-06-20 14:10:00'),
(5, 'product', 9, NULL, NULL, 1, 120000, 120000, '2025-06-20 14:10:00');

-- Cập nhật thông tin dịch vụ cho order_items
UPDATE order_items SET
service_status = 'completed',
completion_date = '2025-06-16 16:45:00',
actual_completion_date = '2025-06-16 17:00:00',
assigned_employee_id = 3,
pet_id_serviced = 5
WHERE order_id = 2 AND service_id = 5;

UPDATE order_items SET
service_status = 'completed',
completion_date = '2025-06-18 11:00:00',
actual_completion_date = '2025-06-18 11:15:00',
assigned_employee_id = 3,
pet_id_serviced = 2
WHERE order_id = 3 AND service_id = 3;

UPDATE order_items SET
service_status = 'completed',
completion_date = '2025-06-19 12:00:00',
actual_completion_date = '2025-06-19 12:10:00',
assigned_employee_id = 3
WHERE order_id = 4 AND service_id = 1;

UPDATE order_items SET
service_status = 'completed',
completion_date = '2025-06-19 12:30:00',
actual_completion_date = '2025-06-19 12:35:00',
assigned_employee_id = 2
WHERE order_id = 4 AND service_id = 7;

-- Thêm lịch sử điểm tích lũy
INSERT INTO loyalty_point_history (customer_id, points, point_type, order_id, notes, created_at) VALUES
(1, 10, 'EARN', 1, 'Tích điểm từ đơn hàng ORD-2025-001', '2025-06-15 10:30:00'),
(2, 7, 'EARN', 2, 'Tích điểm từ đơn hàng ORD-2025-002', '2025-06-16 15:45:00'),
(1, 150, 'EARN', 3, 'Tích điểm từ đơn hàng ORD-2025-003', '2025-06-18 09:15:00');

-- Thêm cài đặt hệ thống
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('LOYALTY_POINTS_RATE', '0.01', 'Tỷ lệ tích điểm theo giá trị đơn hàng (1%)'),
('LOYALTY_POINT_VALUE', '1000', 'Giá trị của 1 điểm tích lũy (1 điểm = 1000đ)'),
('MIN_ORDER_FOR_POINTS', '100000', 'Giá trị đơn hàng tối thiểu để tích điểm (100,000đ)'),
('STORE_NAME', 'YummyPet Shop', 'Tên cửa hàng'),
('STORE_ADDRESS', '123 Nguyễn Văn Linh, Quận 7, TP.HCM', 'Địa chỉ cửa hàng'),
('STORE_PHONE', '0987654321', 'Số điện thoại cửa hàng'),
('STORE_EMAIL', 'contact@yummypet.com', 'Email liên hệ');

-- Script to drop the pet_id_serviced column from order_items table

-- Step 1: Drop foreign key constraint if it exists
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS FK_order_items_pet_serviced;

-- Step 2: Drop the column
ALTER TABLE order_items DROP COLUMN IF EXISTS pet_id_serviced;

-- Note: This change is part of removing the redundant petIdServiced field
-- The pet_id column already indicates which pet is receiving the service
