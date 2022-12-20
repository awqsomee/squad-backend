import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

const start = async () => {
  try {
    const PORT = process.env.PORT || 5000
    const app = await NestFactory.create(AppModule)

    const config = new DocumentBuilder()
      .setTitle('Play2GetHer')
      .setDescription('REST API documentation')
      .setVersion('1.0.0')
      .addTag('awqsomee')
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('/api/docs', app, document)

    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()
