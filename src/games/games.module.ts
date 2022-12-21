import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserRoles } from 'src/roles/user-roles.model'
import { User } from 'src/users/user.model'
import { Game } from './game.model'
import { GamesController } from './games.controller'
import { GamesService } from './games.service'
import { UserGamesSeek } from './user-games-seek.model'
import { UserGames } from './user-games.model'

@Module({
  controllers: [GamesController],
  providers: [GamesService],
  imports: [SequelizeModule.forFeature([Game, User, UserGames, UserGamesSeek, UserRoles])],
  exports: [GamesService],
})
export class GamesModule {}
