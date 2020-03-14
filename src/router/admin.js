const express = require("express");
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');


router.patch('/su-users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "age", "email"];
    const IsValidOpertion = updates.every(update => allowedUpdates.includes(update));
    if (!IsValidOpertion) {
        return res.status(400).send({ error: 'Invalid Update!' });
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user)
            return res.status(404).send();
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.delete('/su-users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user)
            return res.status(404).send();
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.get('/su-users', async (req, res) => {

    try {
        const users = await User.find({});
        res.status(200).send(users)
    }
    catch (err) {
        res.status(400).send(err);
    }
})

router.get('/su-users/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user)
            return res.status(404).send();
        res.status(200).send(user);
    }
    catch (err) {
        res.status(500).send();
    }
})

module.exports = router;
