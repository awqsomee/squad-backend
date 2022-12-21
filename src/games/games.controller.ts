import { Body, Query, Param, Controller, Get, Post, Delete } from '@nestjs/common'
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

  @Get('/search')
  search(@Query('q') query: string) {
    return this.gameService.searchGames(query)
  }

  @Get(':title')
  get(@Param('title') title: string) {
    return this.gameService.getGameInfo(title)
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.gameService.removeGame(id)
  }
}
