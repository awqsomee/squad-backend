import { Body, Query, Param, Controller, Get, Post, Delete, UseInterceptors } from '@nestjs/common'
import { UploadedFile } from '@nestjs/common/decorators'
import { FileInterceptor } from '@nestjs/platform-express/multer'
import { CreateGameDto } from './dto/create-game.dto'
import { GamesService } from './games.service'

@Controller('/api/games')
export class GamesController {
  constructor(private gameService: GamesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('cover'))
  create(@UploadedFile() cover: Express.Multer.File, @Body() gameDto: CreateGameDto) {
    return this.gameService.addGame(gameDto, cover)
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
