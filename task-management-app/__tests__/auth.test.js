import request from 'supertest';
import app from '../server.js'; // Assuming your Express app instance is exported from server.js
import User from '../models/User.js';
import mongoose from 'mongoose';
import dbConfig from '../config/db.js'; // Adjust path as needed

// Connect to the database before all tests
beforeAll(async () => {
  await mongoose.connect(dbConfig.primary.url, dbConfig.primary.options);
});

// Clear the user database after each test to ensure isolation
afterEach(async () => {
  await User.deleteMany({});
});

// Disconnect from the database after all tests
afterAll(async () => {
  await mongoose.disconnect();
});

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };
    const res = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('name', userData.name);
    expect(res.body.user).toHaveProperty('userId');

    const userInDb = await User.findOne({ email: userData.email });
    expect(userInDb).toBeDefined();
    expect(userInDb.email).toBe(userData.email);
  });

  it('should login an existing user', async () => {
    // First, register a user
    const registerData = {
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'loginpassword',
    };
    await request(app).post('/api/auth/register').send(registerData).expect(201);

    // Then, attempt to login
    const loginData = {
      email: 'existing@example.com',
      password: 'loginpassword',
    };
    const res = await request(app)
      .post('/api/auth/login')
      .send(loginData)
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('name', registerData.name);
    expect(res.body.user).toHaveProperty('userId');
  });

  it('should return 401 for invalid login credentials', async () => {
    const loginData = {
      email: 'nonexistent@example.com',
      password: 'wrongpassword',
    };
    await request(app)
      .post('/api/auth/login')
      .send(loginData)
      .expect(401);

    expect(res.body).toHaveProperty('message', 'Invalid Credentials');
  });
});