import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { Category } from './models/category.model'
import { Product } from './models/product.model'
import { ProductItem } from './models/product-item.model'
import { ProductImage } from './models/product-image.model'
import { CategoryDetailDto } from './dto/category-detail.dto'

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category) private categoryRepository: typeof Category,
        @InjectModel(Product) private productRepository: typeof Product) { }

    async getCategoryList(): Promise<Category[]> {
        const categories = await this.categoryRepository.findAll()
        return categories
    }

    async getProducts(category: string, page: number): Promise<CategoryDetailDto> {
        const cat = await this.categoryRepository.findOne({
            attributes: { exclude: ['sort'] },
            where: { slug: category }
        })

        if (!cat) {
            throw new NotFoundException('Category not found')
        }

        const pageSize = Number(process.env.DEFAULT_PAGE_SIZE) || 18
        const { count, rows: products } = await this.productRepository.findAndCountAll({
            where: { category_id: cat.id },
            attributes: { exclude: ['category_id'] },
            distinct: true,
            include: [{ model: ProductItem, attributes: { exclude: ['product_id'] }, where: { quantity: { [Op.gt]: 0 } } },
            { model: ProductImage, attributes: { exclude: ['product_id'] } }],
            order: [['id', 'DESC']], offset: this.evaluateOffset(page, pageSize), limit: pageSize
        })

        if (page > this.evaluateMaxPage(count, pageSize)) {
            throw new NotFoundException(`Page ${page} does not exist`)
        }

        return {
            id: cat.id,
            name: cat.name,
            description: cat.description,
            slug: cat.slug,
            products,
            prev_page_number: this.getPrevPageNumber(page),
            next_page_number: this.getNextPageNumber(page, this.evaluateMaxPage(count, pageSize))
        }
    }

    async getOneProduct(category: string, product: string): Promise<Product> {
        const cat = await this.categoryRepository.findOne({
            where: { slug: category }
        })

        if (!cat) {
            throw new NotFoundException('Category not found')
        }

        const prod = await this.productRepository.findOne({
            where: { slug: product }, attributes: { exclude: ['category_id'] },
            include: [{ model: ProductItem, attributes: { exclude: ['product_id'] }, where: { quantity: { [Op.gt]: 0 } } },
            { model: ProductImage, attributes: { exclude: ['product_id'] } }],
        })

        if (!prod) {
            throw new NotFoundException('Product not found')
        }
        return prod
    }

    private evaluateMaxPage(count: number, pageSize: number): number {
        if (count > pageSize) {
            return Math.ceil(count / pageSize)
        }
        return 1
    }

    private evaluateOffset(page: number, page_size: number): number {
        return Math.floor((page - 1) * page_size)
    }

    private getPrevPageNumber(page: number): number | null {
        return (page - 1) > 0 ? page - 1 : null
    }

    private getNextPageNumber(page: number, maxPage: number): number | null {
        if (page + 1 > maxPage) {
            return null
        }
        return page + 1
    }
}
