import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import * as bcrypt from 'bcryptjs'
import { User } from 'src/users/user.model'

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email)
    if (candidate) {
      throw new HttpException(`User with email ${userDto.email} already exists`, HttpStatus.BAD_REQUEST)
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5)
    const user = await this.userService.createUser({ ...userDto, password: hashPassword })
    return this.generateToken(user)
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto)
    return this.generateToken(user)
  }

  async generateToken(user: User) {
    const payload = { id: user.id, roles: user.roles }
    // const payload = { id: user.id, email: user.email, roles: user.roles }
    return {
      token: this.jwtService.sign(payload),
    }
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email)
    if (!user) throw new UnauthorizedException({ message: `User not found` })

    const passwordEquals = await bcrypt.compare(userDto.password, user.password)
    if (!passwordEquals) throw new UnauthorizedException({ message: `Wrong password` })
    return user
  }
}
