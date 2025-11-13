import { Controller, Get, Param } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';

@Controller('api/v1')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get('restaurants')
  listPublic() {
    return this.restaurantsService.listPublic();
  }

  @Get('restaurants/:id/menu')
  getWithMenu(@Param('id') id: string) {
    return this.restaurantsService.getWithMenu(id);
  }
}
