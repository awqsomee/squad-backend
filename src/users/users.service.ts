import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { RolesService } from 'src/roles/roles.service'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './user.model'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User, private roleService: RolesService) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto)
    const role = await this.roleService.getRoleByValue('USER')
    await user.$set('roles', [role.id])
    user.roles = [role]
    return user
  }

  async getAllUsers() {
    const usersObjects = await this.userRepository.findAll({ include: { all: true } })
    const users = usersObjects.map((user) => {
      return { email: user.email, role: user.roles.map((role) => role.value) }
    })
    return users
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email }, include: { all: true } })
    return user
  }
}
