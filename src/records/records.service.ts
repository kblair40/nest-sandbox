import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parse } from 'csv-parse';
import * as nodemailer from 'nodemailer';
import { createReadStream } from 'fs';
import { join } from 'path';

import { CreateRecordDto } from './dto/create-record.dto';
import { Record } from './entities/record.entity';

const dummyRecord: CreateRecordDto = {
  one: 'fdsawf',
  two: 'agqw',
  three: 'hdgfsg',
  four: 'qgedwer',
  five: 'mgfd',
  six: 'bxcvz',
  seven: 'gdhfdgh',
  eight: 'tsdfg',
  nine: 'xcbv',
  ten: 'ngfsgd',
  eleven: 'hrwert',
  twelve: 'hgdfdfjh',
};

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private recordsRepository: Repository<Record>,
  ) {}

  create() {
    const newRecord = this.recordsRepository.create(dummyRecord);

    return this.recordsRepository.save(newRecord);
  }

  async uploadData() {
    try {
      const records = await this.getRecordsFromCSV();
      console.log('\n\nRECORDS:', records.slice(3, 8));
      console.log('FIND ALL CALLED\n');
      return this.recordsRepository.find();
    } catch (e) {
      console.log('FAILED');
    }
  }

  async findAll() {
    return this.recordsRepository.find();
  }

  getRecordsFromCSV(): Promise<any[]> {
    const records = [];

    return new Promise((resolve, reject) => {
      // https://www.digitalocean.com/community/tutorials/how-to-read-and-write-csv-files-in-node-js-using-node-csv
      createReadStream(join(process.cwd(), 'assets/budget.unl'))
        .pipe(
          parse({
            delimiter: '|',
            quote: false, // any falsy value disables quote detection (https://csv.js.org/parse/options/quote/)
          }),
        )
        .on('data', function (row) {
          records.push(row);
        })
        .on('error', function (error) {
          // console.log('\nERROR DATA:', error);
          return reject(error);
        })
        .on('end', function () {
          return resolve(records);
        });
    });
  }
}
