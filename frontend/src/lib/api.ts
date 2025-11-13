import axios from 'axios';
import type {
  AuthResponse,
  Restaurant,
  RestaurantWithMenu,
  Order,
} from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1',
  withCredentials: false,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  } else {
    delete api.defaults.headers.common['Authorization'];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
};

export const loadAuthTokenFromStorage = () => {
  if (typeof window === 'undefined') return;
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export const authApi = {
  async login(phoneOrEmail: string, password: string) {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      phoneOrEmail,
      password,
    });
    setAuthToken(data.accessToken);
    return data;
  },
  async register(payload: {
    name: string;
    phone: string;
    email?: string;
    password: string;
  }) {
    const { data } = await api.post<AuthResponse>('/auth/register', {
      ...payload,
      role: 'CUSTOMER',
    });
    setAuthToken(data.accessToken);
    return data;
  },
  async me() {
    const { data } = await api.get<AuthResponse['user']>('/auth/me');
    return data;
  },
};

export const restaurantApi = {
  async list() {
    const { data } = await api.get<Restaurant[]>('/restaurants');
    return data;
  },
  async getWithMenu(id: string) {
    const { data } = await api.get<RestaurantWithMenu>(`/restaurants/${id}/menu`);
    return data;
  },
};

export const ordersApi = {
  async create(payload: {
    restaurantId: string;
    items: { menuItemId: string; quantity: number }[];
    deliveryAddress: string;
    paymentMethod: 'CASH_ON_DELIVERY';
  }) {
    const { data } = await api.post<Order>('/orders', payload);
    return data;
  },
  async myOrders() {
    const { data } = await api.get<Order[]>('/orders/my');
    return data;
  },
};

export default api;
