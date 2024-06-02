const { transporter, mailSender } = require("../config/nodemailer")
const { twilioClient, serviceSid } = require("../config/twilio")
const { generateAccessCode } = require("../utils/generator")
const { User } = require("../models")
const createPhoneAccessCode = async (req, res) => {
  const { phoneNumber } = req.body
  const phonePrefix = "+84"
  const internationalPhoneNumber = phonePrefix + phoneNumber
  const accessCode = generateAccessCode();
  try {
    const response = await twilioClient.messages
      .create({
        body: 'Your access code is: ' + accessCode,
        from: '+18153170092',
        to: internationalPhoneNumber
      })
      .then(message => console.log(message.sid));
    res.status(200).json({ message: 'Access code sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const validatePhoneAccessCode = async (req, res) => {
  const { accessCode, phone } = req.query;


  try {
    const snapshot = await User
      .where('phone.phoneNumber', '==', phone)
      .where('phone.accessToken', '==', accessCode)
      .get();

    if (snapshot.empty) {
      return res.status(400).send({ message: 'Invalid token' });
    }

    snapshot.forEach(doc => {
      doc.ref.update({ verified: true, verificationToken: null });
    });

    res.status(200).send({ message: 'Account verified successfully' });
  } catch (error) {
    res.status(500).send({ message: error.toString() });
  }
}

// const validatePhoneUsingTwilioCheck = async (req, res) => {
//   const { phoneNumber, accessCode } = req.body;
//   const phonePrefix = "+84"
//   const internationalPhoneNumber = phonePrefix + phoneNumber

//   try {
//     const verificationCheck = await twilioClient.verify.v2.services(serviceSid)
//       .verificationChecks
//       .create({ to: internationalPhoneNumber, code: accessCode });

//     if (verificationCheck.status === 'approved') {
//       res.status(200).json({ message: 'Phone number verified' });
//     } else {
//       res.status(400).json({ message: 'Invalid code' });
//     }
//   } catch (error) {
//     if (error.status === 404) {
//       res.status(400).json({ message: 'Token expired (10 minutes) or token approved or max attempts reached!' });
//     }
//     res.status(500).json({ error: error.message });
//   }
// }

const createEmailAccessCode = async (req, res) => {
  const { email } = req.body;


  const snapshot = await User.where("email.emailAddress", "==", email).get();

  if (snapshot.empty) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userData = snapshot.docs[0].data()

  if (!userData.isVerified) {
    return res.status(404).json({ error: 'Email is not verified ' });
  }

  const accessCode = generateAccessCode()

  const userDoc = snapshot.docs[0].ref;

  await userDoc.update({
    'email.accessCode': accessCode
  });

  try {
    const mailOptions = {
      from: mailSender,
      to: email,
      subject: 'Authentication via mail',
      text: `Your verification token is: ${accessCode}`
    };

    const info = await transporter.sendMail(mailOptions)

    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully', accessCode });

  } catch (error) {
    res.status(500).json({ error: 'Error sending email' })
  }
}

const validateEmailAccessCode = async (req, res) => {
  const { accessCode, email } = req.body;

  try {
    // Find the employee with the verification token
    const snapshot = await User
      .where('email.emailAddress', '==', email)
      .where('email.accessCode', '==', accessCode)
      .get();

    if (snapshot.empty) {
      return res.status(400).send({ message: 'Invalid token' });
    }

    snapshot.forEach(doc => {
      doc.ref.update({ email: {
        emailAddress: doc.data().email.emailAddress,
        accessToken: null,
      } });
    });

    res.status(200).send({ message: 'Access granted' });
  } catch (error) {
    res.status(500).send({ message: error.toString() });
  }
}

module.exports = {
  createPhoneAccessCode,
  validatePhoneAccessCode,
  createEmailAccessCode,
  validateEmailAccessCode
}