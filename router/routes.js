const express = require('express');

const router = express.Router();
const controller = require('../controller/taskscontroller')

router.get("/", controller.home);

router.get("/api/tasks", controller.getTask);
router.post("/api/tasks", controller.createTask);
router.delete("/api/tasks/:id", controller.deleteTask);
router.put("/api/tasks/:id", controller.updateTask);

module.exports = router;
