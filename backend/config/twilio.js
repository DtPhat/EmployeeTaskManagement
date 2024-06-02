const twilio = require('twilio');
const accountSid = 'AC33c6f681a39b65ad00143c8612a7b851';
const authToken = '5eb8455f581f3deb70a6c0d8081bae9e';
const serviceSid = 'VA705846a7c42c0faea05fb1142b4355fa';
const twilioClient = twilio(accountSid, authToken);

module.exports = {
  serviceSid,
  twilioClient
}