import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import * as nodemailer from 'nodemailer';
import { createReadStream } from 'fs';
import { join } from 'path';

const EMORY_PASSWORD = process.env.EMORY_PASSWORD;
const EMORY_NETID = process.env.EMORY_NETID;

@Injectable()
export class RecordService {
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

  parseCSV() {
    const records = [];

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
        console.log('\nERROR DATA:', error);
      })
      .on('end', function () {
        console.log('\nALL RECORDS:', records.slice(4, 10));
      });

    return '';
  }
}
