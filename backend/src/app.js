const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const tasksRouter = require('./routes/tasks');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

const origin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin }));
app.use(express.json());
app.use('/tasks', tasksRouter);

app.use(errorHandler);

module.exports = app;
