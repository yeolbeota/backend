import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { HttpExceptionRedirectFilter } from 'src/filters/http-exception.filter';
import { AccessGuard } from './guards/access.guard';
import { GoogleGuard } from './guards/google.guard';
import { RefreshGuard } from './guards/refresh.guard';
import { Cookie } from 'src/constants';
import { User } from 'src/shared/decorator/user.decorator';

const { REFRESH_TOKEN_KEY, REFRESH_TOKEN_OPTION } = Cookie;

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  hello(@User() user: Express.User) {
    return user;
  }

  @Get('/google')
  @UseGuards(GoogleGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  googleAuth() {}

  @Get('/google/callback')
  @UseGuards(GoogleGuard)
  @UseFilters(new HttpExceptionRedirectFilter('/auth/google', [401]))
  async googleAuthRedirect(@User() user: Express.User, @Res() res: Response) {
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const refreshToken = await this.authService.generateRefreshToken(user);
    const frontendUrl = this.config.get<string>('FRONTEND_URL');

    if (!frontendUrl) {
      throw new Error('FRONTEND_URL is not defined');
    }

    res.cookie(REFRESH_TOKEN_KEY, refreshToken, REFRESH_TOKEN_OPTION());
    res.redirect(`${frontendUrl}`);
  }

  @Get('/refresh')
  @UseGuards(RefreshGuard)
  async refresh(@Req() req: Request) {
    if (!req.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return {
      accessToken: await this.authService.generateAccessToken(req.user),
    };
  }

  @Get('/logout')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    const { id } = req.user as Express.User;
    await this.authService.deleteRefreshToken(id);
    res.clearCookie(REFRESH_TOKEN_KEY);
    res.status(HttpStatus.OK).json({ message: 'Logout success' });
  }
}
