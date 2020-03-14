const express = require('express');
const router = new express.Router();
const Task = require('../models/task');

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).send(tasks);
    }
    catch (err) {
        res.status(500).send(err);
    }
})

router.get('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const task = await Task.findById(id);
        if (!task)
            return res.status(404).send();
        res.status(200).send(task);
    }
    catch (err) {
        res.status(500).send();
    }
})

router.patch("/tasks/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const IsValidOpertion = updates.every(update => allowedUpdates.includes(update));
    if (!IsValidOpertion)
        return res.status(400).send({ error: "Invalid Updates!" });
    try {
        const task = await Task.findById(req.params.id);
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task)
            return res.status(404).send();
        res.status(200).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task)
            return res.status(404).send();
        res.status(200).send(task);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;