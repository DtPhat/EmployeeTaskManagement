const { db } = require("../config/firebase");
const { FRONTEND_BASE_URL } = require("../config/host");
const { fromMail, mailSender, transporter } = require("../config/nodemailer");
const { User } = require("../models");
const { generateAccessCode, generateVerificationToken } = require("../utils/generator");

const createUser = async (req, res) => {
  const { email, phone, name, password, role, address } = req.body

  try {
    const verificationToken = generateVerificationToken()

    const data = {
      email: {
        accessCode: null,
        emailAddress: email,
      },
      phone: {
        accessCode: null,
        phoneNumber: phone,
        // isVerified: false
      },
      role,
      name,
      address,
      verificationToken,
      isVerified: false,
    }

    const snapshot = await User.where('email.emailAddress', '==', email).get();

    if (!snapshot.empty) {
      return res.status(400).json('Email already exists');
    }
    const databaseInfo = await User.doc().set(data)

    const verificationLink = `${FRONTEND_BASE_URL}/verify?token=${verificationToken}`;

    const mailOptions = {
      from: mailSender,
      to: email,
      subject: 'Account Verification',
      text: `Hello ${name},\n\nPlease verify your account by clicking the link: ${verificationLink}`
    };

    const mailInfo = await transporter.sendMail(mailOptions)

    return res.status(200).json({
      message: "User created successfully.",
      data: {
        ...data,
        email: data.email.emailAddress,
        phone: data.phone.phoneNumber
      }
    })

  } catch (error) {
    res.status(500).json(error?.message)
  }
}

const verifiyUser = async (req, res) => {
  const { token } = req.query
  try {
    // Find the employee with the verification token
    const snapshot = await User.where('verificationToken', '==', token).get();

    if (snapshot.empty) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    snapshot.forEach(doc => {
      doc.ref.update({ isVerified: true, verificationToken: null });
    });

    res.status(200).json({ message: 'Account verified successfully' });
  } catch (error) {
    res.status(500).json(error?.message);
  }
}


module.exports = {
  createUser,
  verifiyUser
}