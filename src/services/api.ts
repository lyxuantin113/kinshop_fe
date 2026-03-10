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
        const response = await apiClient.post<AuthResponse>('users/register', data);
        return response.data;
    },

    login: async (data: any) => {
        const response = await apiClient.post<AuthResponse>('users/login', data);
        accessToken = response.data.data.accessToken;
        return response.data;
    },

    logout: async () => {
        await apiClient.post('users/logout');
        accessToken = null;
    },

    refreshToken: async () => {
        return apiClient.post<RefreshResponse>('users/refresh');
    },

    // Products
    getProducts: async (filters: ProductFilters = {}) => {
        try {
            const response = await apiClient.get<PaginatedResponse<Product>>('products', {
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
        const response = await apiClient.get<{ data: Product }>(`products/${idOrSlug}`);
        return response.data.data;
    },

    // Categories
    getCategories: async () => {
        const response = await apiClient.get<PaginatedResponse<Category>>('categories');
        return response.data;
    },

    // Cart
    getCart: async () => {
        const response = await apiClient.get<Cart>('cart');
        return response.data;
    },

    addToCart: async (productId: string, quantity: number) => {
        const response = await apiClient.post('cart/add', { productId, quantity });
        return response.data;
    },

    updateCartItem: async (productId: string, quantity: number) => {
        const response = await apiClient.patch(`cart/update/${productId}`, { quantity });
        return response.data;
    },

    removeFromCart: async (productId: string) => {
        const response = await apiClient.delete(`cart/remove/${productId}`);
        return response.data;
    },

    clearCart: async () => {
        const response = await apiClient.delete('cart/clear');
        return response.data;
    },

    // Orders
    checkout: async (couponCode?: string) => {
        const response = await apiClient.post('orders/checkout', { couponCode });
        return response.data;
    },

    getMyOrders: async () => {
        const response = await apiClient.get<Order[]>('orders/my-orders');
        return response.data;
    },

    getOrderDetails: async (orderId: string) => {
        const response = await apiClient.get<Order>(`orders/${orderId}`);
        return response.data;
    },

    updateOrderStatus: async (orderId: string, status: string) => {
        const response = await apiClient.patch(`orders/${orderId}/status`, { status });
        return response.data;
    },

    // Admin - Products
    createProduct: async (data: any) => {
        const response = await apiClient.post('products', data);
        return response.data;
    },

    updateProduct: async (id: string, data: any) => {
        const response = await apiClient.patch(`products/${id}`, data);
        return response.data;
    },

    deleteProduct: async (id: string) => {
        const response = await apiClient.delete(`products/${id}`);
        return response.data;
    },

    // Admin - Categories
    createCategory: async (data: any) => {
        const response = await apiClient.post('categories', data);
        return response.data;
    },

    updateCategory: async (id: string, data: any) => {
        const response = await apiClient.patch(`categories/${id}`, data);
        return response.data;
    },

    deleteCategory: async (id: string) => {
        const response = await apiClient.delete(`categories/${id}`);
        return response.data;
    },

    // Admin - Discounts
    getDiscounts: async () => {
        const response = await apiClient.get('discounts');
        return response.data;
    },

    // Admin - Stats
    getAdminStats: async () => {
        const response = await apiClient.get('orders/stats');
        return response.data;
    },

    // Admin - System Config
    getAllConfigs: async () => {
        const response = await apiClient.get<SystemConfigResponse>('system-configs');
        return response.data;
    },

    updateConfig: async (key: string, value: string, description?: string) => {
        const response = await apiClient.patch(`system-configs/${key}`, { value, description });
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

// Add Interceptor for Token Refresh
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!refreshPromise) {
                refreshPromise = apiService.refreshToken()
                    .then((res) => {
                        accessToken = res.data.data.accessToken;
                        refreshPromise = null;
                        return accessToken;
                    })
                    .catch((err) => {
                        accessToken = null;
                        refreshPromise = null;
                        if (onUnauthorizedCallback) onUnauthorizedCallback();
                        return null;
                    });
            }

            const newToken = await refreshPromise;
            if (newToken && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

if (!process.env.NEXT_PUBLIC_API_URL && typeof window === 'undefined') {
    console.warn('[ApiService] NEXT_PUBLIC_API_URL is not defined on the server! Falling back to localhost.');
}

export default apiService;
