import { Controller, Inject, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/roles/roles.guard';
import { Roles } from './roles.decorator';
import { GetUser } from './get-user.decorator';
import { User, UserRole } from './user.entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: LoggerService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  async login(
    @Body() authCredentialsDto: AuthCredentialsDTO,
  ): Promise<{ accessToken: string; username: string }> {
    return await this.authService.login(authCredentialsDto);
  }

  @Post('create-user')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create user' })
  @ApiBearerAuth()
  async createUser(@Body() createUserDto: CreateUserDTO): Promise<void> {
    return await this.authService.createUser(createUserDto);
  }

  @Get('me')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get current user' })
  @ApiBearerAuth()
  getProfile(@GetUser() user: User): User {
    this.logger.log('User profile accessed by: ', user.id);
    return user;
  }
}
