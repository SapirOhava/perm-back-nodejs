const express = require('express');
const cors = require('cors');
const app = express();
// by using the pool , we can run queries with postgres
const pool = require('./db');

//middleware
app.use(cors());
app.use(express.json());

//ROUTES//

//create a todo
app.post('/todos', async (req, res) => {
  try {
    const { description } = req.body;
    // thats how i write postgres query
    const newTodo = await pool.query(
      'INSERT INTO todo (description) VALUES($1)',
      [description]
    );
    res.json(newTodo);
  } catch (err) {
    console.log(err.message);
  }
});
//get all todos

//get a todo

//update a todo

//delete a todo

app.listen(5000, () => {
  console.log('server has started on port 5000');
});
