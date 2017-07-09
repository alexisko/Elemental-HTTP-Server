/*jshint esversion: 6 */
const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {

  res.end();
}).listen(8080);