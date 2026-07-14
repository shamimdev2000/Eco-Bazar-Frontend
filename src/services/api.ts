import axios from "axios";
import { Product, Category, CartItem, Order, BlogPost, User, Address } from "../types";

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios Request Interceptor to dynamically attach the mock token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("org_grocery_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API METHODS
export const authApi = {
  login: async (credentials: any) => {
    const res = await api.post<{ token: string; user: User }>("/auth/login", credentials);
    return res.data;
  },
  register: async (userData: any) => {
    const res = await api.post<{ token: string; user: User }>("/auth/register", userData);
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get<User>("/auth/profile");
    return res.data;
  },
  updateProfile: async (data: Partial<User>) => {
    const res = await api.put<User>("/auth/profile", data);
    return res.data;
  },
  addAddress: async (addrData: Omit<Address, "id" | "isDefault">) => {
    const res = await api.post<Address[]>("/auth/addresses", addrData);
    return res.data;
  },
  deleteAddress: async (id: string) => {
    const res = await api.delete<Address[]>(`/auth/addresses/${id}`);
    return res.data;
  }
};

export const categoriesApi = {
  getAll: async () => {
    const res = await api.get<Category[]>("/categories");
    return res.data;
  }
};

export const productsApi = {
  getAll: async (params?: {
    search?: string;
    category?: string;
    sort?: string;
    rating?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isPopular?: boolean;
    isHotDeal?: boolean;
  }) => {
    const res = await api.get<Product[]>("/products", { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<{ product: Product; related: Product[] }>(`/products/${id}`);
    return res.data;
  },
  addReview: async (id: string, reviewData: { user: string; rating: number; comment: string }) => {
    const res = await api.post<Product>(`/products/${id}/reviews`, reviewData);
    return res.data;
  }
};

export const cartApi = {
  get: async () => {
    const res = await api.get<CartItem[]>("/cart");
    return res.data;
  },
  add: async (productId: string, quantity: number = 1) => {
    const res = await api.post<CartItem[]>("/cart", { productId, quantity });
    return res.data;
  },
  update: async (cartItemId: string, quantity: number) => {
    const res = await api.put<CartItem[]>(`/cart/${cartItemId}`, { quantity });
    return res.data;
  },
  remove: async (cartItemId: string) => {
    const res = await api.delete<CartItem[]>(`/cart/${cartItemId}`);
    return res.data;
  },
  clear: async () => {
    const res = await api.delete<CartItem[]>("/cart");
    return res.data;
  }
};

export const wishlistApi = {
  get: async () => {
    const res = await api.get<Product[]>("/wishlist");
    return res.data;
  },
  toggle: async (productId: string) => {
    const res = await api.post<{ added: boolean; wishlist: Product[] }>("/wishlist/toggle", { productId });
    return res.data;
  }
};

export const ordersApi = {
  getAll: async () => {
    const res = await api.get<Order[]>("/orders");
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<Order>(`/orders/${id}`);
    return res.data;
  },
  create: async (orderData: Omit<Order, "id" | "date" | "status">) => {
    const res = await api.post<Order>("/orders", orderData);
    return res.data;
  }
};

export const blogsApi = {
  getAll: async () => {
    const res = await api.get<BlogPost[]>("/blogs");
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<BlogPost>(`/blogs/${id}`);
    return res.data;
  }
};

export const contactApi = {
  submit: async (contactData: { name: string; email: string; subject?: string; message: string }) => {
    const res = await api.post<{ message: string }>("/contact", contactData);
    return res.data;
  }
};

export default api;
