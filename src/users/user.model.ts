import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { Role } from 'src/roles/role.model'
import { UserRoles } from 'src/roles/user-roles.model'
import { Game } from 'src/games/game.model'
import { UserGames } from 'src/games/user-games.model'
import { UserGamesSeek } from 'src/games/user-games-seek.model'

interface UserCreationAttrs {
  username: string
  password: string
}

@Table({ tableName: 'users', createdAt: false, updatedAt: false })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Id' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number

  @ApiProperty({ example: 'email@email.com', description: 'User email' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  username: string

  @ApiProperty({ example: 'qwerty', description: 'User password' })
  @Column({ type: DataType.STRING })
  password: string

  @Column({ type: DataType.TEXT })
  description: string

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[]

  @BelongsToMany(() => Game, () => UserGames, 'userId')
  games: Game[]

  @BelongsToMany(() => Game, () => UserGamesSeek, 'seekerId')
  searches: Game[]

  // @BelongsToMany(() => Game, () => UserGames)
  // wishlist: Game[]
}
