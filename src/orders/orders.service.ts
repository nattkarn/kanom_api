import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './schemas/order.schema'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productsService: ProductsService) { }



  async create(createOrderDto: CreateOrderDto): Promise<Order> {

    const productResult = await this.productsService.findOne(createOrderDto.productId)

    if (!productResult) {
      throw new NotFoundException('product not found')
    }
    
    const result = new this.orderModel(createOrderDto)
    return result.save();
  }

  async findOne(id: string) : Promise < Order > {
  const orders = this.orderModel.findById(id).populate('productId').exec();
  return orders;
}

}
