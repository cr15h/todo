const db = require('../model/tasksdb').promise();
const { newPostValidation, deleteValidation, updateValidation } = require('../validation/tasksValidation');

exports.home = (req, res) => {
    res.sendFile("index.html", { root: "./views" });
};

exports.getTask = async (req, res) => {
    const results = await db.query("SELECT id, taskTitle, taskDescription FROM todo")
        .catch((err) => {
            res.status(500).json({ error: "Internal error" });
        });
    res.status(200).json(results[0]);
    // console.log("results", results);
};

exports.createTask = async (req, res) => {
    try {
        const data = req.body;
        const { error } = newPostValidation(data);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { taskTitle, taskDescription } = data;

        if (!taskTitle && !taskDescription) {
            return res.status(400).json({ message: "No fields to insert" });
        }

        await db.query("INSERT INTO todo (taskTitle, taskDescription) VALUES (?, ?)",
            [taskTitle, taskDescription]);
        res.status(201).json({ message: 'New task created successfully' });
    } catch (err) {
        res.status(500).json({ message: "Failed to create task" });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id: deleteId } = req.params;
        const { error } = deleteValidation({ deleteId });

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const result = await db.query("DELETE FROM todo WHERE id=?", [deleteId]);
        // console.log(result);
        if (result[0].affectedRows === 0) {
            throw new Error("Task not found");
        }
        res.status(202).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id: updateId } = req.params;
        const data = req.body;
        
        let taskTitle = data.taskTitle;
        let taskDescription = data.taskDescription;
        
        const { error } = updateValidation({ updateId, taskTitle, taskDescription });
        if (error) {
            // console.log(error);
            return res.status(400).json({ message: error.details[0].message });
        }

        if (taskTitle) {
            taskTitle = taskTitle.trim();
        }

        const existingTask = await db.query("SELECT taskTitle, taskDescription FROM todo WHERE id = ?", [updateId]);
        if (existingTask[0].length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        // to check if the taskTitle or taskDescription is empty or undefined, thereby setting it to existing data
        if (!taskTitle) {
            taskTitle = existingTask[0][0].taskTitle;
        }
        if (!taskDescription) {
            taskDescription = existingTask[0][0].taskDescription;
        }

        if (taskTitle === " " || taskTitle === "" || taskTitle === undefined) {
            return res.status(400).json({ message: "Task cannot be empty" });
        }

        const result = await db.query(
            "UPDATE todo SET taskTitle=?, taskDescription=? WHERE id=?",
            [taskTitle, taskDescription, updateId]
        );

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to update task" });
    }
};
