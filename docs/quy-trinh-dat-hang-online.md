# Quy Trình Đặt Hàng Online (E-Commerce)

Tài liệu này mô tả chi tiết quy trình đặt hàng online trên hệ thống YummyPet, từ việc thêm sản phẩm vào giỏ hàng đến hoàn tất đơn hàng.

## Luồng đặt hàng online

### 1. Đăng nhập hệ thống
- Người dùng phải đăng nhập trước khi có thể sử dụng chức năng giỏ hàng
- Xác thực thông qua token JWT

### 2. Thêm sản phẩm vào giỏ hàng
- Người dùng có thể thêm sản phẩm (product) hoặc thú cưng (pet) vào giỏ hàng
- Hệ thống sẽ kiểm tra tồn kho và chỉ cho phép thêm vào giỏ hàng nếu có đủ hàng
- Nếu sản phẩm đã có trong giỏ hàng, số lượng sẽ được cộng dồn

### 3. Quản lý giỏ hàng
- Người dùng có thể xem danh sách sản phẩm trong giỏ hàng
- Có thể thay đổi số lượng sản phẩm
- Có thể xóa một sản phẩm khỏi giỏ hàng
- Có thể xóa tất cả sản phẩm trong giỏ hàng

### 4. Áp dụng mã giảm giá
- Người dùng có thể nhập mã giảm giá để được giảm giá
- Hệ thống sẽ kiểm tra tính hợp lệ của mã giảm giá (còn hạn sử dụng, đủ điều kiện áp dụng)
- Giảm giá có thể là % hoặc số tiền cố định
- Hiển thị số tiền được giảm và tổng tiền sau khi giảm

### 5. Tiến hành thanh toán
- Người dùng nhập thông tin giao hàng (địa chỉ, ghi chú)
- Chọn phương thức thanh toán (COD, chuyển khoản, ví điện tử)
- Đơn hàng online sẽ được đặt ở trạng thái "pending" khi mới tạo

### 6. Tạo đơn hàng
- Hệ thống chuyển đổi giỏ hàng thành đơn hàng
- Tạo mã đơn hàng duy nhất
- Xóa giỏ hàng sau khi đặt hàng thành công
- Thông báo xác nhận đơn hàng cho người dùng

### 7. Quản lý đơn hàng
- Sau khi đặt hàng, người dùng có thể theo dõi trạng thái đơn hàng
- Admin xác nhận đơn hàng, chuyển trạng thái sang "confirmed"
- Hệ thống sẽ cập nhật tồn kho khi đơn hàng được xác nhận
- Đối với thú cưng, trạng thái sẽ được chuyển từ "available" sang "sold" khi đơn hàng hoàn tất

## Trạng thái đơn hàng

1. **Pending** - Đơn hàng mới được tạo, chưa được xác nhận
2. **Confirmed** - Đơn hàng đã được xác nhận, đang chuẩn bị hàng
3. **Processing** - Đơn hàng đang được xử lý (đóng gói, giao cho đơn vị vận chuyển)
4. **Ready** - Đơn hàng đã sẵn sàng để giao hoặc đón
5. **Completed** - Đơn hàng đã được giao và hoàn tất
6. **Cancelled** - Đơn hàng đã bị hủy

## Trạng thái thanh toán

1. **Unpaid** - Chưa thanh toán
2. **Paid** - Đã thanh toán
3. **Refunded** - Đã hoàn tiền

## Phương thức thanh toán

1. **COD** - Thanh toán khi nhận hàng
2. **BankTransfer** - Chuyển khoản ngân hàng
3. **CreditCard** - Thẻ tín dụng
4. **Ewallet** - Ví điện tử

## Phương thức giao hàng

1. **Delivery** - Giao hàng tận nơi
2. **Pickup** - Nhận tại cửa hàng

## Tích hợp với Frontend

