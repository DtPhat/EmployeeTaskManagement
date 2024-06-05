const { db } = require("../config/firebase");
const { FRONTEND_BASE_URL, roles } = require("../utils/constants");
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

    const emailCheck = await User.where('email.emailAddress', '==', email).get();

    if (!emailCheck.empty) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const phoneCheck = await User.where('phone.phoneNumber', '==', phone).get();
    if (!phoneCheck.empty) {
      return res.status(400).json({ message: 'Phone already exists' });
    }

    const dbResponse = await User.doc().set(data)

    const verificationLink = `${FRONTEND_BASE_URL}/verify?token=${verificationToken}`;

    const mailOptions = {
      from: mailSender,
      to: email,
      subject: 'Account Verification',
      text: `Hello ${name},\n\nPlease verify your account by clicking the link: ${verificationLink}`
    };

    const transporterResponse = await transporter.sendMail(mailOptions)

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
    const snapshot = await User.where('verificationToken', '==', token).get();

    if (snapshot.empty) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    snapshot.forEach(doc => {
      doc.ref.update({ isVerified: true});
    });

    res.status(200).json({ message: 'Account verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error?.message });
  }
}


const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let query = User;

    if (role) {
      if (role != roles.OWNER && role != roles.EMPLOYEE) {
        return res.status(400).json({ message: 'Invalid role' })
      }
      query = query.where('role', '==', role);
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      return res.status(404).json('No users found');
    }

    const users = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(user => user.id != req.userId);

    res.status(200).json({
      data: users,
    });
  } catch (error) {
    res.status(500).json(error?.message);
  }
};


const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userDoc = await User.doc(id).get()

    if (!userDoc.exists) {
      return res.status(404).json('No users found');
    }

    const users = { id: userDoc.id, ...userDoc.data() }
    res.status(200).json({
      data: users,
    });
  } catch (error) {
    res.status(500).json(error?.message);
  }
}

const updateUser = async (req, res) => {
  const { id } = req.params;  // Get userId from URL parameters
  const { role } = req.body


  try {
    const userDoc = await User.doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).json('User not found');
    }

    await userDoc.ref.update({
      role: role,
    });

    res.status(200).json('User updated successfully');
  } catch (error) {
    res.status(500).json(error.toString());
  }
}



const getProfile = async (req, res) => {
  const { userId } = req;
  try {
    const userDoc = await User.doc(userId).get()

    if (!userDoc.exists) {
      return res.status(404).json('No users found');
    }

    const users = { ...userDoc.data() }
    res.status(200).json({
      message: 'success',
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error?.message });
  }
}

const updateProfile = async (req, res) => {
  const { userId } = req
  const { name, address, phone } = req.body


  try {
    const userDoc = await User.doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json('User not found');
    }

    await userDoc.ref.update({
      name: name,
      address: address,
      'phone.phoneNumber': phone,
    });

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json(error.toString());
  }
}


const deleteUser = async (req, res) => {
  const { id } = req.params;  // Get userId from URL parameters

  try {
    const userDoc = await User.doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    await userDoc.ref.delete();

    res.status(200).json('User deleted successfully', {
      id: userDoc.id,
    });
  } catch (error) {
    res.status(500).json(error.toString());
  }
}



module.exports = {
  createUser,
  verifiyUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile
}