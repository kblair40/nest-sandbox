import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';

@ApiTags('Records')
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get('/')
  findAll() {
    // return this.recordsService.findAll();
    return this.recordsService.uploadData();
  }

  @Post()
  create(@Body() createRecordDto: CreateRecordDto) {
    return this.recordsService.create();
    // return this.recordsService.create(createRecordDto);
  }
}
