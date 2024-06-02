
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'dtphatkhna@gmail.com',
    pass: 'rsxy idfc zpcn qmgn'
  }
});

const mailSender = 'dtphatkhna@gmail.com';

module.exports = {
  transporter,
  mailSender
}