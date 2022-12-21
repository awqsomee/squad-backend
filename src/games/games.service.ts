import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateGameDto } from './dto/create-game.dto'
import { Game } from './game.model'

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game) private gameRepository: typeof Game) {}

  async addGame(dto: CreateGameDto): Promise<Game> {
    let game = await this.gameRepository.findOne({ where: { title: dto.title }, include: { all: true } })
    if (game) throw new HttpException(`Game with title "${dto.title}" already exists`, HttpStatus.BAD_REQUEST)
    game = await this.gameRepository.create(dto)
    return game
  }

  async getGames(): Promise<Game[]> {
    const games = await this.gameRepository.findAll({ include: { all: true } })
    return games
  }

  async getGameInfo(title: string): Promise<Game> {
    const game = await this.getGameByTitle(title)
    if (!game) throw new HttpException(`Game not found`, HttpStatus.BAD_REQUEST)
    return game
  }

  async removeGame(id: number) {
    const game = await this.gameRepository.findOne({ where: { id } })
    await game.destroy()
    return { message: 'Game was removed' }
  }

  async getGameByTitle(title: string) {
    const game = await this.gameRepository.findOne({ where: { title }, include: { all: true } })
    return game
  }

  async getGameById(id: number) {
    const game = await this.gameRepository.findOne({ where: { id }, include: { all: true } })
    return game
  }
}
