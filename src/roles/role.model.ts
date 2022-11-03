import { BelongsTo, BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/users/user.model'
import { UserRoles } from './user-roles.model'

interface RoleCreationAttrs {
  value: string
  description: string
}

@Table({ tableName: 'roles', createdAt: false, updatedAt: false })
export class Role extends Model<Role, RoleCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Id' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number

  @ApiProperty({ example: 'ADMIN', description: 'Unique role name' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  value: string

  @ApiProperty({ example: 'Application administrator', description: 'Role description' })
  @Column({ type: DataType.STRING })
  description: string

  @BelongsToMany(() => User, () => UserRoles)
  users: User[]
}
