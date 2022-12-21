import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/user.model'
import { Game } from './game.model'

@Table({ tableName: 'userGamesSeek', createdAt: false, updatedAt: false })
export class UserGamesSeek extends Model<UserGamesSeek> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number

  @ForeignKey(() => Game)
  @Column({ type: DataType.INTEGER })
  searchId: number

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  seekerId: number
}
