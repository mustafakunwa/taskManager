const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    }
    catch (err) {
        res.status(400).send(err);
    }
})
//Get /tasks?completed?true
//Get ?limit=10&page=0
//Get ?sortBy=createdAt&sortOrder=asc
router.get('/tasks', auth, async (req, res) => {
    try {
        const skip=parseInt(req.query.limit)*parseInt(req.query.page);
        const match = {};
        const sort = {};
        if (req.query.completed) {
            match.completed = req.query.completed === 'true';
        }
        if (req.query.sortBy) {
            sort[req.query.sortBy] = req.query.sortOrder === 'asc' ? 1 : -1;
        }

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: skip,
                sort
            }
        }).execPopulate();
        res.status(200).send(req.user.tasks);
        // Alternative
        // const tasks = await Task.find({ owner: req.user._id });
        // res.status(200).send(tasks);

    }
    catch (err) {
        res.status(500).send(err);
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        const task = await Task.findOne({ _id: id, owner: req.user._id });
        if (!task)
            return res.status(404).send();
        res.status(200).send(task);
    }
    catch (err) {
        res.status(500).send();
    }
})

router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const IsValidOpertion = updates.every(update => allowedUpdates.includes(update));
    if (!IsValidOpertion)
        return res.status(400).send({ error: "Invalid Updates!" });
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task)
            return res.status(404).send();
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        res.status(200).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task)
            return res.status(404).send();
        res.status(200).send(task);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;