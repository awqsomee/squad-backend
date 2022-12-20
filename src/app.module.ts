import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './users/user.model'
import { UsersModule } from './users/users.module'
import { RolesModule } from './roles/roles.module'
import { Role } from './roles/role.model'
import { UserRoles } from './roles/user-roles.model'
import { AuthModule } from './auth/auth.module'
import { GamesModule } from './games/games.module'
import { Game } from './games/game.model'
import { UserGames } from './games/user-games.model'

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Game, UserGames, Role, UserRoles],
      autoLoadModels: true,
    }),
    UsersModule,
    GamesModule,
    RolesModule,
    AuthModule,
  ],
})
export class AppModule {}
