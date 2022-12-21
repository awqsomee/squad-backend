import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from './roles-auth.decorator'
import { ForbiddenException } from '@nestjs/common/exceptions'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
      if (!requiredRoles) return true

      const req = context.switchToHttp().getRequest()
      const authHeader = req.headers.authorization
      if (!authHeader) throw new ForbiddenException()

      const bearer = authHeader.split(' ')[0]
      const token = authHeader.split(' ')[1]

      if (bearer !== 'Bearer' || !token) throw new ForbiddenException()

      const user = this.jwtService.verify(token)
      req.user = user

      return user.roles.some((role) => requiredRoles.includes(role.value))
    } catch (e) {
      console.log(e)
      throw new ForbiddenException()
    }
  }
}
