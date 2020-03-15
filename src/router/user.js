const express = require("express");
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateToken();
        return res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    };
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateToken();
        return res.status(200).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token != req.token)
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user);
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.status(200).send(req.user);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "age", "password", "email"];
    const IsValidOpertion = updates.every(update => allowedUpdates.includes(update));
    if (!IsValidOpertion) {
        return res.status(400).send({ error: 'Invalid Update!' });
    }
    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();        
        res.status(200).send(req.user);
    } catch (err) {
        res.status(400).send(err);
    }
})


module.exports = router;