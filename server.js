/*jshint esversion: 6 */
const http = require('http');
const fs = require('fs');
const queryString = require('query-string');

var newFile = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements - ${body.elementName}</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>${body.elementName}</h1>
  <h2>${body.elementSymbol}</h2>
  <h3>Atomic number ${body.elementAtomicNumber}</h3>
  <p>${body.elementDescription}</p>
  <p><a href="/">back</a></p>
</body>
</html>`;

var header, body;
const server = http.createServer((req, res) => {
  if(req.method === 'GET') {
    fs.exists("."+req.url, (exists) => {
      if(exists) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        body = fs.readFileSync("."+req.url, 'utf8');
        res.end(body);
      } else {
        res.statusCode = 404;
        body = fs.readFileSync("./public/404.html", 'utf8');
        res.end(body);
      }
    });
  } else if(req.method === 'POST') {
    if(req.url === "/elements") {
      var body, fileName;
      req.on('data', (chunk) => {
        body = chunk.toString();
        body = queryString.parse(body);
        fileName = body.elementName + ".html";
        fs.exists("./public/"+fileName, (exists) => {
          if(!exists) {
            fs.writeFile('./public/'+fileName, newFile, (err) => {
              if(err) throw err;
            });
          }
          //send diff status code
        });
      });

    }
  }
}).listen(8080);