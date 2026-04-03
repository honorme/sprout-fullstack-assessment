const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

const { expect } = require('chai');
const request = require('supertest');
const { pool } = require('../backend/src/db');
const app = require('../backend/src/app');

describe('Tasks API', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM tasks');
  });

  after(async () => {
    await pool.end();
  });

  it('creates a task and returns id and created_at', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Alpha', description: 'first' })
      .expect(201);

    expect(res.body).to.have.property('id');
    expect(res.body.title).to.equal('Alpha');
    expect(res.body.description).to.equal('first');
    expect(res.body.status).to.equal('todo');
    expect(res.body.created_at).to.be.a('string');
  });

  it('lists tasks after create', async () => {
    await request(app).post('/tasks').send({ title: 'One' }).expect(201);
    await request(app).post('/tasks').send({ title: 'Two' }).expect(201);

    const res = await request(app).get('/tasks').expect(200);

    expect(res.body).to.be.an('array');
    expect(res.body).to.have.length(2);
    const titles = res.body.map((t) => t.title).sort();
    expect(titles).to.deep.equal(['One', 'Two']);
  });

  it('updates task status', async () => {
    const created = await request(app)
      .post('/tasks')
      .send({ title: 'Move me' })
      .expect(201);

    const id = created.body.id;
    const res = await request(app)
      .put(`/tasks/${id}`)
      .send({ status: 'in_progress' })
      .expect(200);

    expect(res.body.status).to.equal('in_progress');
    expect(res.body.id).to.equal(id);
  });
});
