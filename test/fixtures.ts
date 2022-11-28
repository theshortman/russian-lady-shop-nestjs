import { CategoryCreationAttributes } from '../src/categories/models/category.model'
import { ProductCreationAttributes } from '../src/categories/models/product.model'
import { ProductItemCreationAttributes } from '../src/categories/models/product-item.model'
import { ProductImageCreationAttributes } from '../src/categories/models/product-image.model'


const category: CategoryCreationAttributes = {
    id: 1,
    name: 'Test category name',
    description: 'Test category description',
    slug: 'test-category-slug'
}


const product: ProductCreationAttributes = {
    id: 1,
    name: 'Test product name',
    slug: 'test-product-slug',
    description: 'Test product description',
    detail: 'Test product detail',
    price: 2000,
    category_id: 1
}

const productItem: ProductItemCreationAttributes = {
    id: 1,
    size: '50',
    quantity: 1,
    product_id: 1
}

const productImage: ProductImageCreationAttributes = {
    id: 1,
    image_large: 'https://example.com/image-large.jpg',
    image_medium: 'https://example.com/image-medium.jpg',
    image_small: 'https://example.com/image-small.jpg',
    product_id: 1
}

export const fixtures = {
    category,
    product,
    productItem,
    productImage
}