// API Helper cho POS System
export interface Product {
  id: number;
  name: string;
  price: number;
  costPrice?: number;
  stockQuantity: number;
  imageUrl?: string;
  category: string;
  brand?: string;
  sku?: string;
}

export interface Pet {
  id: number;
  name: string;
  price: number;
  breed: string;
  age: string;
  species: string;
  gender: string;
  imageUrl?: string;
  status: string;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  duration: string;
  description: string;
}

export interface Customer {
  id: number;
  customerCode: string;
  fullName: string;
  phone: string;
  email?: string;
  loyaltyPoints: number;
  isActive: boolean;
}

export interface OrderRequest {
  customerType: 'anonymous' | 'guest' | 'registered';
  customerId?: number;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer';
  notes?: string;
  items: OrderItem[];
}

export interface OrderItem {
  itemType: 'product' | 'pet' | 'service';
  productId?: number;
  petId?: number;
  serviceId?: number;
  quantity: number;
  unitPrice: number;
  petIdServiced?: number; // For services
  serviceNotes?: string; // For services
}

// Mock API calls - sẽ được thay thế bằng real API
export const mockApi = {
  // Products
  getProducts: async (params?: { search?: string; page?: number; size?: number }): Promise<Product[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const products: Product[] = [
      { id: 1, name: 'Royal Canin Medium Adult 15kg', price: 750000, stockQuantity: 25, category: 'Thức ăn chó', brand: 'Royal Canin', sku: 'RC-MA-15' },
      { id: 2, name: 'Whiskas Adult Tuna 1.2kg', price: 85000, stockQuantity: 40, category: 'Thức ăn mèo', brand: 'Whiskas', sku: 'WK-AT-1.2' },
      { id: 3, name: 'Kong Classic Dog Toy Large', price: 320000, stockQuantity: 15, category: 'Đồ chơi', brand: 'Kong', sku: 'KG-CL-L' },
      { id: 4, name: 'FURminator deShedding Tool', price: 890000, stockQuantity: 8, category: 'Dụng cụ', brand: 'FURminator', sku: 'FUR-DS-M' },
      { id: 5, name: 'Cat Litter Clumping 10kg', price: 180000, stockQuantity: 30, category: 'Cát vệ sinh', brand: 'Ever Clean', sku: 'EC-CL-10' },
      { id: 6, name: 'Dog Collar Leather Brown', price: 150000, stockQuantity: 20, category: 'Phụ kiện', brand: 'Petco', sku: 'PC-CL-BR' },
      { id: 7, name: 'Bird Food Premium Mix 1kg', price: 95000, stockQuantity: 35, category: 'Thức ăn chim', brand: 'Vitakraft', sku: 'VK-BF-1' },
      { id: 8, name: 'Aquarium Filter 500L/h', price: 450000, stockQuantity: 12, category: 'Thiết bị cá', brand: 'Eheim', sku: 'EH-AF-500' }
    ];

    if (params?.search) {
      return products.filter(p => 
        p.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        p.category.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    return products;
  },

  // Pets
  getPets: async (params?: { search?: string; page?: number; size?: number }): Promise<Pet[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const pets: Pet[] = [
      { id: 1, name: 'Golden Retriever - Lucy', price: 15000000, breed: 'Golden Retriever', age: '3 tháng', species: 'Chó', gender: 'Cái', status: 'available' },
      { id: 2, name: 'British Shorthair - Mimi', price: 8000000, breed: 'British Shorthair', age: '2 tháng', species: 'Mèo', gender: 'Cái', status: 'available' },
      { id: 3, name: 'Corgi - Max', price: 12000000, breed: 'Corgi', age: '4 tháng', species: 'Chó', gender: 'Đực', status: 'available' },
      { id: 4, name: 'Poodle - Bella', price: 9500000, breed: 'Poodle', age: '5 tháng', species: 'Chó', gender: 'Cái', status: 'available' },
      { id: 5, name: 'Persian Cat - Snow', price: 6500000, breed: 'Persian', age: '3 tháng', species: 'Mèo', gender: 'Đực', status: 'available' },
      { id: 6, name: 'Husky - Storm', price: 18000000, breed: 'Siberian Husky', age: '6 tháng', species: 'Chó', gender: 'Đực', status: 'available' }
    ];

    if (params?.search) {
      return pets.filter(p => 
        p.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        p.breed.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    return pets;
  },

  // Services
  getServices: async (params?: { search?: string; page?: number; size?: number }): Promise<Service[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const services: Service[] = [
      { id: 1, name: 'Tắm và vệ sinh cơ bản', price: 150000, duration: '45-60 phút', description: 'Tắm, sấy khô, vệ sinh tai, cắt móng' },
      { id: 2, name: 'Tắm và cắt tỉa lông', price: 250000, duration: '1.5-2 giờ', description: 'Tắm, cắt tỉa lông theo yêu cầu, vệ sinh' },
      { id: 3, name: 'Spa thư giãn cao cấp', price: 400000, duration: '2-2.5 giờ', description: 'Tắm thảo dược, massage, cắt tỉa, làm đẹp' },
      { id: 4, name: 'Khám sức khỏe tổng quát', price: 300000, duration: '30-45 phút', description: 'Kiểm tra sức khỏe toàn diện, tư vấn' },
      { id: 5, name: 'Tiêm phòng cơ bản', price: 120000, duration: '15-20 phút', description: 'Tiêm phòng dại, viêm gan, ho cũi' },
      { id: 6, name: 'Khám răng miệng', price: 200000, duration: '20-30 phút', description: 'Kiểm tra và vệ sinh răng miệng' },
      { id: 7, name: 'Cắt móng chuyên nghiệp', price: 50000, duration: '10-15 phút', description: 'Cắt móng an toàn, vệ sinh bàn chân' }
    ];

    if (params?.search) {
      return services.filter(s => 
        s.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        s.description.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    return services;
  },

  // Customers
  searchCustomers: async (phone: string): Promise<Customer[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const customers: Customer[] = [
      { id: 1, customerCode: 'CUS000001', fullName: 'Nguyễn Văn An', phone: '0901234567', email: 'an.nv@email.com', loyaltyPoints: 1250, isActive: true },
      { id: 2, customerCode: 'CUS000002', fullName: 'Trần Thị Bình', phone: '0912345678', email: 'binh.tt@email.com', loyaltyPoints: 890, isActive: true },
      { id: 3, customerCode: 'CUS000003', fullName: 'Lê Minh Cường', phone: '0923456789', email: 'cuong.lm@email.com', loyaltyPoints: 2100, isActive: true },
      { id: 4, customerCode: 'CUS000004', fullName: 'Phạm Thị Dung', phone: '0934567890', email: 'dung.pt@email.com', loyaltyPoints: 450, isActive: true },
      { id: 5, customerCode: 'CUS000005', fullName: 'Hoàng Văn Em', phone: '0945678901', email: 'em.hv@email.com', loyaltyPoints: 750, isActive: true }
    ];

    return customers.filter(c => c.phone.includes(phone));
  },

  // Orders
  createOrder: async (orderData: OrderRequest): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const orderId = Date.now();
    const orderCode = `ORD${String(orderId).slice(-6)}`;
    
    console.log('Creating order:', orderData);
    
    return {
      success: true,
      data: {
        id: orderId,
        orderCode,
        status: 'pending',
        ...orderData
      }
    };
  }
};

export default mockApi;
