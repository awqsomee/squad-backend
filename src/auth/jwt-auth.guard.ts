import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest()
    try {
      const authHeader = req.headers.authorization
      if (!authHeader) throw new UnauthorizedException('Unauthorized')

      const bearer = authHeader.split(' ')[0]
      const token = authHeader.split(' ')[1]

      if (bearer !== 'Bearer' || !token) throw new UnauthorizedException('Unauthorized')

      const user = this.jwtService.verify(token)
      console.log(user)

      req.user = user
      return true
    } catch (e) {
      console.log(e)
      throw new UnauthorizedException('Unauthorized')
    }
  }
}
