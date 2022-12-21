import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import * as path from 'path'
import * as fs from 'fs'
import * as uuid from 'uuid'

@Injectable()
export class FileService {
  createFile(file): string {
    try {
      const fileExtension = file.originalname.split('.').pop()
      const fileName = uuid.v4() + '.' + fileExtension
      const filePath = path.resolve(__dirname, '..', 'data')
      if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true })
      console.log('1', filePath)
      console.log('2', fileName)
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer)
      return fileName
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  removeFile(fileName) {
    try {
      const avatarPath = path.resolve(__dirname, '..', 'data')
      fs.unlinkSync(path.join(avatarPath, fileName))
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }
}
