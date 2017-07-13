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
          createIndexLinks();
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
              <link rel="stylesheet" href="/public/css/styles.css">
            </head>
            <body>
              <h1>${body.elementName}</h1>
              <h2>${body.elementSymbol}</h2>
              <h3>Atomic number ${body.elementAtomicNumber}</h3>
              <p>${body.elementDescription}</p>
              <p><a href="/public/index.html">back</a></p>
            </body>
            </html>`;
            fs.writeFile('./public/'+fileName, newFile, (err) => { // Create file
              if(err) throw err;
            });
            // Response body for POST
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end('{"success" : true}');
            // Update index.html
            createIndexLinks();
          }
        });
      });
    } else {
      // Response body for PUT
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(`{ "error" : "resource ${req.url} does not exist" }`);
    }
  //PUT METHOD
  } else if(req.method === 'PUT') {
    req.on('data', (chunk) => {
      body = chunk.toString();
      body = queryString.parse(body);
      fs.exists("."+req.url, (exists) => {
        if(exists || !exists) {
          newFile = `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>The Elements - ${body.elementName}</title>
            <link rel="stylesheet" href="/public/css/styles.css">
          </head>
          <body>
            <h1>${body.elementName}</h1>
            <h2>${body.elementSymbol}</h2>
            <h3>Atomic number ${body.elementAtomicNumber}</h3>
            <p>${body.elementDescription}</p>
            <p><a href="/public/index.html">back</a></p>
          </body>
          </html>`;
          fs.writeFile("."+req.url, newFile, (err) => { // Create file
            if(err) throw err;
          });
          // Response body for POST
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end('{"success" : true}');
          if(exists) {
            //
          } else { //file doesn't exist create new link
            // Update index.html
            createIndexLinks();
          }
        } else {
          // Response body for PUT
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(`{ "error" : "resource ${req.url} does not exist" }`);
        }
      });
    });
  //DELETE METHOD
  } else if(req.method === 'DELETE') {
    fs.exists("."+req.url, (exists) => {
      if(exists) {
        fs.unlink("."+req.url, () => {
          // Response body for DELETE
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end('{"success" : true}');
          createIndexLinks();
        });
      } else {
        // Response body for PUT
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(`{ "error" : "resource ${req.url} does not exist" }`);
      }
    });
  }

  function createIndexLinks() {
    var links = "";
    fs.readdir('./public/', 'utf8', (err, file) => {
      file = file.filter((val) => {
        return val !== 'index.html' && val !== '404.html' && val.includes('.html');
      });
      for(var i = 0; i < file.length; i++) {
        links += `
        <li>
          <a href="/public/${file[i]}">${file[i].slice(0, -5)}</a>
        </li>`;
      }

      var newIndex = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>The Elements</title>
        <link rel="stylesheet" href="/public/css/styles.css">
      </head>
      <body>
        <h1>The Elements</h1>
        <h2>These are all the known elements.</h2>
        <h3>These are 2</h3>
        <ol>
          ${links}
        </ol>
      </body>
      </html>`;

      fs.writeFileSync('./public/index.html', newIndex, 'utf8');
    });
  }
}).listen(8080);