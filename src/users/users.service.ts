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

  async getAllUsers(limit = 20, offset = 0, title = null) {
    let game: Game
    let usersObjects: User[]
    if (title != null) {
      game = await this.gameService.getGameByTitle(title)
      usersObjects = await this.userRepository.findAll({
        include: [
          {
            model: Game,
            as: 'searches',
            where: {
              id: game.id,
            },
          },
          {
            model: Game,
            as: 'games',
          },
        ],
        offset,
        limit,
      })
    } else
      usersObjects = await this.userRepository.findAll({
        include: {
          all: true,
        },
        offset,
        limit,
      })
    // const users = usersObjects.map((user) => {
    //   return { email: user.email, role: user.roles.map((role) => role.value) }
    // })
    const users = usersObjects.map((user) => {
      return { email: user.email, searches: user.searches, games: user.games }
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

  async searchForTeam(currentUser: User, id: number, searching: boolean) {
    const game = await this.gameService.getGameById(id)
    if (!game) throw new BadRequestException("Game doesn't exist")
    const user = await this.getUserById(currentUser.id)
    if (searching) {
      await user.$set('searches', [...user.searches.map((game) => game.id), game.id])
      return { message: 'Game added' }
    } else {
      await user.$set('searches', [...user.searches.filter((userGame) => userGame.id != game.id)])
      return { message: 'Game removed' }
    }
  }
}
