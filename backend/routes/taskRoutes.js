const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// CREATE TASK
// POST /api/tasks
// ==========================================
router.post("/", protect, async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            dueDate
        } = req.body;

        // Check title
        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        // Create task
        const task = await Task.create({
            title: title.trim(),
            description: description || "",
            status: status || "pending",
            priority: priority || "medium",
            dueDate: dueDate || null,
            user: req.userId
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        console.error("Create task error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==========================================
// GET ALL TASKS
// GET /api/tasks
// ==========================================
router.get("/", protect, async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.userId
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            message: "Tasks fetched successfully",
            tasks
        });

    } catch (error) {
        console.error("Get tasks error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==========================================
// GET ONE TASK
// GET /api/tasks/:id
// ==========================================
router.get("/:id", protect, async (req, res) => {
    try {

        // Check valid MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task fetched successfully",
            task
        });

    } catch (error) {
        console.error("Get task error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==========================================
// UPDATE TASK
// PUT /api/tasks/:id
// ==========================================
router.put("/:id", protect, async (req, res) => {
    try {

        // Check valid MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const {
            title,
            description,
            status,
            priority,
            dueDate
        } = req.body;

        // Find task belonging to logged-in user
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }


        // Update title
        if (title !== undefined) {

            if (!title.trim()) {
                return res.status(400).json({
                    message: "Task title cannot be empty"
                });
            }

            task.title = title.trim();
        }


        // Update description
        if (description !== undefined) {
            task.description = description;
        }


        // Update status
        if (status !== undefined) {
            task.status = status;
        }


        // Update priority
        if (priority !== undefined) {
            task.priority = priority;
        }


        // Update due date
        if (dueDate !== undefined) {
            task.dueDate = dueDate || null;
        }


        // Save changes
        const updatedTask = await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask
        });

    } catch (error) {
        console.error("Update task error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==========================================
// DELETE TASK
// DELETE /api/tasks/:id
// ==========================================
router.delete("/:id", protect, async (req, res) => {
    try {

        // Check valid MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        // Find task belonging to logged-in user
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }


        // Delete task
        await Task.deleteOne({
            _id: req.params.id,
            user: req.userId
        });


        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        console.error("Delete task error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;