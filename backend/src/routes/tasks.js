const express = require('express');
const { pool } = require('../db');

const STATUSES = new Set(['todo', 'in_progress', 'done']);

const router = express.Router();

function mapRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    created_at: row.created_at.toISOString(),
  };
}

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, title, description, status, created_at FROM tasks ORDER BY created_at DESC'
    );
    res.json(result.rows.map(mapRow));
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const title = req.body && typeof req.body.title === 'string' ? req.body.title.trim() : '';
    if (!title) {
      const err = new Error('title is required');
      err.statusCode = 400;
      err.expose = true;
      throw err;
    }
    let description = '';
    if (req.body.description != null) {
      if (typeof req.body.description !== 'string') {
        const err = new Error('description must be a string');
        err.statusCode = 400;
        err.expose = true;
        throw err;
      }
      description = req.body.description;
    }
    let status = 'todo';
    if (req.body.status != null) {
      if (!STATUSES.has(req.body.status)) {
        const err = new Error('invalid status');
        err.statusCode = 400;
        err.expose = true;
        throw err;
      }
      status = req.body.status;
    }
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status)
       VALUES ($1, $2, $3)
       RETURNING id, title, description, status, created_at`,
      [title, description, status]
    );
    res.status(201).json(mapRow(result.rows[0]));
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      const err = new Error('invalid id');
      err.statusCode = 400;
      err.expose = true;
      throw err;
    }
    if (!req.body || typeof req.body.status !== 'string' || !STATUSES.has(req.body.status)) {
      const err = new Error('status is required and must be todo, in_progress, or done');
      err.statusCode = 400;
      err.expose = true;
      throw err;
    }
    const result = await pool.query(
      `UPDATE tasks SET status = $1 WHERE id = $2
       RETURNING id, title, description, status, created_at`,
      [req.body.status, id]
    );
    if (result.rowCount === 0) {
      const err = new Error('Task not found');
      err.statusCode = 404;
      err.expose = true;
      throw err;
    }
    res.json(mapRow(result.rows[0]));
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      const err = new Error('invalid id');
      err.statusCode = 400;
      err.expose = true;
      throw err;
    }
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      const err = new Error('Task not found');
      err.statusCode = 404;
      err.expose = true;
      throw err;
    }
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

module.exports = router;
