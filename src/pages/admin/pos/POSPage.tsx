import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  InputNumber,
  message,
  Tabs,
  Tag,
  Space,
  Typography,
  Badge,
  Radio,
  Input,
  Modal,
  Form,
  Statistic,
  Avatar,
  Empty,
  Spin,
  DatePicker,
  Image,
  Pagination,
} from "antd";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  PrinterOutlined,
  ClearOutlined,
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
  CreditCardOutlined,
  MoneyCollectOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { _request } from "../../../network/Api";
import "./POSPage.scss";
import InputSearch from "../../../components/inputSearch/InputSearch";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  costPrice?: number;
  stockQuantity: number;
  minStockLevel?: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  brand?: string;
  originCountry?: string;
  expiryDate?: string;
  imageUrl?: string;
  isActive: boolean;
  categoryId?: number;
  categoryName?: string;
  stockStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  primaryImageUrl?: string;
}

interface Pet {
  id: number;
  petCode?: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  ageMonths?: number;
  weight?: number;
  color?: string;
  price: number;
  costPrice?: number;
  description?: string;
  arrivalDate?: string;
  status: string;
  certificateInfo?: string;
  healthStatus?: string;
  vaccinationStatus?: string;
  isActive: boolean;
  categoryId?: number;
  category?: any;
  images?: any[];
  primaryImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  primaryImageUrl?: string;
}

