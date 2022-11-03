import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Role } from 'src/roles/role.model'
import { RolesModule } from 'src/roles/roles.module'
import { UserRoles } from 'src/roles/user-roles.model'
import { User } from './user.model'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([User, Role, UserRoles]), RolesModule],
  exports: [UsersService],
})
export class UsersModule {}
