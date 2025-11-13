import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId: string) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('No items');
    }

    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: dto.restaurantId },
    });
    if (!restaurant) {
      throw new BadRequestException('Restaurant not found');
    }

    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: dto.items.map((i) => i.menuItemId) } },
    });

    if (menuItems.length !== dto.items.length) {
      throw new BadRequestException('Invalid menu items');
    }

    let subtotal = 0;
    const orderItemsData = dto.items.map((i) => {
      const mi = menuItems.find((m) => m.id === i.menuItemId)!;
      subtotal += mi.price * i.quantity;
      return {
        menuItemId: mi.id,
        quantity: i.quantity,
        unitPrice: mi.price,
      };
    });

    const deliveryFee = 5000;
    const total = subtotal + deliveryFee;

    const order = await this.prisma.order.create({
      data: {
        customerId: userId,
        restaurantId: dto.restaurantId,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        subtotal,
        deliveryFee,
        total,
        deliveryAddress: dto.deliveryAddress,
        orderItems: {
          create: orderItemsData,
        },
      },
    });

    return order;
  }

  myOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { customerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
