import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @IsString()
  @ApiProperty({
    description: 'Name',
    example: 'Mehak Nauman',
  })
  name: string;

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
