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

  async getAllUsers(limit = 20, offset = 0, titles = null) {
    let game: Game
    let usersObjects: User[]
    if (titles != null && titles.length != 0) {
      usersObjects = await this.userRepository.findAll({
        include: [
          {
            model: Game,
            as: 'searches',
            where: {
              title: titles,
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
      return { username: user.username, description: user.description, searches: user.searches, games: user.games }
    })
    return users
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username }, include: { all: true } })
    return user
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, include: { all: true } })
    return user
  }

  async getUserGames(username: string) {
    const user = await this.userRepository.findOne({ where: { username }, include: { all: true } })
    if (!user) throw new BadRequestException("User doesn't exist")
    return {
      username: user.username,
      description: user.description,
      games: user.games.map((game) => game.title),
      searches: user.searches.map((search) => search.title),
    }
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
      await user.$set('searches', [...user.searches.filter((userGame) => userGame.id != game.id)])
      return { message: 'Game removed' }
    }
  }

  async searchForTeam(currentUser: User, id: number, searching: boolean) {
    const game = await this.gameService.getGameById(id)
    if (!game) throw new BadRequestException("Game doesn't exist")
    const user = await this.getUserById(currentUser.id)
    if (searching) {
      await user.$set('games', [...user.games.map((game) => game.id), game.id])
      await user.$set('searches', [...user.searches.map((search) => search.id), game.id])
      return { message: 'Game added' }
    } else {
      await user.$set('searches', [...user.searches.filter((userGame) => userGame.id != game.id)])
      return { message: 'Game removed' }
    }
  }

  async editUserInfo(currentUser: User, newUserInfo: User) {
    console.log(currentUser)
    console.log(newUserInfo)
    if (newUserInfo.username == null) throw new BadRequestException(`Username couldn't be empty`)
    let user = await this.getUserById(currentUser.id)
    if (user.username != newUserInfo.username.toLowerCase()) {
      var candidate = await this.getUserByUsername(newUserInfo.username.toLowerCase())
      if (candidate?.username) throw new BadRequestException(`Username "${candidate.username}" already exists`)
    }
    user.username = newUserInfo.username
    user.description = newUserInfo.description
    await user.save()
    return {
      user: {
        id: user.id,
        username: user.username,
        description: user.description,
      },
    }
  }
}
