import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { FileService } from './file.service'

@Module({
  providers: [FileService],
})
export class FileModule {}
