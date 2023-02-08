import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RecordsService } from './records.service';
// import { CreateRecordDto } from './dto/create-record.dto';

@ApiTags('Records')
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get()
  findAll() {
    return this.recordsService.findAll();
  }

  @Get('/upload')
  uploadData() {
    return this.recordsService.uploadData();
  }

  @Get('/delete')
  deleteAll() {
    return this.recordsService.deleteAll();
  }

  @Post()
  create() {
    return this.recordsService.create();
  }

  // create(@Body() createRecordDto: CreateRecordDto) {
  //   return this.recordsService.create(createRecordDto);
  // }
}
