import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { parse } from 'csv-parse';
import * as nodemailer from 'nodemailer';
import { createReadStream } from 'fs';
import { join } from 'path';

import { CreateRecordDto } from './dto/create-record.dto';
import { Record } from './entities/record.entity';

const DUMMY_RECORD: CreateRecordDto = {
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

const EMORY_PASSWORD = process.env.EMORY_PASSWORD;
const EMORY_NETID = process.env.EMORY_NETID;

/**
 * STEPS...
 * 1. Get CSV File
 *   - From a different server, not saved locally as it is done here
 * 2. Parse/Validate Rows (getRecordsFromCSV() method)
 *   - Unclear what validation should be performed...
 *     - ex. if row is missing value in column '7', should we not save that row?
 *         Or should we save that row with a null value for that column?
 *         Or should we force that column to have a specific value/type and then save it?
 *     - Should any logging be done for rows with incomplete data?
 * 3. Upload valid rows/records to database (uploadData() method)
 *   - Table is named 'record' at the moment but should improve that once the data we're saving is known.
 * 4. Send success (or error) email to someone/somewhere (sendEmail() method)
 *   - What data should be in email?
 *     - ex. just an "upload successful" kind of message? Maybe include # of rows inserted?
 */

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private recordsRepository: Repository<Record>,
  ) {}

  create() {
    const newRecord = this.recordsRepository.create(DUMMY_RECORD);

    return this.recordsRepository.save(newRecord);
  }

  saveRecord(record: CreateRecordDto) {
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

        this.saveRecord(recordObject);
      }

      this.sendEmail();

      return this.recordsRepository.find();
    } catch (e) {
      console.log('FAILED');
    }
  }

  findAll() {
    console.log('FIND ALL');
    return this.recordsRepository.find();
  }

  deleteAll() {
    console.log('DELETE');
    // Deletes everything
    this.recordsRepository.delete({ one: Not('') });
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

  async sendEmail() {
    console.log('\n\nSENDING EMAIL');
    const transporter = nodemailer.createTransport({
      host: 'smtp.service.emory.edu',
      port: 587, // Not sure, just following nodemailer.com/about intro
      secure: false, // true for 465, false for other ports
      auth: {
        user: EMORY_NETID,
        pass: EMORY_PASSWORD,
      },
    });

    // cc, bcc, html, attachments and many other fields can be added as needed
    // https://nodemailer.com/message/
    const email = await transporter.sendMail({
      from: '"Kevin Blair" <kevin.blair@emory.edu>',
      to: 'Kevin Gmail, kblair40@gmail.com',
      subject: 'TESTING',
      text: 'Body text',
    });

    console.log('Message sent:', email.messageId);
  }
}
