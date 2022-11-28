import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { Category } from '../src/categories/models/category.model'
import { Product } from '../src/categories/models/product.model'
import { ProductItem } from '../src/categories/models/product-item.model'
import { ProductImage } from '../src/categories/models/product-image.model'
import { fixtures } from './fixtures'


describe('Categories module E2E Tests', () => {
  let app: INestApplication
  let sequelize: Sequelize

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Category, Product, ProductItem, ProductImage],
    })

    await sequelize.sync({ force: true })

    await Category.create(fixtures.category)
    await Product.create(fixtures.product)
    await ProductItem.create(fixtures.productItem)
    await ProductImage.create(fixtures.productImage)

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  describe('GET /categories', () => {
    it('should return category list', async () => {
      return request(app.getHttpServer())
        .get('/categories')
        .expect(200)
        .expect([{
          id: 1,
          name: 'Test category name',
          description: 'Test category description',
          slug: 'test-category-slug',
          sort: 0
        }])
    })
  })

  const product = {
    id: 1,
    name: 'Test product name',
    slug: 'test-product-slug',
    description: 'Test product description',
    detail: 'Test product detail',
    price: 2000,
    discount: 0,
    new_price: 2000,
    product_items: [
      {
        id: 1,
        size: '50',
        quantity: 1,
      }
    ],
    product_images: [{
      id: 1,
      image_large: 'https://example.com/image-large.jpg',
      image_medium: 'https://example.com/image-medium.jpg',
      image_small: 'https://example.com/image-small.jpg',
      sort: 0
    }]
  }

  describe('GET /categories/{category}/products', () => {
    it('should return category with product', async () => {
      const response = await request(app.getHttpServer())
        .get(`/categories/${fixtures.category.slug}/products`)
        .expect(200)

      expect(response.body).toEqual({
        id: 1,
        name: 'Test category name',
        description: 'Test category description',
        slug: 'test-category-slug',
        products: [product],
        next_page_number: null,
        prev_page_number: null
      })
    })

    describe('GET /categories/{category}/products?page=1', () => {
      it('should return first page', async () => {
        return request(app.getHttpServer())
          .get(`/categories/${fixtures.category.slug}/products?page=1`)
          .expect(200)
          .expect({
            id: 1,
            name: 'Test category name',
            description: 'Test category description',
            slug: 'test-category-slug',
            products: [product],
            next_page_number: null,
            prev_page_number: null
          })
      })
    })

    describe('GET /categories/{category}/products?page=0', () => {
      it('should return error when page number is 0', async () => {
        const response = await request(app.getHttpServer())
          .get(`/categories/${fixtures.category.slug}/products?page=0`)
          .expect(404)

        expect(response.body.message).toEqual('Page number must be greater than 0')
      })
    })

    describe('GET /categories/{category}/products?page=-1', () => {
      it('should return error when page number is -1', async () => {
        const response = await request(app.getHttpServer())
          .get(`/categories/${fixtures.category.slug}/products?page=-1`)
          .expect(404)

        expect(response.body.message).toEqual('Page number must be greater than 0')
      })
    })

    describe('GET /categories/{category}/products?page=first', () => {
      it('should return error when page number is string', async () => {
        const response = await request(app.getHttpServer())
          .get(`/categories/${fixtures.category.slug}/products?page=first`)
          .expect(404)

        expect(response.body.message).toEqual('Invalid page number')
      })
    })

    describe('GET /categories/{category}/products?page=1.5', () => {
      it('should return error when page number is float', async () => {
        const response = await request(app.getHttpServer())
          .get(`/categories/${fixtures.category.slug}/products?page=1.5`)
          .expect(404)

        expect(response.body.message).toEqual('Invalid page number')
      })
    })
  })

  describe('GET /categories/{category}/products/{product}', () => {
    it('should return product', async () => {
      return request(app.getHttpServer())
        .get(`/categories/${fixtures.category.slug}/products/${fixtures.product.slug}`)
        .expect(200)
        .expect(product)
    })
  })

  afterAll(() => {
    sequelize.close()
    app.close()
  })
})
