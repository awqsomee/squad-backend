import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/user.model'
import { Game } from './game.model'

@Table({ tableName: 'userGames', createdAt: false, updatedAt: false })
export class UserGames extends Model<UserGames> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number

  @ForeignKey(() => Game)
  @Column({ type: DataType.INTEGER })
  gameId: number
}
