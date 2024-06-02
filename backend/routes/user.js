const express = require('express');
const { authorize } = require('../middleware/authorize')
const { roles } = require('../utils/constants')
const {
  createUser,
  verifiyUser,
  getUsers,
  updateUser,
  deleteUser,
  updateProfile
} = require('../controllers/user');

const router = express.Router();

router.route('/verify').post(verifiyUser);

router.route('/')
  .get(authorize([roles.OWNER]), getUsers)
  .post(authorize([roles.OWNER]), createUser)

router.route('/profile').put(authorize(), updateProfile);

router.route('/:id')
  .put(authorize([roles.OWNER]), updateUser)
  .delete(authorize([roles.OWNER]), deleteUser)


module.exports = router;

