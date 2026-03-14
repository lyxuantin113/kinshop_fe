import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Product, Category, PaginatedResponse, ProductFilters, Cart, Order, AuthResponse, RefreshResponse, User, SystemConfig, SystemConfigResponse } from '@/types/api';

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
    register: async (data: any) => {
        const response = await apiClient.post<any>('users/register', data);
        return response.data;
    },

    login: async (data: any) => {
        const response = await apiClient.post<any>('users/login', data);
        accessToken = response.data.accessToken;
        return response.data;
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
    getProducts: async (filters: ProductFilters = {}) => {
        try {
            const response = await apiClient.get<any>('products', {
                params: filters,
            });
            return response.data;
        } catch (error: any) {
            console.error('[ApiService] getProducts error:', {
                url: error.config?.url,
                status: error.response?.status,
                data: error.response?.data
            });
            throw error;
        }
    },

    getProductBySlug: async (idOrSlug: string) => {
        const response = await apiClient.get<any>(`products/${idOrSlug}`);
        return response.data;
    },

    // Categories
    getCategories: async (params: { page?: number; limit?: number; search?: string } = {}) => {
        const response = await apiClient.get<any>('categories', { params });
        return response.data;
    },

    // Cart
    getCart: async () => {
        const response = await apiClient.get<any>('cart');
        return response.data;
    },

    addToCart: async (productId: string, quantity: number) => {
        const response = await apiClient.post<any>('cart/add', { productId, quantity });
        return response.data;
    },

    updateCartItem: async (productId: string, quantity: number) => {
        const response = await apiClient.patch<any>(`cart/update/${productId}`, { quantity });
        return response.data;
    },

    removeFromCart: async (productId: string) => {
        const response = await apiClient.delete<any>(`cart/remove/${productId}`);
        return response.data;
    },

    clearCart: async () => {
        const response = await apiClient.delete<any>('cart/clear');
        return response.data;
    },

    // Orders
    checkout: async (data: { phoneNumber: string; address: string; couponCode?: string }) => {
        const response = await apiClient.post<any>('orders/checkout', data);
        return response.data;
    },

    getAllOrders: async () => {
        const response = await apiClient.get<any>('orders/admin/all');
        return response.data;
    },

    getMyOrders: async () => {
        const response = await apiClient.get<any>('orders/my-orders');
        return response.data;
    },

    getOrderDetails: async (orderId: string) => {
        const response = await apiClient.get<any>(`orders/${orderId}`);
        return response.data;
    },

    async updateOrderStatus(orderId: string, status: string): Promise<Order> {
        const response = await apiClient.patch(`/orders/admin/${orderId}/status`, { status });
        return response.data;
    },

    async getAdminOrder(orderId: string): Promise<Order> {
        const response = await apiClient.get(`/orders/admin/${orderId}`);
        return response.data;
    },

    // Admin - Products
    createProduct: async (data: any) => {
        const response = await apiClient.post<any>('products', data);
        return response.data;
    },

    uploadProductImages: async (formData: FormData) => {
        const response = await apiClient.post<any>('products/upload-images', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    updateProduct: async (id: string, data: any) => {
        const response = await apiClient.patch<any>(`products/${id}`, data);
        return response.data;
    },

    deleteProduct: async (id: string) => {
        const response = await apiClient.delete<any>(`products/${id}`);
        return response.data;
    },

    // Admin - Categories
    createCategory: async (data: any) => {
        const response = await apiClient.post<any>('categories', data);
        return response.data;
    },

    updateCategory: async (id: string, data: any) => {
        const response = await apiClient.put<any>(`categories/${id}`, data);
        return response.data;
    },

    deleteCategory: async (id: string) => {
        const response = await apiClient.delete<any>(`categories/${id}`);
        return response.data;
    },

    // Admin - Users
    getAllUsers: async (params: { page?: number; limit?: number; search?: string } = {}) => {
        const response = await apiClient.get<any>('users', { params });
        return response.data;
    },

    deleteUser: async (id: string) => {
        const response = await apiClient.delete<any>(`users/${id}`);
        return response.data;
    },

    // Admin - Discounts
    getDiscounts: async () => {
        const response = await apiClient.get<any>('discounts');
        return response.data;
    },

    createDiscount: async (data: any) => {
        const response = await apiClient.post<any>('discounts', data);
        return response.data;
    },

    updateDiscount: async (id: string, data: any) => {
        const response = await apiClient.patch<any>(`discounts/${id}`, data);
        return response.data;
    },
    deleteDiscount: async (id: string) => {
        const response = await apiClient.delete<any>(`discounts/${id}`);
        return response.data;
    },

    // Admin - Stats
    getAdminStats: async () => {
        const response = await apiClient.get<any>('orders/admin/stats');
        return response.data;
    },

    // Admin - System Config
    getAllConfigs: async () => {
        const response = await apiClient.get<any>('system-configs');
        return response.data;
    },

    updateConfig: async (key: string, value: string, description?: string) => {
        const response = await apiClient.patch<any>(`system-configs/${key}`, { value, description });
        return response.data;
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
        return Promise.reject(error);
    }
);

if (!process.env.NEXT_PUBLIC_API_URL && typeof window === 'undefined') {
    console.warn('[ApiService] NEXT_PUBLIC_API_URL is not defined on the server! Falling back to localhost.');
}

export default apiService;
