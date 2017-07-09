/*jshint esversion: 6 */
const http = require('http');
const fs = require('fs');
const queryString = require('query-string');

var body, index;
const server = http.createServer((req, res) => {
  //GET METHOD
  if(req.method === 'GET') {
    fs.exists("."+req.url, (exists) => {
      if(exists) { // If file exists, return html file in response body
        if(req.url === '/public/css/styles.css') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/css');
          body = fs.readFileSync("."+req.url, 'utf8');
          res.end(body);
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          body = fs.readFileSync("."+req.url, 'utf8');
          res.end(body);
        }
      } else { //If file does not exist, return 404.html file in response body
        res.statusCode = 404;
        body = fs.readFileSync("./public/404.html", 'utf8');
        res.end(body);
      }
    });
  //POST METHOD
  } else if(req.method === 'POST') {
    if(req.url === "/elements") { // User needs to specifiy /elements path
      var fileName, newFile, newLink;
      req.on('data', (chunk) => { // Read in request body
        body = chunk.toString();
        body = queryString.parse(body);
        fileName = body.elementName.toLowerCase() + ".html";
        fs.exists("./public/"+fileName, (exists) => {
          if(!exists) { // If the file does ot exist, create a new file
            newFile = `<!DOCTYPE html>
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
            fs.writeFile('./public/'+fileName, newFile, (err) => { // Create file
              if(err) throw err;
            });
            // Response body for POST
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end('{"success" : true}');
            //Update index.html
            // index = fs.readFileSync('./public/index.html', 'utf8');
            // index = index.split("\n");
            // newLink =  `
            // <li>
            //   <a href="public/${fileName}">${body.elementName}</a>
            // </li>`;
            // console.log("INDEX.HTML "+index);
          }
          //send diff status code
        });
      });
    }
  } else if(req.method === 'PUT') {

  } else if(req.method === 'DELETE') {

  }
}).listen(8080);