const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const testUserId = new mongoose.Types.ObjectId();
const testUser = {
    _id: testUserId,
    name: 'Mustafa',
    email: 'mustafakunwa151@gmail.com',
    password: 'XYZxyz@123',
    tokens: [{
        token: jwt.sign({ _id: testUserId }, process.env.JWT_SALT)
    }]
}

const testUserId2 = new mongoose.Types.ObjectId();
const testUser2 = {
    _id: testUserId2,
    name: 'tasneem Kanch',
    email: 'tasneem@gmail.com',
    password: 'XYZxyz@123',
    tokens: [{
        token: jwt.sign({ _id: testUserId2 }, process.env.JWT_SALT)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'taskOne',
    owner: testUserId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'taskTwo',
    completed: true,
    owner: testUserId2
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'task Three',
    completed: true,
    owner: testUserId
}

const InitializeDataBase = async () => {
    await User.deleteMany();
    await new User(testUser).save();
    await new User(testUser2).save();

    await Task.deleteMany();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = { testUserId, testUser, testUserId2, testUser2, InitializeDataBase, taskOne, taskTwo, taskThree }