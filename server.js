'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

const port = 8080;

const todoList = [
  {
    name: 'Some text here',
    completed: false,
    id: "1",
  },
  {
    name: 'Jingle Bells',
    completed: true,
    id: "2",
  },
  {
    name: 'AC/DC',
    completed: false,
    id: "3",
  }
];


const httpSever = http.createServer(function(req, res) {
  const method = req.method;
  const parsedURL = url.parse(req.url);
  const query = querystring.parse(parsedURL.query);
  if(method === 'GET') {
    switch(parsedURL.pathname) {
      case '/index.html': case '/main.css': case '/main.js': case '/jquery.js':
      case '/favicon.ico': //done for security reasons :)
        const actualLocation = path.join('./public', req.url);
        fs.readFile(actualLocation, function(err, data) {
          if(err) {
            res.writeHead(404, 'Not Found');
            res.end('Error 404: Not Found');
          }
          res.statusCode = 200;
          res.end(data);
        });
        break;
      case '/todos':
        res.setHeader('Content-Type', 'application/json');
        let filteredList = todoList;
        if(query.searchtext) {
            filteredList = todoList.filter(function(currentElement) {
            return currentElement.name.indexOf(query.searchtext) >= 0;
          });
        }
        res.end(JSON.stringify({items : filteredList}));
        break;
      default:
        break;
    }
  }
  if(method === 'POST') {
    if(req.url.indexOf('/todos') === 0) {
      let messageContainer = '';
      req.on('data', function (chunk) {
          messageContainer += chunk;
      });
      req.on('end', function () {
          let newTodo = JSON.parse(messageContainer);
          todoList[todoList.length] = newTodo;
          newTodo.id = todoList.length.toString();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(newTodo));
      });
    }
  }

  if(method === 'PUT') {
   if(req.url.indexOf('/todos') === 0) {
     let messageContainer = '';
     req.on('data', function (chunk) {
         messageContainer += chunk;
     });
     req.on('end', function () {
         let currentTodo = JSON.parse(messageContainer);
         for(let i = 0; i < todoList.length; i++) {
             if(todoList[i].id === currentTodo.id) {
               todoList[i] = currentTodo;
               res.setHeader('Content-Type', 'application/json');
               return res.end(JSON.stringify(currentTodo));
             }
         }
         res.statusCode = 404;
         res.end('Data was not found and can therefore not be updated');
     });
   }
  }

  if(method === 'DELETE') {
    if(req.url.indexOf('/todos/') === 0) {
      const id = req.url.substr(7);
      for(let i = 0; i < todoList.length; i++) {
       if(id === todoList[i].id) {
         todoList.splice(i, 1);
         res.statusCode = 200;
         return res.end('Successfully removed');
       }
      }
      res.statusCode = 404;
      res.end('Data was not found');
    }
  }
});

httpSever.listen(port, function(){
  console.log(`Server started on port ${port}. Check localhost:${port}`)
});
