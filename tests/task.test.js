const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const { taskOne, testUser, testUser2, InitializeDataBase } = require('./fixtures/db');
beforeEach(InitializeDataBase);


test('Should Create task for User', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({ description: 'test Task' })
        .expect(201)
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false)
})

test('Should Retrive user one task', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Should fail delete other user task', async () => {
    const response = await request(app)
        .delete('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${testUser2.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
})