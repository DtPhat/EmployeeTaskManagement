const twilio = require('twilio');
const accountSid = 'AC33c6f681a39b65ad00143c8612a7b851';
const authToken = '656a2460f96e38f391ed9b35fede95b5';
const serviceSid = 'VA705846a7c42c0faea05fb1142b4355fa';

const twilioClient = twilio(accountSid, authToken);
const phoneSender = '+18153170092'
module.exports = {
  serviceSid,
  phoneSender,
  twilioClient
}