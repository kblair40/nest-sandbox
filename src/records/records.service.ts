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
    // Creates a single (non-unique) record.  Only use for testing
    const newRecord = this.recordsRepository.create(DUMMY_RECORD);
    return this.recordsRepository.save(newRecord);
  }

  findAll() {
    return this.recordsRepository.find();
  }

  async uploadData() {
    try {
      const newRecords = [];
      const rawRecords = await this.getRecordsFromCSV();
      // console.log('\n\nRECORDS:', records.slice(3, 8));

      for (const record of rawRecords) {
        const newRecord: CreateRecordDto = {
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

        // newRecords.push(this.recordsRepository.save(newRecord));
        newRecords.push(newRecord);

        // this.saveRecord(newRecord);
      }

      const saveResult = await this.recordsRepository.save(newRecords);
      console.log('\n\nSAVE RESULT COUNT:', saveResult.length, '\n\n');

      this.sendEmail(`Inserted ${saveResult.length} records`);

      return this.recordsRepository.find();
    } catch (e) {
      console.log('FAILED');
    }
  }

  async deleteAll() {
    // Deletes everything
    const deleteResult = await this.recordsRepository.delete({ one: Not('') });
    console.log('\n# of deleted rows:', deleteResult.affected);

    // don't send if no rows were deleted
    if (deleteResult.affected) {
      this.sendEmail(`Deleted ${deleteResult.affected} records`);
    }
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

  async sendEmail(bodyString?: string) {
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
      text: bodyString ? bodyString : 'body text',
    });

    console.log('Message sent:', email.messageId);
  }
}
