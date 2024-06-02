const express = require('express');
const {
  createUser,
  verifiyUser
} = require('../controllers/user');

const router = express.Router();

router.route('/').post(createUser);
router.route('/verify').post(verifiyUser);

module.exports = router;

