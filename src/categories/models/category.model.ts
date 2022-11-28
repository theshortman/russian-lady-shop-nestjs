import { ApiProperty } from '@nestjs/swagger'
import { Optional } from 'sequelize'
import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript'
import { Product } from './product.model'

interface CategoryAttributes {
    id: number
    name: string
    description: string
    slug: string
    sort: number,
    products: Product[]
}

export interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'sort' | 'products'> { }

@Table({ tableName: 'categories', updatedAt: false, createdAt: false, underscored: true, indexes: [{ fields: ['slug'] }] })
export class Category extends Model<CategoryAttributes, CategoryCreationAttributes>{
    @ApiProperty({ example: 1 })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number

    @ApiProperty({ example: 'Dresses' })
    @Column({ type: DataType.STRING, allowNull: false })
    name: string

    @ApiProperty({ example: 'Description of category' })
    @Column({ type: DataType.TEXT, allowNull: false })
    description: string

    @ApiProperty({ example: 'dresses' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    slug: string

    @ApiProperty({ example: 1 })
    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    sort: number

    @HasMany(() => Product)
    products: Product[]
}