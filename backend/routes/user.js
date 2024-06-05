const express = require('express');
const { authorize } = require('../middleware/authorize')
const { roles } = require('../utils/constants')
const {
  createUser,
  verifiyUser,
  getUsers,
  updateUser,
  deleteUser,
  updateProfile,
  getUser,
  getProfile
} = require('../controllers/user');

const router = express.Router();


router.route('/')
.get(authorize(), getUsers)
.post(authorize([roles.OWNER]), createUser)

router.route('/profile')
.get(authorize(), getProfile)
.put(authorize(), updateProfile)

router.route('/verify').get(verifiyUser);

router.route('/:id')
.get(authorize(), getUser)
.put(authorize([roles.OWNER]), updateUser)
.delete(authorize([roles.OWNER]), deleteUser)


module.exports = router;