### 1. Hiển thị giỏ hàng
```javascript
// Lấy thông tin giỏ hàng
async function getCart() {
  try {
    const response = await fetch('https://api.yummypet.com/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (data.success) {
      // Render giỏ hàng
      renderCart(data.data);
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
  }
}

// Hiển thị số lượng item trong giỏ hàng (icon giỏ hàng)
async function getCartItemCount() {
  try {
    const response = await fetch('https://api.yummypet.com/api/cart/count', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (data.success) {
      // Cập nhật badge số lượng
      document.getElementById('cart-badge').textContent = data.data;
    }
  } catch (error) {
    console.error('Error fetching cart count:', error);
  }
}
```

### 2. Thêm sản phẩm vào giỏ hàng
```javascript
async function addToCart(itemType, productId, quantity) {
  try {
    const response = await fetch('https://api.yummypet.com/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        itemType: itemType,  // product, pet
        productId: productId,  // hoặc petId tùy thuộc vào itemType
        quantity: quantity
      })
    });
    
    const data = await response.json();
    if (data.success) {
      // Hiển thị thông báo thành công
      showToast('Đã thêm vào giỏ hàng');
      // Cập nhật số lượng giỏ hàng
      getCartItemCount();
    } else {
      // Hiển thị lỗi
      showToast(data.message, 'error');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    showToast('Có lỗi xảy ra khi thêm vào giỏ hàng', 'error');
  }
}
```

### 3. Thanh toán giỏ hàng
```javascript
async function checkout(checkoutData) {
  try {
    const response = await fetch('https://api.yummypet.com/api/cart/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        paymentMethod: checkoutData.paymentMethod,
        deliveryAddress: checkoutData.deliveryAddress,
        notes: checkoutData.notes
      })
    });
    
    const data = await response.json();
    if (data.success) {
      // Chuyển hướng đến trang cảm ơn
      window.location.href = `/thank-you?orderCode=${data.data.orderCode}`;
    } else {
      // Hiển thị lỗi
      showCheckoutError(data.message);
    }
  } catch (error) {
    console.error('Error during checkout:', error);
    showCheckoutError('Có lỗi xảy ra trong quá trình thanh toán');
  }
}
```

## Xử lý lỗi phổ biến

### 1. Lỗi xác thực
Nếu người dùng chưa đăng nhập hoặc token hết hạn, hệ thống sẽ trả về lỗi 401.
```javascript
// Kiểm tra lỗi xác thực và chuyển hướng đến trang đăng nhập nếu cần
function handleAuthError(error) {
  if (error.status === 401) {
    // Lưu URL hiện tại để redirect sau khi đăng nhập
    localStorage.setItem('redirectUrl', window.location.pathname);
    // Chuyển hướng đến trang đăng nhập
    window.location.href = '/login';
  }
}
```

### 2. Lỗi tồn kho
Khi số lượng yêu cầu vượt quá tồn kho, hệ thống sẽ trả về lỗi.
```javascript
// Xử lý lỗi khi thêm sản phẩm vào giỏ hàng
function handleAddToCartError(error) {
  if (error.message.includes('chỉ còn')) {
    // Hiển thị thông báo tồn kho không đủ
    showStockAlert(error.message);
  } else {
    // Hiển thị lỗi chung
    showToast(error.message, 'error');
  }
}
```

