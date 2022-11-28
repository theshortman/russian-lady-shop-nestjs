import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { CategoriesModule } from './categories/categories.module'
import { Product } from './categories/models/product.model'
import { ProductItem } from './categories/models/product-item.model'
import { ProductImage } from './categories/models/product-image.model'
import { Category } from './categories/models/category.model'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Category, Product, ProductItem, ProductImage],
      autoLoadModels: Boolean(process.env.SEQUELIZE_AUTO_LOAD_MODELS),
    }),
    CategoriesModule,
  ],
})
export class AppModule { }
