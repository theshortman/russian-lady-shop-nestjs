import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { Category } from './models/category.model'
import { Product } from './models/product.model'

@Module({
  imports: [
    SequelizeModule.forFeature([Category, Product])
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService]
})
export class CategoriesModule { }
