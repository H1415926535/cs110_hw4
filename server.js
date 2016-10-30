'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 8080;

const todoList = [
  {
    name: 'Some text here',
    completed: false,
    id: 1,
  },
  {
    name: 'Jingle Bells',
    completed: false,
    id: 2,
  },
  {
    name: 'AC/DC',
    completed: false,
    id: 3,
  }
];


const httpSever = http.createServer(function(req, res) {
    const actualLocation = path.join('./public', req.url);
    fs.readFile(actualLocation, function(err, data) {
      if(err) {
        res.writeHead(404, 'Not Found');
        res.end('Error 404: Not Found');
      }
      res.statusCode = 200;
      res.end(data);
    });
    if(req.url === '/todos'){
      res.end(JSON.stringify(todoList));
    }
});

httpSever.listen(port, function(){
  console.log(`Server started on port ${port}. Check localhost:${port}`)
});
