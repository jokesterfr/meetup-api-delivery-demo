import { Controller, Get } from '@nestjs/common';
import { AppService } from '../../app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Meetup demo')
@Controller()
export class HelloController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
