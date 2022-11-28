import { Test } from '@nestjs/testing'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController
  let spyService: CategoriesService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CategoriesController],
    })
      .useMocker((token) => {
        if (token === CategoriesService) {
          return {
            getCategoryList: jest.fn(),
            getProducts: jest.fn(),
            getOneProduct: jest.fn()
          }
        }
      })
      .compile()

    controller = moduleRef.get(CategoriesController)
    spyService = moduleRef.get<CategoriesService>(CategoriesService)
  })

  it('calling getCategoryList should call getCategoryList service method', async () => {
    controller.getCategoryList()
    expect(spyService.getCategoryList).toHaveBeenCalled()
  })

  it('calling getProducts should call getProducts service method', async () => {
    const category = 'test-category'
    const page = 10
    controller.getProducts(category, page)

    expect(spyService.getProducts).toHaveBeenCalledWith(category, page)
  })

  it('calling getOneProduct should call getOneProduct service method', async () => {
    const category = 'test-category'
    const product = 'test-product'
    controller.getOneProduct(category, product)
    expect(spyService.getOneProduct).toHaveBeenCalledWith(category, product)
  })
})
