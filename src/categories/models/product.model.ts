import { ApiProperty } from '@nestjs/swagger'
import { Optional } from 'sequelize'
import { Column, DataType, ForeignKey, BelongsTo, Model, Table, HasMany } from 'sequelize-typescript'
import { Category } from './category.model'
import { ProductImage } from './product-image.model'
import { ProductItem } from './product-item.model'

export interface ProductAttributes {
    id: number
    name: string
    slug: string
    description: string
    detail: string
    price: number
    new_price: number
    discount: number
    category_id: number
    category: Category
    product_images: ProductImage[]
    product_items: ProductItem[]
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'new_price' | 'discount' | 'category_id' | 'category' | 'product_images' | 'product_items'> { }

@Table({ tableName: 'products', updatedAt: false, createdAt: false, indexes: [{ fields: ['slug'] }, { fields: ['category_id'] }] })
export class Product extends Model<ProductAttributes, ProductCreationAttributes> {
    @ApiProperty({ example: 1 })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number

    @ApiProperty({ example: 'Dress' })
    @Column({ type: DataType.STRING, allowNull: false })
    name: string

    @ApiProperty({ example: 'dress' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    slug: string

    @ApiProperty({ example: 'Description of the dress' })
    @Column({ type: DataType.TEXT, allowNull: false })
    description: string

    @ApiProperty({ example: 'Details of the dress' })
    @Column({ type: DataType.TEXT, allowNull: false })
    detail: string

    @ApiProperty({ example: 4000 })
    @Column({ type: DataType.INTEGER })
    price: number

    @ApiProperty({ example: 2000 })
    @Column({
        type: DataType.VIRTUAL, get() {
            const discount = this.getDataValue('discount')
            const price = this.getDataValue('price')
            if (discount > 0) {
                return Math.ceil(price - price * discount / 100)
            }
            return price
        }
    })
    new_price: number

    @ApiProperty({ example: 50 })
    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    discount: number

    @ForeignKey(() => Category)
    @Column({ type: DataType.INTEGER })
    category_id: number

    @BelongsTo(() => Category)
    category: Category

    @ApiProperty({ type: [ProductImage] })
    @HasMany(() => ProductImage)
    product_images: ProductImage[]

    @ApiProperty({ type: [ProductItem] })
    @HasMany(() => ProductItem)
    product_items: ProductItem[]
}