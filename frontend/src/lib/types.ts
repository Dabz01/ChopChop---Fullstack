export type UserRole = 'CUSTOMER' | 'RESTAURANT_OWNER' | 'RIDER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  isOpen: boolean;
  avgRating?: number;
  minOrderTotal: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
}

export interface RestaurantWithMenu extends Restaurant {
  menuItems: MenuItem[];
}

export interface Order {
  id: string;
  restaurantId: string;
  customerId: string;
  riderId?: string | null;
  status:
    | 'PENDING'
    | 'ACCEPTED'
    | 'PREPARING'
    | 'READY_FOR_PICKUP'
    | 'ASSIGNED_TO_RIDER'
    | 'PICKED_UP'
    | 'ON_THE_WAY'
    | 'DELIVERED'
    | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
