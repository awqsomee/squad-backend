import { CreateUserDto } from './create-user.dto'

export interface UserResponse {
  token: string
  user: CreateUserDto
}
