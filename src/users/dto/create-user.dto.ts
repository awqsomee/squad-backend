import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ example: 'email@email.com', description: 'User email' })
  readonly username: string

  @ApiProperty({ example: 'qwerty', description: 'User password' })
  readonly password: string
}
