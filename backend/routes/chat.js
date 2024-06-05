const express = require('express');
const router = express.Router();
const {
  getMessages
} = require('../controllers/chat');
const { authorize } = require('../middleware/authorize');

router.get('/:room', authorize(), getMessages);

module.exports = router;