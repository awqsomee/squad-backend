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
    if (userDto.username == '') throw new HttpException(`Username is empty`, HttpStatus.BAD_REQUEST)
    const usernameLowerCase = userDto.username.toLowerCase()
    const candidate = await this.userService.getUserByUsername(usernameLowerCase)
    if (candidate)
      throw new HttpException(`User with username "${userDto.username}" already exists`, HttpStatus.BAD_REQUEST)
    const hashPassword = await bcrypt.hash(userDto.password, 5)
    const user = await this.userService.createUser({ ...userDto, username: usernameLowerCase, password: hashPassword })
    const { token } = this.generateToken(user)
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    }
  }

  async login(userDto: CreateUserDto) {
    const usernameLowerCase = userDto.username.toLowerCase()
    const user = await this.validateUser({ ...userDto, username: usernameLowerCase })
    const { token } = this.generateToken(user)
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        description: user.description,
      },
    }
  }

  async auth(currentUser: User) {
    const user = await this.userService.getUserById(currentUser.id)
    const { token } = this.generateToken(user)
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        description: user.description,
      },
    }
  }

  generateToken(user: User) {
    const payload = { id: user.id, username: user.username, roles: user.roles }
    return {
      token: this.jwtService.sign(payload),
    }
  }

  private async validateUser(userDto: CreateUserDto) {
    const usernameLowerCase = userDto.username.toLowerCase()
    const user = await this.userService.getUserByUsername(usernameLowerCase)
    if (!user) throw new UnauthorizedException({ message: `User not found` })

    const passwordEquals = await bcrypt.compare(userDto.password, user.password)
    if (!passwordEquals) throw new UnauthorizedException({ message: `Wrong password` })
    return user
  }
}
