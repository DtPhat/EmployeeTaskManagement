const express = require('express');
const { authorize } = require('../middleware/authorize')
const { roles } = require('../utils/constants')
const {
  createTask,
  getTasks,
  updateTask,
  updateTaskStatus,
  deleteTask
} = require('../controllers/task');

const router = express.Router();

router.route('/')
  .get(authorize(), getTasks)
  .post(authorize([roles.OWNER]), createTask)

router.route('/:id')
  .put(authorize([roles.OWNER]), updateTask)
  .delete(authorize([roles.OWNER]), deleteTask)

router.route('/:id/status')
  .put(authorize(), updateTaskStatus)

module.exports = router;