### 3. Lỗi Hibernate ObjectDeletedException
Đôi khi có thể gặp lỗi này khi thực hiện checkout do vấn đề với transaction của Hibernate.
```javascript
// Xử lý lỗi ObjectDeletedException khi checkout
function handleCheckoutError(error) {
  if (error.includes('ObjectDeletedException') || error.includes('deleted instance')) {
    // Hiển thị thông báo lỗi cụ thể
    showToast('Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng tải lại trang và thử lại.', 'error');  } else {
    // Hiển thị lỗi chung
    showToast(error, 'error');
  }
}

// Tích hợp xử lý lỗi vào luồng checkout
async function checkoutWithErrorHandling(checkoutData) {
  try {
    const response = await fetch('https://api.yummypet.com/api/cart/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(checkoutData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Chuyển hướng đến trang cảm ơn
      window.location.href = `/thank-you?orderCode=${data.data.orderCode}`;
    } else {
      // Phân tích lỗi và xử lý theo loại
      if (data.message?.includes('rollback-only') || data.message?.includes('Transaction')) {
        handleTransactionRollbackError(data.message);
      } else if (data.message?.includes('ObjectDeletedException')) {
        handleCheckoutError(data.message);
      } else if (data.message?.includes('chỉ còn')) {
        showStockAlert(data.message);
      } else {
        showToast(data.message || 'Lỗi không xác định khi thanh toán', 'error');
      }
    }
  } catch (error) {
    console.error('Error during checkout:', error);
    // Kiểm tra loại lỗi và xử lý phù hợp
    const errorMessage = error.message || 'Lỗi không xác định khi thanh toán';
    
    if (errorMessage.includes('rollback-only') || errorMessage.includes('Transaction')) {
      handleTransactionRollbackError(errorMessage);
    } else {
      showToast(errorMessage, 'error');
    }
  }
}
```

### 4. Lỗi Transaction marked as rollback-only
Đôi khi khi thực hiện thanh toán có thể gặp lỗi "Transaction silently rolled back because it has been marked as rollback-only".
```javascript
// Xử lý lỗi Transaction rollback khi checkout
function handleTransactionRollbackError(error) {
  if (error.message.includes('rollback-only') || 
      error.message.includes('transaction') || 
      error.message.includes('Transaction silently rolled back')) {
    
    // Hiển thị thông báo lỗi đặc biệt cho vấn đề transaction
    showToast('Có lỗi xảy ra trong quá trình xử lý thanh toán. Hệ thống đang thực hiện lại giao dịch...', 'warning');
    
    // Đợi 2 giây và thử lại
    setTimeout(() => {
      window.location.reload(); // Tải lại trang để đảm bảo trạng thái mới nhất
    }, 2000);
  } else {
    // Xử lý lỗi chung
    showToast(error, 'error');
  }
}
```

## Tối ưu trải nghiệm người dùng

### 1. Caching giỏ hàng
Lưu trữ dữ liệu giỏ hàng trong localStorage để giảm số lần gọi API và cải thiện trải nghiệm người dùng.
```javascript
// Lưu thông tin giỏ hàng vào localStorage
function cacheCartData(cartData) {
  localStorage.setItem('cart', JSON.stringify(cartData));
  localStorage.setItem('cartLastUpdated', new Date().toISOString());
}

// Lấy thông tin giỏ hàng từ cache hoặc API
async function getCartData() {
  const cachedCart = localStorage.getItem('cart');
  const lastUpdated = localStorage.getItem('cartLastUpdated');
  
  // Nếu có cache và cache chưa quá cũ (30 phút)
  if (cachedCart && lastUpdated) {
    const timeDiff = new Date() - new Date(lastUpdated);
    if (timeDiff < 30 * 60 * 1000) {
      return JSON.parse(cachedCart);
    }
  }
  
  // Không có cache hoặc cache quá cũ, gọi API
  const cartData = await fetchCartFromAPI();
  cacheCartData(cartData);
  return cartData;
}
```

### 2. Optimistic UI
Cập nhật UI ngay lập tức khi người dùng thực hiện hành động, không chờ phản hồi từ API.
```javascript
// Cập nhật UI ngay lập tức khi thêm sản phẩm vào giỏ hàng
function optimisticAddToCart(product, quantity) {
  // Cập nhật UI trước
  updateCartUI(product, quantity);
  
  // Gửi request đến server
  addToCartAPI(product.id, quantity)
    .then(response => {
      // Nếu thành công, không cần làm gì vì UI đã được cập nhật
      console.log('Product added to cart successfully');
    })
    .catch(error => {
      // Nếu thất bại, hoàn tác UI
      revertCartUI();
      showToast(error.message, 'error');
    });
}
```


