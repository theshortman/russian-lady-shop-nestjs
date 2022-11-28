import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException } from '@nestjs/common'

@Injectable()
export class PageNumberValidationPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = Number(value)
    if (isNaN(val) || Math.floor(val) !== val) {
      throw new NotFoundException('Invalid page number')
    }
    if (val < 1) {
      throw new NotFoundException('Page number must be greater than 0')
    }
    return val
  }
}
