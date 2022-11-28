import { ApiProperty } from '@nestjs/swagger'
import { Optional } from 'sequelize'
import { Column, DataType, ForeignKey, BelongsTo, Model, Table } from 'sequelize-typescript'
import { Product } from './product.model'

interface ProductImageAttributes {
    id: number
    image_large: string
    image_medium: string
    image_small: string
    sort: number
    product_id: number
    product: Product
}

export interface ProductImageCreationAttributes extends Optional<ProductImageAttributes, 'id' | 'sort' | 'product_id' | 'product'> { }

@Table({ tableName: 'product_images', updatedAt: false, createdAt: false, indexes: [{ fields: ['product_id'] }] })
export class ProductImage extends Model<ProductImageAttributes, ProductImageCreationAttributes> {
    @ApiProperty({ example: 1 })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number

    @ApiProperty({ example: 'https://example.com/image-large.jpg' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false, get() { return process.env.MEDIA_SOURCE || '' + this.getDataValue('image_large') } })
    image_large: string

    @ApiProperty({ example: 'https://example.com/image-medium.jpg' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false, get() { return process.env.MEDIA_SOURCE || '' + this.getDataValue('image_medium') } })
    image_medium: string

    @ApiProperty({ required: false, example: 'https://example.com/image-small.jpg' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false, get() { return process.env.MEDIA_SOURCE || '' + this.getDataValue('image_small') } })
    image_small: string

    @ApiProperty({ example: 1 })
    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    sort: number

    @ForeignKey(() => Product)
    @Column({ type: DataType.INTEGER })
    product_id: number

    @BelongsTo(() => Product)
    product: Product
}