'use strict'

const express = require('express');
const cors =    require('cors');
const pg =      require('pg');

const app = express();
const PORT = process.env.PORT;
console.log(`found port ${PORT}`)


const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());

app.get('/', (req, res) => res.send('Testing - 1, 2, 3'));



//API Endpoints
// app.get('https://www.googleapis.com/books/v1/volumes?q=harry+potter+stone', (req, res) => {
  app.get('/api/v1/books', (req, res) => {
    client.query('SELECT book_id, title, author, image_url FROM books')
    .then (result => {
      res.send(result.rows)
      console.log(result);
      console.log(req);
    })
  });
  
  
app.get('*', (req, res) => res.status(403).send('This is not the route you\'re looking for.'));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// export PORT=3000

// Mac:
// DATABASE_URL='postgres://localhost:5432/books_app'

// Windows:
// export DATABASE_URL='postgres://USER:PASSWORD@localhost:5432/task_app'