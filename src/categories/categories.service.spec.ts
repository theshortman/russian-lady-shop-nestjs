import { Test } from '@nestjs/testing'
import { CategoriesService } from './categories.service'

describe('CategoriesService Unit Tests', () => {
    let service: CategoriesService
    const categoryRepositoryFindOne = jest.fn()
    const productRepositoryFindOne = jest.fn()
    const findAll = jest.fn()
    const findAndCountAll = jest.fn()

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CategoriesService,],
        })
            .useMocker((token) => {
                if (token === 'CategoryRepository') {
                    return {
                        findAll,
                        findOne: categoryRepositoryFindOne,
                    }
                }
                if (token === 'ProductRepository') {
                    return {
                        findOne: productRepositoryFindOne,
                        findAndCountAll
                    }
                }
            })
            .compile()

        service = moduleRef.get(CategoriesService)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('calling getCategoryList', async () => {
        findAll.mockReturnValue([{ id: 1 }])
        expect(await service.getCategoryList()).toEqual([{ id: 1 }])
    })

    describe('calling getProducts', () => {
        it('should return category with products', async () => {
            categoryRepositoryFindOne.mockReturnValue({ id: 1 })
            findAndCountAll.mockReturnValue({ count: 1, rows: [{ id: 1 }] })
            const { id, products, next_page_number, prev_page_number } = await service.getProducts('test-category', 1)

            expect(id).toEqual(1)
            expect(products[0]).toEqual({ id: 1 })
            expect(prev_page_number).toEqual(null)
            expect(next_page_number).toEqual(null)
        })

        it('next_page_number should be 2, prev_page_number should be null, if there is 2 pages and page number is 1', async () => {
            categoryRepositoryFindOne.mockReturnValue({ id: 1 })
            findAndCountAll.mockReturnValue({ count: 22, rows: [] })
            const { next_page_number, prev_page_number } = await service.getProducts('test-category', 1)

            expect(prev_page_number).toEqual(null)
            expect(next_page_number).toEqual(2)
        })

        it('next_page_number should be null, prev_page_number should be 1, if there is 2 pages and page number is 2', async () => {
            categoryRepositoryFindOne.mockReturnValue({ id: 1 })
            findAndCountAll.mockReturnValue({ count: 22, rows: [] })
            const { next_page_number, prev_page_number } = await service.getProducts('test-category', 2)

            expect(prev_page_number).toEqual(1)
            expect(next_page_number).toEqual(null)
        })

        it('next_page_number should be 3, prev_page_number should be 1, if there is 3 pages and page number is 2', async () => {
            categoryRepositoryFindOne.mockReturnValue({ id: 1 })
            findAndCountAll.mockReturnValue({ count: 54, rows: [] })
            const { next_page_number, prev_page_number } = await service.getProducts('test-category', 2)

            expect(prev_page_number).toEqual(1)
            expect(next_page_number).toEqual(3)
        })

        it('should throw error when category does not exist', async () => {
            categoryRepositoryFindOne.mockReturnValue(null)
            await expect(service.getProducts('test-category', 1)).rejects.toThrow(/Category not found/)
        })

        it('should throw error when page number greater then count of available pages', async () => {
            categoryRepositoryFindOne.mockReturnValue({ id: 1 })
            findAndCountAll.mockReturnValue({ count: 1, rows: [{ id: 1 }] })
            await expect(service.getProducts('test-category', 2)).rejects.toThrow(/Page 2 does not exist/)
        })
    })

    describe('calling getOneProduct', () => {
        it('should return product when product exists', async () => {
            categoryRepositoryFindOne.mockReturnValue({ id: 1 })
            productRepositoryFindOne.mockReturnValue({ id: 1 })
            expect(await service.getOneProduct('test-category', 'test-product')).toEqual({ id: 1 })
        })

        it('should throw error when category does not exist', async () => {
            categoryRepositoryFindOne.mockReturnValue(null)
            await expect(service.getOneProduct('test-category', 'test-product')).rejects.toThrow(/Category not found/)
        })

        it('should throw error when category exists and product does not exist', async () => {
            categoryRepositoryFindOne.mockReturnValue({ id: 1 })
            productRepositoryFindOne.mockReturnValue(null)
            await expect(service.getOneProduct('test-category', 'test-product')).rejects.toThrow(/Product not found/)
        })
    })
})
