import { Injectable } from '@nestjs/common'
import { BadRequestException } from '@nestjs/common/exceptions'
import { InjectModel } from '@nestjs/sequelize'
import { Game } from 'src/games/game.model'
import { GamesService } from 'src/games/games.service'
import { RolesService } from 'src/roles/roles.service'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './user.model'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
    private gameService: GamesService
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
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

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email }, include: { all: true } })
    return user
  }
  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, include: { all: true } })
    return user
  }

  async playGame(currentUser: User, id: number, playing: boolean) {
    const game = await this.gameService.getGameById(id)
    if (!game) throw new BadRequestException("Game doesn't exist")
    const user = await this.getUserById(currentUser.id)
    if (playing) {
      await user.$set('games', [...user.games.map((game) => game.id), game.id])
      return { message: 'Game added' }
    } else {
      await user.$set('games', [...user.games.filter((userGame) => userGame.id != game.id)])
      return { message: 'Game removed' }
    }
  }
}
