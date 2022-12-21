import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/users/user.model'
import { UserGames } from './user-games.model'
import { UserGamesSeek } from './user-games-seek.model'

interface GameCreationAttrs {
  title: string
}

@Table({ tableName: 'games', createdAt: false, updatedAt: false })
export class Game extends Model<Game, GameCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Id' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number

  // @ApiProperty({ example: 'email@email.com', description: 'User email' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  title: string

  // @ApiProperty({ example: 'qwerty', description: 'User password' })
  @Column({ type: DataType.TEXT })
  description: string

  @Column({ type: DataType.STRING })
  cover: string

  @Column({ type: DataType.DATE })
  releaseDate: Date

  @BelongsToMany(() => User, () => UserGames, 'gameId')
  users: User[]

  @BelongsToMany(() => User, () => UserGamesSeek, 'searchId')
  seekers: User[]
}
