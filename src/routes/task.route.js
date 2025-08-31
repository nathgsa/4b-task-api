const express = require('express')
const router = express.Router()
const taskController = require('../controllers/task.controller')

router.post('/v1/task', taskController.createTask)
router.get('/v1/task', taskController.getAllTask)
router.get('/v1/task/:task_id', taskController.getTaskById)
router.delete('/v1/task/:task_id', taskController.deleteTaskById)
router.patch('/v1/task/:task_id', taskController.updateTaskById)
router.put('/v1/task/:task_id', taskController.markTaskAsComplete)

module.exports = router