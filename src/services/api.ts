import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Product, Category, PaginatedResponse, ProductFilters, Cart, Order, AuthResponse, RefreshResponse, User, SystemConfig, SystemConfigResponse, ValidateDiscountResponse, Discount } from '@/types/api';

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;
let onUnauthorizedCallback: (() => void) | null = null;

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000/api';
const API_BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const apiService = {
    setAccessToken: (token: string | null) => {
        accessToken = token;
    },

    // Auth
    register: async (data: any): Promise<User> => {
        const response = await apiClient.post<{ status: string, data: User }>('users/register', data);
        return response.data as unknown as User;
    },

    login: async (data: any): Promise<AuthResponse['data']> => {
        const response = await apiClient.post<AuthResponse>('users/login', data);
        accessToken = (response.data as unknown as AuthResponse['data']).accessToken;
        return response.data as unknown as AuthResponse['data'];
    },

    logout: async () => {
        await apiClient.post('users/logout');
        accessToken = null;
    },

    refreshToken: async () => {
        if (refreshPromise) return refreshPromise;

        refreshPromise = apiClient.post<RefreshResponse>('users/refresh', {}, { _skipInterceptor: true } as any)
            .then(res => {
                // Handle both wrapped and unwrapped response just in case
                const token = res.data?.data?.accessToken || (res.data as any)?.accessToken;
                accessToken = token || null;
                refreshPromise = null;
                return accessToken;
            })
            .catch(err => {
                accessToken = null;
                refreshPromise = null;
                throw err;
            });

        return refreshPromise;
    },

    getAccessToken: () => accessToken,

    // Products
    getProducts: async (filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> => {
        try {
            const response = await apiClient.get<PaginatedResponse<Product>>('products', {
                params: filters,
            });
            return response.data as unknown as PaginatedResponse<Product>;
        } catch (error: any) {
            console.error('[ApiService] getProducts error:', {
                url: error.config?.url,
                status: error.response?.status,
                data: error.response?.data
            });
            throw error;
        }
    },

    getProductBySlug: async (idOrSlug: string): Promise<Product> => {
        const response = await apiClient.get<Product>(`products/${idOrSlug}`);
        return response.data as unknown as Product;
    },

    // Categories
    getCategories: async (params: { page?: number; limit?: number; search?: string } = {}): Promise<Category[] | PaginatedResponse<Category>> => {
        const response = await apiClient.get<Category[] | PaginatedResponse<Category>>('categories', { params });
        return response.data as unknown as Category[] | PaginatedResponse<Category>;
    },

    // Cart
    getCart: async (): Promise<Cart> => {
        const response = await apiClient.get<Cart>('cart');
        return response.data as unknown as Cart;
    },

    addToCart: async (productId: string, quantity: number): Promise<Cart> => {
        const response = await apiClient.post<Cart>('cart/add', { productId, quantity });
        return response.data as unknown as Cart;
    },

    updateCartItem: async (productId: string, quantity: number): Promise<Cart> => {
        const response = await apiClient.patch<Cart>(`cart/update/${productId}`, { quantity });
        return response.data as unknown as Cart;
    },

    removeFromCart: async (productId: string): Promise<Cart> => {
        const response = await apiClient.delete<Cart>(`cart/remove/${productId}`);
        return response.data as unknown as Cart;
    },

    clearCart: async (): Promise<void> => {
        const response = await apiClient.delete<{ message: string }>('cart/clear');
        return response.data as unknown as void;
    },

    // Orders
    checkout: async (data: { phoneNumber: string; address: string; couponCode?: string }): Promise<Order> => {
        const response = await apiClient.post<any>('orders/checkout', data);
        return response.data;
    },

    previewCheckout: async (couponCode?: string): Promise<import('@/types/api').PreviewCheckoutResponse> => {
        const response = await apiClient.post<any>('orders/preview-checkout', { couponCode });
        return response.data;
    },

    getAllOrders: async (): Promise<{ status: string, orders: Order[], total: number }> => {
        const response = await apiClient.get<any>('orders/admin/all');
        return response.data;
    },

    getMyOrders: async (): Promise<Order[]> => {
        const response = await apiClient.get<any>('orders/my-orders');
        return response.data;
    },

    getOrderDetails: async (orderId: string): Promise<Order> => {
        const response = await apiClient.get<any>(`orders/${orderId}`);
        return response.data;
    },

    updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
        const response = await apiClient.patch<any>(`/orders/admin/${orderId}/status`, { status });
        return response.data;
    },

    getAdminOrder: async (orderId: string): Promise<Order> => {
        const response = await apiClient.get<any>(`/orders/admin/${orderId}`);
        return response.data;
    },

    // Admin - Products
    createProduct: async (data: any): Promise<Product> => {
        const response = await apiClient.post<Product>('products', data);
        return response.data as unknown as Product;
    },

    uploadProductImages: async (formData: FormData): Promise<string[]> => {
        const response = await apiClient.post<any>('products/upload-images', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    updateProduct: async (id: string, data: any): Promise<Product> => {
        const response = await apiClient.patch<Product>(`products/${id}`, data);
        return response.data as unknown as Product;
    },

    deleteProduct: async (id: string): Promise<void> => {
        const response = await apiClient.delete<void>(`products/${id}`);
        return response.data as unknown as void;
    },

    // Admin - Categories
    createCategory: async (data: any): Promise<Category> => {
        const response = await apiClient.post<Category>('categories', data);
        return response.data as unknown as Category;
    },

    updateCategory: async (id: string, data: any): Promise<Category> => {
        const response = await apiClient.put<Category>(`categories/${id}`, data);
        return response.data as unknown as Category;
    },

    deleteCategory: async (id: string): Promise<void> => {
        const response = await apiClient.delete<void>(`categories/${id}`);
        return response.data as unknown as void;
    },

    // Admin - Users
    getAllUsers: async (params: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedResponse<User>> => {
        const response = await apiClient.get<PaginatedResponse<User>>('users', { params });
        return response.data as unknown as PaginatedResponse<User>;
    },

    deleteUser: async (id: string): Promise<void> => {
        const response = await apiClient.delete<void>(`users/${id}`);
        return response.data as unknown as void;
    },

    // Admin - Discounts
    getDiscounts: async (): Promise<Discount[]> => {
        const response = await apiClient.get<Discount[]>('discounts');
        return response.data as unknown as Discount[];
    },

    createDiscount: async (data: any): Promise<Discount> => {
        const response = await apiClient.post<Discount>('discounts', data);
        return response.data as unknown as Discount;
    },

    updateDiscount: async (id: string, data: any): Promise<Discount> => {
        const response = await apiClient.patch<Discount>(`discounts/${id}`, data);
        return response.data as unknown as Discount;
    },
    deleteDiscount: async (id: string): Promise<void> => {
        const response = await apiClient.delete<void>(`discounts/${id}`);
        return response.data as unknown as void;
    },

    // Admin - Stats
    getAdminStats: async (): Promise<{ revenue: number, orders: number, users: number, products: number }> => {
        const response = await apiClient.get<{ revenue: number, orders: number, users: number, products: number }>('orders/admin/stats');
        return response.data as unknown as { revenue: number, orders: number, users: number, products: number };
    },

    // Admin - System Config
    getAllConfigs: async (): Promise<SystemConfig[]> => {
        const response = await apiClient.get<SystemConfig[]>('system-configs');
        return response.data as unknown as SystemConfig[];
    },

    updateConfig: async (key: string, value: string, description?: string): Promise<SystemConfig> => {
        const response = await apiClient.patch<SystemConfig>(`system-configs/${key}`, { value, description });
        return response.data as unknown as SystemConfig;
    },

    onUnauthorized: (callback: () => void) => {
        onUnauthorizedCallback = callback;
    },
};

// Add Interceptor for Authorization Header
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// Add Interceptor for Token Refresh and Data Unwrapping
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Skip for refresh calls
        if ((response.config as any)._skipInterceptor) {
            return response;
        }

        // Automatically unwrap the backend envelope { status, data }
        if (response.data && response.data.status === 'success' && response.data.data !== undefined) {
            return {
                ...response,
                data: response.data.data
            };
        }
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _skipInterceptor?: boolean };

        // Custom Error Message Extraction (NestJS Validation Error Format)
        let errorMessage = 'An unexpected error occurred';
        if (error.response?.data) {
            const { message, errors } = error.response.data as any;

            // 1. Check for Custom Zod Error Format from Backend: { errors: [{ message: '...' }] }
            if (errors && Array.isArray(errors) && errors.length > 0) {
                errorMessage = errors[0].message;
            }
            // 2. Check for traditional NestJS array: { message: ['...', '...'] }
            else if (Array.isArray(message)) {
                errorMessage = message[0];
            }
            // 3. Fallback to normal string message or stringified object
            else if (typeof message === 'string') {
                errorMessage = message;
            } else if (typeof message === 'object') {
                errorMessage = JSON.stringify(message);
            }
        }

        // Prevent infinite loops or deadlocks on the refresh endpoint itself
        if (originalRequest._skipInterceptor) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                if (!refreshPromise) {
                    // If on server, skip refresh for now as we don't have cookies easily
                    if (typeof window === 'undefined') {
                        return Promise.reject(error);
                    }

                    // refreshPromise is handled by apiService.refreshToken()
                    await apiService.refreshToken();
                } else {
                    await refreshPromise;
                }

                const newToken = apiService.getAccessToken();
                if (newToken && originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return apiClient(originalRequest);
                }
            } catch (err) {
                if (onUnauthorizedCallback) onUnauthorizedCallback();
                return Promise.reject(err);
            }
        }
        return Promise.reject(new Error(errorMessage));
    }
);

if (!process.env.NEXT_PUBLIC_API_URL && typeof window === 'undefined') {
    console.warn('[ApiService] NEXT_PUBLIC_API_URL is not defined on the server! Falling back to localhost.');
}

export default apiService;
