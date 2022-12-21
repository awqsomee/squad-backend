import { Body, Controller, Req, Get, Post, UseGuards, Query, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './user.model'
import { UsersService } from './users.service'

@ApiTags('Users')
@Controller('/api/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Registration of a new user' })
  @ApiResponse({ status: 200, type: User })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto)
  }

  @ApiOperation({ summary: 'Getting all users' })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getAll(@Query('limit') limit: number, @Query('offset') offset: number, @Query('title') title: string) {
    return this.userService.getAllUsers(limit, offset, title)
  }

  @Get(':user')
  async getOne(@Param('user') username: string) {
    const user = await this.userService.getUserByUsername(username)
    return { username: user.username, games: user.games, searches: user.searches }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/play')
  play(@Body('id') id: number, @Body('playing') playing: boolean, @Req() req) {
    return this.userService.playGame(req.user, id, playing)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/search')
  search(@Body('id') id: number, @Body('searching') searching: boolean, @Req() req) {
    return this.userService.searchForTeam(req.user, id, searching)
  }
}
