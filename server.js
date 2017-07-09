/*jshint esversion: 6 */
const http = require('http');
const fs = require('fs');

var header, body;
const server = http.createServer((req, res) => {
  if(req.method === 'GET') {
    fs.exists("."+req.url, (exists) => {
      if(exists) {
        res.statusCode = 200;
        // res.setHeader('Content-Type', 'text/html');
        body = fs.readFileSync("."+req.url, 'utf8');
        console.log(body);
        // res.write(body);
        // res.end();
      } else {
        res.statusCode = 404;
        body = fs.readFileSync("./public/404.html", 'utf8');
        console.log(body);
        // res.write(body);
        // res.end();
      }
    });
  } else if(req.method === 'POST') {

  }
  res.end();
}).listen(8080);