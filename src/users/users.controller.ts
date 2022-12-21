import { Body, Controller, Req, Get, Post, UseGuards, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Roles } from 'src/auth/roles-auth.decorator'
import { RolesGuard } from 'src/auth/roles.guard'
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

  @UseGuards(JwtAuthGuard)
  @Post('/play')
  play(@Body('id') id: number, @Body('playing') playing: boolean, @Req() req) {
    return this.userService.playGame(req.user, id, playing)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/seek')
  seek(@Body('id') id: number, @Body('seeking') seeking: boolean, @Req() req) {
    return this.userService.searchForTeam(req.user, id, seeking)
  }
}
