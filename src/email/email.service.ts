import { Injectable, StreamableFile } from '@nestjs/common';
import { parse } from 'csv-parse';
import * as nodemailer from 'nodemailer';
import { createReadStream, readFile } from 'fs';
import { join } from 'path';
// for some reason, nodemailer is undefined if imported like... import nodemailer from 'nodemailer';
// https://stackoverflow.com/questions/27084159/cannot-read-property-createtransport-of-undefined

// import file from '../assets/budget.csv';

const EMORY_PASSWORD = process.env.EMORY_PASSWORD;
const EMORY_NETID = process.env.EMORY_NETID;
console.log('PASSWORD:', EMORY_PASSWORD);
console.log('NETID:', EMORY_NETID);

@Injectable()
export class EmailService {
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

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL:', nodemailer.getTestMessageUrl(email));
  }

  parseCSV() {
    // const file = createReadStream(join(process.cwd(), 'assets/budget.csv'));
    // const file = readFile(join(process.cwd(), 'assets/budget.csv'), (data) =>
    //   console.log('\nDATA IN CB:', data),
    // );
    // const streamableFile = new StreamableFile(file);
    // console.log('\nSTREAMABLEFILE:', streamableFile);
    // console.log('\nSTREAM:', streamableFile.getStream());

    createReadStream(join(process.cwd(), 'assets/budget.csv'))
      .pipe(parse({ delimiter: '|', relax_quotes: true }))
      .on('data', function (row) {
        console.log('\n\nROW:', row);
      });
    // const file = createReadStream(join(process.cwd(), 'assets/budget.csv'))
    //   .pipe(parse({ delimiter: '|' }))
    //   .on('data', function (row) {
    //     console.log('\n\nROW:', row);
    //   });

    const records = [];
    // const parser = parse({
    //   delimiter: '|',
    // });

    // parser.on('readable', function () {
    //   let record;
    //   while ((record = parser.read()) !== null) {
    //     console.log('record:', record);
    //     records.push(record);
    //   }
    // });

    // parser.on('end', function () {
    //   console.log('\n\nENDED!!\n\n');
    // });

    // parser.write(file);

    // return streamableFile;
    // console.log('\n\nFILE:', file);

    return 'Hello';
  }
}
