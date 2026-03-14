export type UserRole = 'USER' | 'ADMIN';

export interface User {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
    address?: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface ProductImage {
    url: string;
    isPrimary: boolean;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: string;
    images: ProductImage[];
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface ProductFilters {
    search?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
}

export interface CartItem {
    productId: string;
    quantity: number;
    product: Product;
}

export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    summary?: {
        totalItems: number;
        totalPrice: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    productName: string;
    price: number;
    quantity: number;
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export interface Order {
    id: string;
    userId: string;
    status: OrderStatus;
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    totalAmount: number;
    phoneNumber: string;
    address: string;
    items: OrderItem[];
    user?: User;
    createdAt: string;
}

export interface AuthResponse {
    status: string;
    data: {
        user: User;
        accessToken: string;
    };
}

export interface RefreshResponse {
    status: string;
    data: {
        accessToken: string;
    };
}

export interface SystemConfig {
    key: string;
    value: string;
    description?: string;
    updatedAt: string;
}

export interface SystemConfigResponse {
    status: string;
    data: SystemConfig[];
}

export enum DiscountType {
    PERCENTAGE = 'PERCENTAGE',
    FIXED_AMOUNT = 'FIXED_AMOUNT'
}

export enum DiscountScope {
    GLOBAL = 'GLOBAL',
    CATEGORY = 'CATEGORY',
    PRODUCT = 'PRODUCT'
}

export interface Discount {
    id: string;
    code: string;
    description?: string;
    type: DiscountType;
    value: number;
    startDate: string;
    endDate: string;
    usageLimit?: number;
    usedCount: number;
    minOrderAmount: number;
    isActive: boolean;
    scope: DiscountScope;
    categoryId?: string;
    productId?: string;
}

export interface ValidateDiscountResponse {
    discountId: string;
    code: string;
    amount: number;
    type: DiscountType;
    value: number;
}

export interface PreviewCheckoutResponse {
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    totalAmount: number;
}
