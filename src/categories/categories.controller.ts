import { Controller, DefaultValuePipe, Get, Param, Query } from '@nestjs/common'
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { PageNumberValidationPipe } from '../pipes/page-number.validation.pipe'
import { CategoryDetailDto } from './dto/category-detail.dto'
import { Category } from './models/category.model'
import { Product } from './models/product.model'
import { CategoriesService } from './categories.service'

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) { }

    @ApiOkResponse({ type: [Category] })
    @Get()
    getCategoryList() {
        return this.categoriesService.getCategoryList()
    }

    @ApiOkResponse({ type: CategoryDetailDto })
    @ApiNotFoundResponse()
    @Get('/:category/products')
    getProducts(@Param('category') category: string,
        @Query("page", new DefaultValuePipe(1), PageNumberValidationPipe) page: number) {
        return this.categoriesService.getProducts(category, page)
    }

    @ApiOkResponse({ type: Product })
    @ApiNotFoundResponse()
    @Get('/:category/products/:product')
    getOneProduct(@Param('category') category: string, @Param('product') product: string) {
        return this.categoriesService.getOneProduct(category, product)
    }
}
