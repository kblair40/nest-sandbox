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

  makeRecord(record: CreateRecordDto) {
    const newRecord = this.recordsRepository.create(record);
    return this.recordsRepository.save(newRecord);
  }

  async uploadData() {
    try {
      const records = await this.getRecordsFromCSV();
      // console.log('\n\nRECORDS:', records.slice(3, 8));

      for (const record of records) {
        const recordObject: CreateRecordDto = {
          one: record[0],
          two: record[1],
          three: record[2],
          four: record[3],
          five: record[4],
          six: record[5],
          seven: record[6],
          eight: record[7],
          nine: record[8],
          ten: record[9],
          eleven: record[10],
          twelve: record[11],
        };

        this.makeRecord(recordObject);
      }

      return this.recordsRepository.find();
    } catch (e) {
      console.log('FAILED');
    }
  }

  findAll() {
    console.log('FIND ALL CALLED\n');
    return this.recordsRepository.find();
  }

  deleteAll() {
    console.log('DELETE');
    this.recordsRepository.delete({ one: 'fdsawf' });
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
