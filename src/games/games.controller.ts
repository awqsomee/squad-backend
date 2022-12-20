import { Body, Param, Controller, Get, Post, Delete } from '@nestjs/common'
import { CreateGameDto } from './dto/create-game.dto'
import { GamesService } from './games.service'

@Controller('/api/games')
export class GamesController {
  constructor(private gameService: GamesService) {}

  @Post()
  create(@Body() gameDto: CreateGameDto) {
    return this.gameService.addGame(gameDto)
  }

  @Get()
  getAll() {
    return this.gameService.getGames()
  }

  @Get(':title')
  get(@Param() params: { title: string }) {
    const { title } = params
    return this.gameService.getGameInfo(title)
  }

  @Delete(':id')
  remove(@Param() params: { id: number }) {
    const { id } = params
    return this.gameService.removeGame(id)
  }
}
