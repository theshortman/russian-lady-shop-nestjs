import { NestFactory } from '@nestjs/core'
import { VersioningType } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  })
  app.enableCors({ origin: process.env.CORS_ALLOW_ORIGIN })

  const config = new DocumentBuilder()
    .setTitle('русская-леди.рф')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))
}
bootstrap()
