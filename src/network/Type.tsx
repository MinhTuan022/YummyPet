export interface ProductType {
  id: number;
  name: string;
  description: string;
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
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  categoryName: string;
  stockStatus?: string;
}

export interface PetType {
  id: number;
  petCode: string;
  name: string;
  category: CategoryType;
  species: string;
  breed: string;
  gender: "male" | "female" | "other";
  ageMonths: number;
  weight: number;
  color: string;
  price: number;
  description?: string;
  arrivalDate: string;
  status: "available" | "sold";
  certificateInfo?: string;
  healthStatus: "excellent" | "good" | "fair" | "poor";
  vaccinationStatus: "fully_vaccinated" | "partially_vaccinated" | "not_vaccinated";
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  primaryImageUrl?: string;
  images?: PetImageType[];
}

export interface PetImageType {
  id?: number;
  petId?: number;
  imageUrl: string;
  altText?: string;
  isPrimary?: boolean;
  displayOrder?: number;
  createdAt?: string;
}

export interface CategoryType {
  id: number
  name: string
  description: string
  parentId: any
  parentName: any
  categoryType: string
  isActive: boolean
  createdAt: string
  updatedAt: any
}

export interface ServiceType {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  key?: string;
  id: number;
  employeeCode: string;
  username: string;
  email: string;
  fullName: string;
  phone: string | null;
  address: string | null;
  dateOfBirth: string | null;
  hireDate: string;
  salary: number;
  position: string;
  department: string;
  isActive: boolean;
  roleName: string;
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for backward compatibility
  role?: string;
  gender?: string | null;
  password?: string;
}
