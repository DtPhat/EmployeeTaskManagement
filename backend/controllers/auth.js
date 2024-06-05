const { transporter, mailSender } = require("../config/nodemailer")
const { twilioClient, serviceSid, phoneSender } = require("../config/twilio")
const { generateAccessCode, generateJWT } = require("../utils/generator")
const { User } = require("../models")
const createPhoneAccessCode = async (req, res) => {
  const { phoneNumber } = req.body

  if (!phoneNumber) {
    return res.status(404).json({ message: 'Email not sent' });
  }

  const snapshot = await User.where("phone.phoneNumber", "==", phoneNumber).get();

  if (snapshot.empty) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userDoc = snapshot.docs[0]

  if (!userDoc.data().isVerified) {
    return res.status(404).json({ message: 'User is not verified ' });
  }

  const accessCode = generateAccessCode();

  //For demo only
  if (phoneNumber == '+841234567890') {
    await userDoc.ref.update({
      'phone.accessCode': "123456"
    });
    return res.status(200).json({ message: 'Demo: Success!' });
  }

  try {
    const smsResponse = await twilioClient
      .messages
      .create({
        body: 'Your access code is: ' + accessCode,
        from: phoneSender,
        to: phoneNumber
      })
      .then(message => console.log(message))

    await userDoc.ref.update({
      'phone.accessCode': accessCode
    });

    res.status(200).json({ message: 'Access code sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const validatePhoneAccessCode = async (req, res) => {
  const { accessCode, phone } = req.body;

  try {
    const snapshot = await User
      .where('phone.phoneNumber', '==', phone)
      .where('phone.accessCode', '==', accessCode)
      .get();

    if (snapshot.empty) {
      return res.status(400).json({ message: 'Access code does not match' });
    }

    const userDoc = snapshot.docs[0]
    userDoc.ref.update({ verified: true, verificationToken: null });

    const updatedValue = await userDoc?.ref.update({
      phone: {
        accessCode: null,
        phoneNumber: userDoc.data().phone.phoneNumber
      }
    });

    const userToken = generateJWT(userDoc.id)

    const userInfo = {
      ...userDoc.data(),
      id: userDoc.id,
    }

    res.status(200).json({ message: 'Access granted', userToken, userInfo });
  } catch (error) {
    res.status(500).json({ message: error?.message });
  }
}

const createEmailAccessCode = async (req, res) => {
  const { emailAddress } = req.body;

  if (!emailAddress) {
    return res.status(400).json({ message: 'Email not sent' });
  }

  const snapshot = await User.where("email.emailAddress", "==", emailAddress).get();

  if (snapshot.empty) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userDoc = snapshot.docs[0]

  if (!userDoc.data().isVerified) {
    return res.status(404).json({ message: 'User is not verified ' });
  }

  const accessCode = generateAccessCode();

  //For demo only
  if (emailAddress == 'tester@gmail.com') {
    await userDoc.ref.update({
      'email.accessCode': "123456"
    });
    return res.status(200).json({ message: 'Demo: Success!' });
  }

  await userDoc.ref.update({
    'email.accessCode': accessCode
  });

  try {
    const mailOptions = {
      from: mailSender,
      to: emailAddress,
      subject: 'Authentication via mail',
      text: `Your verification token is: ${accessCode}`
    };

    const info = await transporter.sendMail(mailOptions)

    res.status(200).json({ message: 'Access code has been sent' });

  } catch (error) {
    res.status(500).json({ message: 'Error sending email' })
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
      return res.status(400).send({ message: 'Access code does not match' });
    }

    const userDoc = snapshot.docs[0]

    const updatedValue = await userDoc.ref.update({
      'email.accessCode': null
    });

    const userToken = generateJWT(userDoc.id)

    const userInfo = {
      ...userDoc.data(),
      id: userDoc.id,
    }

    res.status(200).json({ message: 'Access granted', userToken, userInfo });
  } catch (error) {
    res.status(500).json({ message: error?.messsage });
  }
}




module.exports = {
  createPhoneAccessCode,
  validatePhoneAccessCode,
  createEmailAccessCode,
  validateEmailAccessCode,
}