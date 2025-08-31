import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDTO {
  @IsEmail()
  @ApiProperty({
    description: 'Email',
    example: 'mehaknauman6@gmail.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'Password',
    example: 'password123',
  })
  password: string;
}
