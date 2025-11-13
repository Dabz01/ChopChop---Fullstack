export class RegisterDto {
  name: string;
  phone: string;
  email?: string;
  password: string;
  role?: 'CUSTOMER' | 'RESTAURANT_OWNER' | 'RIDER' | 'ADMIN';
}
