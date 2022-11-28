import { ApiProperty } from '@nestjs/swagger'
import { Product } from '../models/product.model'

export class CategoryDetailDto {
    @ApiProperty({ example: 1 })
    readonly id: number

    @ApiProperty({ example: 'Dresses' })
    readonly name: string

    @ApiProperty({ example: 'Description of category' })
    readonly description: string

    @ApiProperty({ example: 'dresses' })
    readonly slug: string

    @ApiProperty({ type: [Product] })
    readonly products: Product[]

    @ApiProperty({ example: 1 })
    readonly prev_page_number: number | null

    @ApiProperty({ example: 1 })
    readonly next_page_number: number | null
}
