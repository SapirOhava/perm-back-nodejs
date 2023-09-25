const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
// by using the pool , we can run queries with postgres
const pool = require('./db');
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');
const axios = require('axios');
const { topics } = require('./constants');
const PORT = process.env.PORT;

//middleware
app.use(cors());
app.use(express.json());

//ROUTES//
app.get('/test', async (req, res) => {
  return res.send('<h1>sapir love</h1>');
});
//get the xml data from web scraping google news ( by a topic)
app.get('/news/:topic', async (req, res) => {
  try {
    const parser = new XMLParser();
    const response = await axios({
      method: 'get',
      url: topics[req.params.topic].url,
      headers: { 'Content-Type': 'application/xml' },
    });
    const data = parser.parse(response.data);
    res.json(data.rss.channel.item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//create a todo
app.post('/todos', async (req, res) => {
  try {
    const { description } = req.body;
    // thats how i write postgres query
    const newTodo = await pool.query(
      'INSERT INTO todo (description) VALUES($1) RETURNING *',
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//get all todos

app.get('/todos', async (req, res) => {
  try {
    const allTodos = await pool.query('SELECT * FROM todo');
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//get a todo

app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [
      id,
    ]);
    res.json(todo.rows[0]);
  } catch (error) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//update a todo
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      'UPDATE todo SET description = $1 WHERE todo_id = $2',
      [description, id]
    );
    res.json('Todo was updated!');
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await pool.query(
      'DELETE FROM todo WHERE todo_id =  $1',
      [id]
    );
    res.json('Todo was deleted!');
  } catch (error) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
