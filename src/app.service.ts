import { Injectable, Get } from '@nestjs/common'

@Injectable()
export class AppService {
  getUsers() {
    return [{ id: 1, name: 'Awh' }]
  }
}
