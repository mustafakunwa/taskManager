const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { testUserId, testUser, InitializeDataBase } = require('./fixtures/db');
beforeEach(InitializeDataBase);

test('Should signup a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Mustafa',
            email: 'm.kunwa@gmail.com',
            password: 'XYZxyz@123'
        })
        .expect(201)

    //Check that DB has a user
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    //Check Response
    console.log(response.body)
    expect(response.body).toMatchObject({
        user: {
            name: 'Mustafa',
            email: 'm.kunwa@gmail.com',
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('XYZxyz@123')
});

test('Should able to login', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: testUser.email,
            password: testUser.password
        })
        .expect(200);
    const user = await User.findById(testUserId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: testUser.email,
            password: '123456789'
        })
        .expect(400)
})

test('Should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get user profile failed auth', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete user profile', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(testUserId);
    expect(user).toBeNull()
})

test('Should not delete user profile failed auth', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/o-MESUT-OZIL-facebook.jpg')
        .expect(200)
    const user = await User.findById(testUserId);
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update users profile', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({ name: 'Mustafaaaa' })
        .expect(200);

    const user = await User.findById(testUserId);
    expect('Mustafaaaa').toBe(user.name);
})

test('Should not update users profile Invalid field', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({ name: 'Mustafaaaa', gender: 'Male' })
        .expect(400);
})