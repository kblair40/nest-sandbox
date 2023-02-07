import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
// for some reason, nodemailer is undefined if imported like... import nodemailer from 'nodemailer';
// https://stackoverflow.com/questions/27084159/cannot-read-property-createtransport-of-undefined

const EMORY_PASSWORD = process.env.EMORY_PASSWORD;
const EMORY_NETID = process.env.EMORY_NETID;
console.log('PASSWORD:', EMORY_PASSWORD);
console.log('NETID:', EMORY_NETID);

@Injectable()
export class EmailService {
  async sendEmail() {
    console.log('\n\nSENDING EMAIL\n\n');
    const transporter = nodemailer.createTransport({
      host: 'smtp.service.emory.edu',
      port: 587, // Not sure, just following nodemailer.com/about intro
      secure: false, // true for 465, false for other ports
      // port: 465, // Not sure, just following nodemailer.com/about intro
      // secure: true, // true for 465, false for other ports
      auth: {
        user: EMORY_NETID,
        pass: EMORY_PASSWORD,
      },
    });

    const email = await transporter.sendMail({
      from: '"Kevin Blair" <kevin.blair@emory.edu>',
      to: 'Kevin Gmail, kblair40@gmail.com',
      subject: 'TESTING',
      text: 'Body text',
      // cc, bcc, html, attachments and many other fields can be added as needed
      // https://nodemailer.com/message/
    });

    console.log('Message sent:', email.messageId);

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL:', nodemailer.getTestMessageUrl(email));
  }
}
