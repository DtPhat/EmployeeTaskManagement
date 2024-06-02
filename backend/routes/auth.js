const express = require('express');
const {
  createPhoneAccessCode,
  validatePhoneAccessCode,
  createEmailAccessCode,
  validateEmailAccessCode,
} = require('../controllers/auth');

const router = express.Router();

router.route('/phone').post(createPhoneAccessCode);
router.route('/phone/validate').post(validatePhoneAccessCode);
router.route('/email').post(createEmailAccessCode);
router.route('/email/validate').post(validateEmailAccessCode);

module.exports = router;

