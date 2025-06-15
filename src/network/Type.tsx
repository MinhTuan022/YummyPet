export interface ProductType {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  ageMonths: number;
  breed: string;
  color: string;
  gender: string;
  healthStatus: string;
  vaccinationStatus: string;
  certificateInfo: string;
  weight: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  categoryName: string;
}



export interface Employee {
  key: string;
  id: number;
  fullName: string;
  email: string | null;
  phone: string | null;
  employeeCode: string;
  username: string;
  password: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role: string;
  gender: string | null;
  address: string | null;
  dateOfBirth: string | null;
}
