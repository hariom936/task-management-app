import request from 'supertest';
import app from '../server.js'; // Assuming your Express app instance is exported from server.js
import User from '../models/Task.js';
import mongoose from 'mongoose';
import dbConfig from '../config/db.js'; // Adjust path as needed


let authToken;
let testUserId;

// Connect to the database and create a test user before all tests
beforeAll(async () => {
  await mongoose.connect(dbConfig.primary.url, dbConfig.primary.options);

  const testUser = await User.create({
    name: 'Test User',
    email: 'testfortasks@example.com',
    password: 'testpassword',
  });
  testUserId = testUser._id;
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'testfortasks@example.com', password: 'testpassword' });
  authToken = loginRes.body.token;
});

// Clear the task database after each test
afterEach(async () => {
  await Task.deleteMany({});
});

// Disconnect from the database after all tests
afterAll(async () => {
  await mongoose.disconnect();
});

describe('Task Endpoints', () => {
  it('should create a new task', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'This is a test task',
      dueDate: '2025-04-26T10:00:00.000Z',
    };
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(taskData)
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('title', taskData.title);

    const taskInDb = await Task.findById(res.body._id);
    expect(taskInDb).toBeDefined();
    expect(taskInDb.title).toBe(taskData.title);
    expect(taskInDb.createdBy.toString()).toBe(testUserId.toString());
  });

  it('should get all tasks for an authenticated user', async () => {
    // Create a couple of tasks first
    await Task.create({ title: 'Task 1', createdBy: testUserId });
    await Task.create({ title: 'Task 2', createdBy: testUserId });

    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should return 401 if trying to access tasks without a token', async () => {
    await request(app).get('/api/tasks').expect(401);
  });

  // Add more tests for get by id, update, delete, etc.
});