import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { User } from '../src/models/user.model.js';

let mongod;
let agent;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { });
  agent = request.agent(app);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth flow', () => {
  test('register -> login -> get current user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password1!',
      birthDate: '1990-01-01'
    };

    // Register
    const regRes = await agent.post('/api/users/register').send(userData);
    expect(regRes.status).toBe(201);
    expect(regRes.body.success).toBe(true);
    expect(regRes.body.data.email).toBe(userData.email);

    // Login
    const loginRes = await agent.post('/api/users/login').send({ email: userData.email, password: userData.password });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);

    // Get current user (should send cookies via agent)
    const meRes = await agent.get('/api/users/me');
    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe(userData.email);
  });

  test('admin cannot be deactivated', async () => {
    // create two admin users directly
    const admin1 = await User.create({ name: 'Admin One', email: 'a1@example.com', password: 'Password1!', birthDate: '1990-01-01', role: 'admin' });
    const admin2 = await User.create({ name: 'Admin Two', email: 'a2@example.com', password: 'Password1!', birthDate: '1990-01-01', role: 'admin' });

    // login as admin1
    await agent.post('/api/users/login').send({ email: 'a1@example.com', password: 'Password1!' });

    // attempt to deactivate admin2
    const res = await agent.put(`/api/users/deactivate/${admin2._id}`).send();
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Cannot deactivate an admin user/i);
  });
});
