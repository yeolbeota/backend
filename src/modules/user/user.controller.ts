import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { AccessGuard } from 'src/modules/auth/guards/access.guard';
import { User } from 'src/shared/decorator/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../admin/guards/admin.guard';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('user')
@ApiTags('User')
@UseGuards(AccessGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Res() res: Response) {
    res.redirect(HttpStatus.MOVED_PERMANENTLY, '/auth/google');
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async update(
    @User() user: Express.User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(user.id, updateUserDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  async updateById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto);
  }

  @Patch('status/:id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return await this.userService.updateStatus(id, updateStatusDto);
  }
}
