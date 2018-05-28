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
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => res.send('Testing - 1, 2, 3'));

//API Endpoints
  app.get('/api/v1/books', (req, res) => {
   
    
    client.query('SELECT book_id, title, author, image_url FROM books')
    .then (result => {
      res.send(result.rows)
    })
  });

  app.get('/api/v1/books/:book_id', (req, res) => {
    console.log('in route');
    client.query(`SELECT * FROM books WHERE book_id=${req.params.book_id}`)
    .then (result => {
      res.send(result.rows)
      console.log(`This is a single book: ${result}`);
      // console.log(result);
    })
  });

  
  app.post('/api/v1/books', (req, res) => {
    console.log(req.body);
    let {title, author, isbn, image_url, description} = req.body;
    let SQL = `INSERT INTO books(title, author, isbn, image_url, description)
    VALUES($1, $2, $3, $4, $5)`;
    let values = [title, author, isbn, image_url, description];
    client.query(SQL, values)
    .then(res.sendStatus(201))
    .catch(console.error)
  });

  app.delete('/api/v1/books/:book_id', (req, res) => {
    console.log(req);
    // console.log(res);
    console.log('A book is being deleted');
    let SQL = `DELETE FROM books WHERE book_id=$1;`;
    let values = [req.body.id];
    console.log(req.body.id)
    
    client.query(SQL, values)
    .then (result => {
      res.send(result)
      console.log(result.rows)
    })
    .catch(console.error('The book delete server side did not behave as expected'))
  })

  
app.get('*', (req, res) => res.status(403).send('This is not the route you\'re looking for.'));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// export PORT=3000

// Mac:
// export DATABASE_URL=postgres://localhost:5432/books_app

// Windows:
// export DATABASE_URL='postgres://USER:PASSWORD@localhost:5432/task_app'
