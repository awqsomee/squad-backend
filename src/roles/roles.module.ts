import { Module } from '@nestjs/common'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { Role } from './role.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from 'src/users/user.model'
import { UserRoles } from './user-roles.model'

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [SequelizeModule.forFeature([Role, User, UserRoles])],
  exports: [RolesService],
})
export class RolesModule {}
