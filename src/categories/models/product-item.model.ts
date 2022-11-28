import { ApiProperty } from '@nestjs/swagger'
import { Optional } from 'sequelize'
import { Column, DataType, ForeignKey, BelongsTo, Model, Table } from 'sequelize-typescript'
import { Product } from './product.model'

interface ProductItemAttributes {
    id: number
    size: string
    quantity: number
    product_id: number
    product: Product
}

const SIZES = ['48', '50', '52', '54', '56', '58', '60']

export interface ProductItemCreationAttributes extends Optional<ProductItemAttributes, 'id' | 'product_id' | 'product'> { }

@Table({ tableName: 'product_items', updatedAt: false, createdAt: false, indexes: [{ fields: ['product_id'] }] })
export class ProductItem extends Model<ProductItemAttributes, ProductItemCreationAttributes> {
    @ApiProperty({ example: 1 })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number

    @ApiProperty({ enum: SIZES })
    @Column({ type: DataType.ENUM(...SIZES) })
    size: string

    @ApiProperty({ example: 10 })
    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    quantity: number

    @ForeignKey(() => Product)
    @Column({ type: DataType.INTEGER })
    product_id: number

    @BelongsTo(() => Product)
    product: Product
}