interface Customer {
  id: number;
  customerCode: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  loyaltyPoints: number;
  isActive: boolean;
  hasAccount?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CartItem {
  id: string;
  type: "product" | "pet" | "service";
  itemId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  serviceNotes?: string;
  petId?: number;
  estimatedDuration?: number;
  completionDate?: string;
  assignedEmployeeId?: number;
}

interface CustomerInfo {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  loyaltyPoints?: number;
  isGuest?: boolean;
}

const POSPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [customerType, setCustomerType] = useState<
    "anonymous" | "guest" | "registered"
  >("anonymous");
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productSearchKeyword, setProductSearchKeyword] = useState("");
  const [petSearchKeyword, setPetSearchKeyword] = useState("");
  const [serviceSearchKeyword, setServiceSearchKeyword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingPets, setLoadingPets] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [customerSearchText, setCustomerSearchText] = useState("");
  const [foundCustomers, setFoundCustomers] = useState<Customer[]>([]);
  const [searchingCustomers, setSearchingCustomers] = useState(false);

  const [productPagination, setProductPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });
  const [petPagination, setPetPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });
  const [servicePagination, setServicePagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });

  const [customerForm] = Form.useForm();
  const [paymentForm] = Form.useForm();
  useEffect(() => {
    loadProducts(1, productPagination.pageSize);
    loadPets(1, petPagination.pageSize);
    loadServices(1, servicePagination.pageSize);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProducts(1, productPagination.pageSize); 
      setProductPagination((prev) => ({ ...prev, current: 1 }));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [productSearchKeyword]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPets(1, petPagination.pageSize); 
      setPetPagination((prev) => ({ ...prev, current: 1 }));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [petSearchKeyword]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadServices(1, servicePagination.pageSize); 
      setServicePagination((prev) => ({ ...prev, current: 1 }));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [serviceSearchKeyword]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (customerSearchText && customerSearchText.length >= 3) {
        setSearchingCustomers(true);
        searchCustomers(customerSearchText);
      } else {
        setFoundCustomers([]);
        setSearchingCustomers(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [customerSearchText]);
  const loadProducts = async (page = 1, pageSize = 8) => {
    setLoadingProducts(true);
    try {
      const queryParams = new URLSearchParams();

      queryParams.append("page", (page - 1).toString()); 
      queryParams.append("size", pageSize.toString());

      if (productSearchKeyword) {
        queryParams.append("name", productSearchKeyword);
      }

      const queryString = queryParams.toString();

      _request({
        path: `/products/search?${queryString}`,
        method: "GET",
        onSuccess: (response) => {
          console.log("Products API response:", response);

          if (!response.success) {
            console.error("Products API returned success = false:", response);
            message.error(response.message || "Lỗi từ server");
            return;
          }

          const data = response.data || response;
          const productsData = data.content || data;

          if (!Array.isArray(productsData)) {
            console.error("Products data is not an array:", productsData);
            message.error("Định dạng dữ liệu không hợp lệ");
            return;
          }

          console.log("Products data from API:", productsData);
          setProducts(productsData);

          if (data.totalElements !== undefined) {
            setProductPagination({
              current: data.number + 1,
              pageSize: data.size || 8,
              total: data.totalElements,
            });
          }
        },
        onError: (error) => {
          console.error("Error fetching products:", error);
          message.error("Không thể tải danh sách sản phẩm");
        },
      });
    } finally {
      setLoadingProducts(false);
    }
  };
  const loadPets = async (page = 1, pageSize = 8) => {
    setLoadingPets(true);
    try {
      const queryParams = new URLSearchParams();

      queryParams.append("page", (page - 1).toString()); 
      queryParams.append("size", pageSize.toString());

      if (petSearchKeyword) {
        queryParams.append("search", petSearchKeyword);
      }

      const queryString = queryParams.toString();

      _request({
        path: `/pets?${queryString}`,
        method: "GET",
        onSuccess: (response) => {
          console.log("Pets API response:", response);

          if (!response.success) {
            console.error("Pets API returned success = false:", response);
            message.error(response.message || "Lỗi từ server");
            return;
          }

          const data = response.data || response;
          const petsData = data.content || data;

          if (!Array.isArray(petsData)) {
            console.error("Pets data is not an array:", petsData);
            message.error("Định dạng dữ liệu không hợp lệ");
            return;
          }

          console.log("Pets data from API:", petsData);
          console.log(
            "Pets data from API 2:",
            petsData.map((pet) => pet.isActive && pet.status === "available")
          );

          if (Array.isArray(petsData)) {
            setPets(
              petsData.filter(
                (pet) => pet.isActive && pet.status === "available"
              )
            );
          }

          if (data.totalElements !== undefined) {
            setPetPagination({
              current: data.number + 1,
              pageSize: data.size || 8,
              total: data.totalElements,
            });
          }
        },
        onError: (error) => {
          console.error("Error fetching pets:", error);
          message.error("Không thể tải danh sách thú cưng");
        },
      });
    } finally {
      setLoadingPets(false);
    }
  };
  const loadServices = async (page = 1, pageSize = 8) => {
    setLoadingServices(true);
    try {
      const queryParams = new URLSearchParams();

      queryParams.append("page", (page - 1).toString()); 
      queryParams.append("size", pageSize.toString());

      if (serviceSearchKeyword) {
        queryParams.append("search", serviceSearchKeyword);
      }

      const queryString = queryParams.toString();

      _request({
        path: `/services?${queryString}`,
        method: "GET",
        onSuccess: (response) => {
          console.log("Services API response:", response);

          if (!response.success) {
            console.error("Services API returned success = false:", response);
            message.error(response.message || "Lỗi từ server");
            return;
          }

          const data = response.data || response;
          const servicesData = data.content || data;

          if (!Array.isArray(servicesData)) {
            console.error("Services data is not an array:", servicesData);
            message.error("Định dạng dữ liệu không hợp lệ");
            return;
          }

          console.log("Services data from API:", servicesData);
          setServices(servicesData);

          if (data.totalElements !== undefined) {
            setServicePagination({
              current: data.number + 1, 
              pageSize: data.size || 8,
              total: data.totalElements,
            });
          }
        },
        onError: (error) => {
          console.error("Error fetching services:", error);
          message.error("Không thể tải danh sách dịch vụ");
        },
      });
    } finally {
      setLoadingServices(false);
    }
  };
  const searchCustomers = async (phone: string) => {
    if (!phone || phone.length < 3) {
      setFoundCustomers([]);
      return;
    }

    try {
      _request({
        path: `/customers/search/phone?phone=${encodeURIComponent(phone)}`,
        method: "GET",
        onSuccess: (response) => {
          console.log("Customer search API response:", response);

          if (!response.success) {
            console.error(
              "Customer search API returned success = false:",
              response
            );
            message.error(response.message || "Lỗi từ server");
            return;
          }

          const data = response.data || response;
          const customersData = data.content || data;

          if (!Array.isArray(customersData)) {
            console.error("Customers data is not an array:", customersData);
            message.error("Định dạng dữ liệu không hợp lệ");
            return;
          }
          console.log("Customer search data from API:", customersData);
          setFoundCustomers(customersData);
        },
        onError: (error) => {
          console.error("Error searching customers:", error);
          message.error("Không thể tìm kiếm khách hàng");
        },
      });
    } catch (error) {
      console.error("Error searching customers:", error);
      message.error("Không thể tìm kiếm khách hàng");
    } finally {
      setSearchingCustomers(false);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const addToCart = (
    item: Product | Pet | Service,
    type: "product" | "pet" | "service"
  ) => {
    if (type === "service") {
      showServiceModal(item as Service);
    } else {
      const cartId = `${type}_${item.id}_${Date.now()}`;
      const newItem: CartItem = {
        id: cartId,
        type,
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      };

      setCart((prev) => [...prev, newItem]);
      message.success(`Đã thêm ${item.name} vào giỏ hàng`);
    }
  };

  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceForm] = Form.useForm();

  const showServiceModal = (service: Service) => {
    setSelectedService(service);
    setServiceModalVisible(true);
    serviceForm.resetFields();
  };
  const handleServiceAdd = () => {
    serviceForm
      .validateFields()
      .then((values) => {
        if (selectedService) {
          const cartId = `service_${selectedService.id}_${Date.now()}`;
          const newItem: CartItem = {
            id: cartId,
            type: "service",
            itemId: selectedService.id,
            name: selectedService.name,
            price: selectedService.price,
            quantity: 1,
            serviceNotes: values.serviceNotes,
            ...(values.petId && { petId: values.petId }),
            ...(values.estimatedDuration && {
              estimatedDuration: values.estimatedDuration,
            }),
            ...(values.completionDate && {
              completionDate: values.completionDate,
            }),
            ...(values.assignedEmployeeId && {
              assignedEmployeeId: values.assignedEmployeeId,
            }),
          };

          setCart((prev) => [...prev, newItem]);
          message.success(
            `Đã thêm dịch vụ ${selectedService.name} vào giỏ hàng`
          );
          setServiceModalVisible(false);
          setSelectedService(null);
          serviceForm.resetFields();
        }
      })
      .catch(() => {
        message.error("Vui lòng điền đầy đủ thông tin dịch vụ");
      });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };
  const clearCart = () => {
    setCart([]);
    setCustomer(null);
    setCustomerType("anonymous");
    customerForm.resetFields();
    setCustomerSearchText("");
    setFoundCustomers([]);
    setProductSearchKeyword("");
    setPetSearchKeyword("");
    setServiceSearchKeyword("");
  };

  const handleCustomerTypeChange = (
    type: "anonymous" | "guest" | "registered"
  ) => {
    setCustomerType(type);
    setCustomer(null);
    customerForm.resetFields();
    setCustomerSearchText("");
    setFoundCustomers([]);
  };

  const saveGuestCustomer = () => {
    customerForm
      .validateFields()
      .then((values) => {
        setCustomer({
          name: values.name,
          phone: values.phone,
          email: values.email,
          isGuest: true,
        });
        message.success("Đã lưu thông tin khách hàng");
      })
      .catch(() => {
        message.error("Vui lòng điền đầy đủ thông tin khách hàng");
      });
  };

  const selectCustomer = (selectedCustomer: Customer) => {
    setCustomer({
      id: selectedCustomer.id,
      name: selectedCustomer.fullName,
      phone: selectedCustomer.phone,
      email: selectedCustomer.email,
      loyaltyPoints: selectedCustomer.loyaltyPoints,
    });
    setCustomerSearchText(selectedCustomer.phone);
    setFoundCustomers([]);
    message.success(`Đã chọn khách hàng: ${selectedCustomer.fullName}`);
  };
  const processOrder = async (paymentData: any) => {
    setLoading(true);
    try {
      let endpoint = "/orders/in-store";
      const orderItems = cart.map((item) => {
        const baseItem = {
          itemType: item.type,
          [`${item.type}Id`]: item.itemId,
          quantity: item.quantity,
          unitPrice: item.price,
        };

        if (item.type === "service") {
          return {
            ...baseItem,
            ...(item.serviceNotes && { serviceNotes: item.serviceNotes }),
            ...(item.estimatedDuration && {
              estimatedDuration: item.estimatedDuration,
            }),
            ...(item.completionDate && { completionDate: item.completionDate }),
            ...(item.petId && { petId: item.petId }),
            ...(item.assignedEmployeeId && {
              assignedEmployeeId: item.assignedEmployeeId,
            }),
          };
        }

        return baseItem;
      });
      const hasServices = cart.some((item) => item.type === "service");

      let orderData: any = {
        paymentMethod: paymentData.method,
        notes: paymentData.notes,
        items: orderItems,
        status: "pending",
        ...(hasServices && { statusService: "pending" }),
      };

      if (customerType === "anonymous") {
        endpoint = "/orders/anonymous";
      } else if (customerType === "guest" && customer) {
        endpoint = "/orders/in-store";
        orderData.guestName = customer.name;
        orderData.guestPhone = customer.phone;
        if (customer.email) {
          orderData.guestEmail = customer.email;
        }
      } else if (customerType === "registered" && customer?.id) {
        endpoint = "/orders/in-store";
        orderData.customerId = customer.id;
      }

      console.log("Creating order with endpoint:", endpoint);
      console.log("Order data:", orderData);

      _request({
        path: endpoint,
        method: "POST",
        body: orderData,
        onSuccess: async (result) => {
          const orderCode = result.data?.orderCode || result.orderCode;
          const orderId = result.data?.id || result.id;

          message.success(`Đơn hàng ${orderCode} đã được tạo thành công!`);

          try {
            const hasServices = cart.some((item) => item.type === "service");

            if (hasServices) {
              await updateOrderStatus(orderId, "pending");
              message.info(
                "Đơn hàng có dịch vụ đã được tạo. Vui lòng hoàn thành các dịch vụ trước khi hoàn thành đơn hàng."
              );
            } else {
              await updateOrderStatus(orderId, "completed");
              message.success("Đơn hàng đã được hoàn thành!");
            }

            await confirmPayment(orderId, paymentData.method);
            message.success("Thanh toán thành công!");

            if (paymentData.printReceipt) {
              printReceipt(result);
            }
          } catch (error) {
            console.error("Error completing order or payment:", error);
            message.warning(
              "Đơn hàng đã tạo thành công. Vui lòng hoàn thành thanh toán thủ công."
            );
          }

          clearCart();
          setPaymentModalVisible(false);
        },
        onError: (error) => {
          console.error("Error processing order:", error);
          message.error("Có lỗi xảy ra khi tạo đơn hàng!");
        },
      });
    } catch (error) {
      console.error("Error processing order:", error);
      message.error("Có lỗi xảy ra khi tạo đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    return new Promise((resolve, reject) => {
      _request({
        path: `/orders/${orderId}/status?status=${status}`,
        method: "PUT",
        onSuccess: (result) => {
          console.log("Order status updated:", result);
          resolve(result);
        },
        onError: (error) => {
          console.error("Error updating order status:", error);
          reject(error);
        },
      });
    });
  };
  const confirmPayment = async (orderId: number, paymentMethod: string) => {
    return new Promise((resolve, reject) => {
      _request({
        path: `/orders/${orderId}/payment`,
        method: "POST",
        body: {
          paymentMethod: paymentMethod,
          paymentReference: `POS-${Date.now()}`,
        },
        onSuccess: (result) => {
          console.log("Payment confirmed:", result);
          resolve(result);
        },
        onError: (error) => {
          console.error("Error confirming payment:", error);
          reject(error);
        },
      });
    });
  };

  const printReceipt = (orderData: any) => {
    message.info("Chức năng in hóa đơn sẽ được triển khai");
    console.log("Print receipt for order:", orderData);
  };
  const ProductSelector = React.memo(
    ({ type }: { type: "product" | "pet" | "service" }) => {
      let items: (Product | Pet | Service)[] = [];
      let isLoading = false;
      let searchKeyword = "";
      let setSearchKeyword: (value: string) => void;
      let pagination: { current: number; pageSize: number; total: number } = {
        current: 1,
        pageSize: 8,
        total: 0,
      };
      let loadItems: (page: number, pageSize: number) => void;
      let setPagination: React.Dispatch<
        React.SetStateAction<{
          current: number;
          pageSize: number;
          total: number;
        }>
      >;

      if (type === "product") {
        items = products;
        isLoading = loadingProducts;
        searchKeyword = productSearchKeyword;
        setSearchKeyword = setProductSearchKeyword;
        pagination = productPagination;
        loadItems = loadProducts;
        setPagination = setProductPagination;
      } else if (type === "pet") {
        items = pets;
        isLoading = loadingPets;
        searchKeyword = petSearchKeyword;
        setSearchKeyword = setPetSearchKeyword;
        pagination = petPagination;
        loadItems = loadPets;
        setPagination = setPetPagination;
      } else {
        items = services;
        isLoading = loadingServices;
        searchKeyword = serviceSearchKeyword;
        setSearchKeyword = setServiceSearchKeyword;
        pagination = servicePagination;
        loadItems = loadServices;
        setPagination = setServicePagination;
      }

      // Handle pagination change
      const handlePageChange = (page: number, pageSize?: number) => {
        const newPageSize = pageSize || pagination.pageSize;
        loadItems(page, newPageSize);
        setPagination({
          current: page,
          pageSize: newPageSize,
          total: pagination.total,
        });
      };

      return (
        <div>
          <div style={{ marginBottom: 16 }}>
            {/* <InputSearch
              placeholder={`Tìm kiếm ${
                type === "product"
                  ? "sản phẩm"
                  : type === "pet"
                  ? "thú cưng"
                  : "dịch vụ"
              }...`}
              delay={300}
              onSearch={(value) => setSearchKeyword(value)}
              disabled={isLoading}
            /> */}
            <Input
              placeholder={`Tìm kiếm ${
                type === "product"
                  ? "sản phẩm"
                  : type === "pet"
                  ? "thú cưng"
                  : "dịch vụ"
              }...`}
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              allowClear
              disabled={isLoading}
            />
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin size="large" />
            </div>
          ) : items.length === 0 ? (
            <Empty description="Không tìm thấy dữ liệu" />
          ) : (
            <>
              <div className="product-grid">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="product-card"
                    onClick={() => addToCart(item, type)}
                  >
                    <div className="product-image">
                      {type === "product" &&
                        ((item as Product).primaryImageUrl ? (
                          <Image
                            className="img-view"
                            preview={false}
                            src={`/img/${(item as Pet).primaryImageUrl}`}
                          ></Image>
                        ) : (
                          "📦"
                        ))}
                      {type === "pet" &&
                        ((item as Pet).primaryImageUrl ? (
                          <Image
                            className="img-view"
                            preview={false}
                            src={`/img/${(item as Pet).primaryImageUrl}`}
                          ></Image>
                        ) : (
                          "🐕"
                        ))}
                      {type === "service" &&
                        ((item as Service).primaryImageUrl ? (
                          <Image
                            className="img-view"
                            preview={false}
                            src={`/img/${(item as Pet).primaryImageUrl}`}
                          ></Image>
                        ) : (
                          "✨"
                        ))}
                    </div>
                    <div className="product-name">{item.name}</div>
                    <div className="product-price">
                      {item.price?.toLocaleString("vi-VN")}đ
                    </div>
                    {type === "product" && (
                      <div className="product-meta">
                        Tồn kho: {(item as Product).stockQuantity}
                      </div>
                    )}{" "}
                    {type === "pet" && (
                      <div className="product-meta">
                        {(item as Pet).breed} •{" "}
                        {(item as Pet).ageMonths
                          ? `${(item as Pet).ageMonths} tháng`
                          : "N/A"}
                      </div>
                    )}
                    {type === "service" && (
                      <div className="product-meta">
                        {(item as Service).durationMinutes
                          ? `${(item as Service).durationMinutes} phút`
                          : "N/A"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Pagination */}
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <Pagination
                  current={pagination.current}
                  total={pagination.total}
                  pageSize={pagination.pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  size="small"
                  hideOnSinglePage={pagination.total <= pagination.pageSize}
                  showTotal={(total, range) => (
                    <span style={{ fontSize: "12px", marginRight: "8px" }}>
                      {range[0]}-{range[1]} / {total}
                      {type === "product"
                        ? " sản phẩm"
                        : type === "pet"
                        ? " thú cưng"
                        : " dịch vụ"}
                    </span>
                  )}
                  style={{ margin: "8px 0" }}
                />
              </div>
            </>
          )}
        </div>
      );
    }
  );

  const CustomerSearch = () => {
    if (customerType === "guest") {
      return (
        <Card
          size="small"
          title="Thông tin khách lẻ"
          className="customer-info-card"
        >
          <Form form={customerForm} layout="vertical" className="customer-form">
            <Form.Item
              name="name"
              label="Tên khách hàng"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input placeholder="Nhập tên khách hàng" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input placeholder="Nhập email (tùy chọn)" />
            </Form.Item>
            <Button
              type="primary"
              size="small"
              onClick={saveGuestCustomer}
              block
            >
              Lưu thông tin
            </Button>
          </Form>
        </Card>
      );
    }

    if (customerType === "registered") {
      return (
        <Card
          size="small"
          title="Tìm thành viên"
          className="customer-info-card"
        >
          <Spin spinning={searchingCustomers}>
            <Input
              placeholder="Nhập SĐT để tìm thành viên"
              prefix={<PhoneOutlined />}
              value={customerSearchText}
              onChange={(e) => {
                setCustomerSearchText(e.target.value);
              }}
              allowClear
            />{" "}
          </Spin>

          {customerSearchText &&
            customerSearchText.length >= 3 &&
            !searchingCustomers &&
            foundCustomers.length === 0 && (
              <div
                style={{
                  marginTop: 8,
                  padding: 8,
                  textAlign: "center",
                  color: "#999",
                }}
              >
                Không tìm thấy khách hàng nào
              </div>
            )}

          {customerSearchText &&
            customerSearchText.length > 0 &&
            customerSearchText.length < 3 && (
              <div
                style={{
                  marginTop: 8,
                  padding: 8,
                  textAlign: "center",
                  color: "#999",
                }}
              >
                Nhập ít nhất 3 ký tự để tìm kiếm
              </div>
            )}

          {foundCustomers.length > 0 && (
            <div style={{ marginTop: 8, maxHeight: 200, overflowY: "auto" }}>
              {foundCustomers.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: 8,
                    border: "1px solid #d9d9d9",
                    borderRadius: 4,
                    marginBottom: 4,
                    cursor: "pointer",
                    background: customer?.id === c.id ? "#e6f7ff" : "white",
                  }}
                  onClick={() => selectCustomer(c)}
                >
                  <div style={{ fontWeight: 600 }}>{c.fullName}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    {c.phone} • {c.loyaltyPoints} điểm
                  </div>
                </div>
              ))}
            </div>
          )}

          {customer && customerType === "registered" && (
            <div className="registered-customer" style={{ marginTop: 8 }}>
              <Avatar icon={<UserOutlined />} className="customer-avatar" />
              <div className="customer-details">
                <div className="customer-name">{customer.name}</div>
                <div className="customer-phone">{customer.phone}</div>
                <div className="loyalty-points">
                  Điểm tích lũy: {customer.loyaltyPoints || 0}
                </div>
              </div>
            </div>
          )}
        </Card>
      );
    }

    return null;
  };

  const CartSummary = () => (
    <div className="cart-summary">
      <div className="summary-row">
        <Text>Tạm tính:</Text>
        <Text>{subtotal?.toLocaleString("vi-VN")}đ</Text>
      </div>
      <div className="summary-row">
        <Text>VAT (10%):</Text>
        <Text>{tax?.toLocaleString("vi-VN")}đ</Text>
      </div>
      <div className="summary-row total-row">
        <Text strong>Tổng cộng:</Text>
        <Text strong className="total-amount">
          {total?.toLocaleString("vi-VN")}đ
        </Text>
      </div>
    </div>
  );

  const PaymentModal = () => {
    const [paymentMethod, setPaymentMethod] = useState("cash");

    const handlePayment = () => {
      paymentForm.validateFields().then((values) => {
        processOrder({
          method: paymentMethod,
          notes: values.notes || "",
          printReceipt: values.printReceipt || false,
        });
      });
    };

    return (
      <Modal
        title="Thanh toán"
        open={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setPaymentModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="pay"
            type="primary"
            loading={loading}
            onClick={handlePayment}
          >
            Xác nhận thanh toán
          </Button>,
        ]}
        width={500}
        className="payment-modal"
      >
        <div className="payment-summary">
          <Statistic
            title="Tổng tiền thanh toán"
            value={total}
            precision={0}
            valueStyle={{ color: "#f50", fontSize: 24 }}
            suffix="đ"
            className="total-amount"
          />
        </div>

        <Form form={paymentForm} layout="vertical">
          <Form.Item label="Phương thức thanh toán">
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="payment-methods"
            >
              <Radio value="cash">
                <Space>
                  <MoneyCollectOutlined />
                  Tiền mặt
                </Space>
              </Radio>
              <Radio value="card">
                <Space>
                  <CreditCardOutlined />
                  Thẻ ngân hàng
                </Space>
              </Radio>
              <Radio value="bank_transfer">
                <Space>
                  <BankOutlined />
                  Chuyển khoản
                </Space>
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <TextArea rows={2} placeholder="Ghi chú đơn hàng..." />
          </Form.Item>
          <Form.Item name="printReceipt" valuePropName="checked">
            <div>
              <input type="checkbox" id="printReceipt" />
              <label htmlFor="printReceipt" style={{ marginLeft: 8 }}>
                In hóa đơn sau khi thanh toán
              </label>
            </div>
          </Form.Item>{" "}
        </Form>
      </Modal>
    );
  };
  const ServiceModal = () => (
    <Modal
      title={`Thêm dịch vụ: ${selectedService?.name}`}
      open={serviceModalVisible}
      onOk={handleServiceAdd}
      onCancel={() => {
        setServiceModalVisible(false);
        setSelectedService(null);
        serviceForm.resetFields();
      }}
      width={600}
    >
      <Form form={serviceForm} layout="vertical">
        <Form.Item
          name="serviceNotes"
          label="Ghi chú dịch vụ"
          rules={[{ required: true, message: "Vui lòng nhập ghi chú dịch vụ" }]}
        >
          <TextArea
            rows={4}
            placeholder="Ghi chú về dịch vụ (tình trạng thú cưng, yêu cầu đặc biệt, loại thú cưng được phục vụ...)"
          />
        </Form.Item>

        <Row gutter={16}>
          {/* <Col span={12}>
            <Form.Item
              name="petId"
              label="ID thú cưng"
              tooltip="Nếu khách hàng đã đăng ký thú cưng trong hệ thống"
            >
              <InputNumber
                placeholder="ID thú cưng"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item
              name="estimatedDuration"
              label="Thời gian dự kiến (phút)"
              initialValue={selectedService?.durationMinutes}
            >
              <InputNumber
                placeholder="Thời gian dự kiến"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="completionDate"
              label="Ngày hoàn thành dự kiến"
              tooltip="Thời điểm cụ thể khi dịch vụ sẽ hoàn thành"
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="assignedEmployeeId" label="Nhân viên phụ trách">
              <InputNumber
                placeholder="ID nhân viên"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <div
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "#f5f5f5",
            borderRadius: 6,
          }}
        >
          <Text strong>Thông tin dịch vụ:</Text>
          <div style={{ marginTop: 8 }}>
            <div>Tên: {selectedService?.name}</div>
            <div>Giá: {selectedService?.price.toLocaleString("vi-VN")}đ</div>
            <div>Thời gian: {selectedService?.durationMinutes} phút</div>
            {selectedService?.description && (
              <div>Mô tả: {selectedService.description}</div>
            )}
          </div>
        </div>
        <div
          style={{
            marginTop: 12,
            padding: 8,
            backgroundColor: "#e6f7ff",
            borderRadius: 4,
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            💡 Ghi chú: Hãy mô tả rõ thông tin về thú cưng được phục vụ (loại,
            kích thước, tình trạng sức khỏe, v.v.)
          </Text>
        </div>
      </Form>
    </Modal>
  );

  const cartColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: CartItem) => (
        <Space direction="vertical" size={0}>
          <Space>
            {/* <Tag
              color={
                record.type === "product"
                  ? "blue"
                  : record.type === "pet"
                  ? "green"
                  : "orange"
              }
            >
              {record.type === "product"
                ? "SP"
                : record.type === "pet"
                ? "TC"
                : "DV"}
            </Tag> */}
            <Text strong style={{ fontSize: 12 }}>
              {text}
            </Text>
          </Space>{" "}
          {record.type === "service" && (
            <div style={{ fontSize: 10, color: "#666" }}>
              {record.serviceNotes && <div>Ghi chú: {record.serviceNotes}</div>}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 80,
      render: (price: number) => (
        <Text style={{ fontSize: 12 }}>{price.toLocaleString("vi-VN")}đ</Text>
      ),
    },
    {
      title: "SL",
      dataIndex: "quantity",
      key: "quantity",
      width: 60,
      render: (quantity: number, record: CartItem) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => updateQuantity(record.id, value || 1)}
          size="small"
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Tổng",
      key: "total",
      width: 80,
      render: (_: any, record: CartItem) => (
        <Text strong style={{ fontSize: 12 }}>
          {(record.price * record.quantity).toLocaleString("vi-VN")}đ
        </Text>
      ),
    },
    {
      title: "",
      key: "action",
      width: 40,
      render: (_: any, record: CartItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.id)}
          size="small"
        />
      ),
    },
  ];

  return (
    <div className="pos-page">
      <Row gutter={16} style={{ height: "calc(100vh - 100px)" }}>
        {/* Left Panel - Product Selection */}{" "}
        <Col span={16}>
          <Card
            title={
              <Space>
                <ShoppingCartOutlined />
                <span>Chọn sản phẩm</span>
              </Space>
            }
            style={{ height: "100%" }}
            bodyStyle={{
              height: "calc(100% - 57px)",
              overflow: "hidden",
              padding: "12px",
            }}
          >
            <Tabs
              defaultActiveKey="products"
              type="card"
              style={{ height: "100%" }}
              tabBarStyle={{ marginBottom: "8px" }}
            >
              <TabPane
                tab="Sản phẩm"
                key="products"
                style={{ height: "calc(100% - 45px)", overflowY: "auto" }}
              >
                <ProductSelector type="product" />
              </TabPane>
              <TabPane
                tab="Thú cưng"
                key="pets"
                style={{ height: "calc(100% - 45px)", overflowY: "auto" }}
              >
                <ProductSelector type="pet" />
              </TabPane>
              <TabPane
                tab="Dịch vụ"
                key="services"
                style={{ height: "calc(100% - 45px)", overflowY: "auto" }}
              >
                <ProductSelector type="service" />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={
              <Space>
                <Badge count={cart.length} size="small">
                  <ShoppingCartOutlined />
                </Badge>
                <span>Giỏ hàng</span>
              </Space>
            }
            style={{ height: "100%" }}
            bodyStyle={{
              height: "calc(100% - 57px)",
              display: "flex",
              flexDirection: "column",
            }}
            extra={
              <Button
                type="text"
                icon={<ClearOutlined />}
                onClick={clearCart}
                disabled={cart.length === 0}
                size="small"
              >
                Xóa hết
              </Button>
            }
          >
            <div style={{ marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0, marginBottom: 8 }}>
                Loại khách hàng:
              </Title>
              <Radio.Group
                value={customerType}
                onChange={(e) => handleCustomerTypeChange(e.target.value)}
                style={{ width: "100%" }}
                size="small"
                className="customer-type-selector"
              >
                <Radio.Button value="anonymous">Vãng lai</Radio.Button>
                <Radio.Button value="guest">Khách lẻ</Radio.Button>
                <Radio.Button value="registered">Thành viên</Radio.Button>
              </Radio.Group>
            </div>

            <div className="customer-section">
              {customerType !== "anonymous" && <CustomerSearch />}
            </div>

            <div style={{ flex: 1, overflow: "auto", marginTop: 16 }}>
              <Table
                dataSource={cart}
                columns={cartColumns}
                pagination={false}
                size="small"
                rowKey="id"
                locale={{ emptyText: "Giỏ hàng trống" }}
                scroll={{ y: 250 }}
                className="cart-table"
              />
            </div>

            <div style={{ marginTop: "auto" }}>
              <CartSummary />
            </div>

            <div className="checkout-actions">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<MoneyCollectOutlined />}
                  onClick={() => setPaymentModalVisible(true)}
                  disabled={
                    cart.length === 0 ||
                    (customerType !== "anonymous" && !customer)
                  }
                  block
                  className="primary-btn"
                >
                  Thanh toán ({total.toLocaleString("vi-VN")}đ)
                </Button>
                {/* <Button
                  size="large"
                  icon={<PrinterOutlined />}
                  disabled={cart.length === 0}
                  block
                >
                  In hóa đơn tạm
                </Button> */}
              </Space>
            </div>
          </Card>
        </Col>
      </Row>{" "}
      <PaymentModal />
      <ServiceModal />
    </div>
  );
};

export default POSPage;
