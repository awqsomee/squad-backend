import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { AuthService } from './auth.service'

@ApiTags('Authorization')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto)
  }

  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto)
  }
}
