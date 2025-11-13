import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  listPublic() {
    return this.prisma.restaurant.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getWithMenu(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        menus: {
          include: { items: true },
        },
      },
    });
    if (!restaurant) return null;

    const menuItems = restaurant.menus.flatMap((m) => m.items);
    const { menus, ...rest } = restaurant as any;
    return { ...rest, menuItems };
  }
}
