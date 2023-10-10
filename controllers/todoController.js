// by using the pool , we can run queries with postgres
const pool = require('../db');

//create a todo
exports.postTodo = async (req, res) => {
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
};
//get all todos

exports.getAllTodos = async (req, res) => {
  try {
    const allTodos = await pool.query('SELECT * FROM todo');
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//get a todo
exports.getTodo = async (req, res) => {
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
};

//update a todo
exports.updateTodo = async (req, res) => {
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
};
//delete a todo
exports.deleteTodo = async (req, res) => {
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
};
