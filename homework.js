const http = require("http");

let server = http.createServer((req, res) => {
  let parsedUrl = new URL(`http://${req.headers.host}${req.url}`);
  let path = parsedUrl.pathname.replace(/^\/+|\/+$/g, "");

  let chosenHandler =
    typeof router[path] !== "undefined" ? router[path] : handler.notFound;

  chosenHandler((statusCode, message) => {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(message));
  });
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});

let handler = {};

handler.hello = function (callback) {
  callback(200, { hello: "back" });
};

handler.notFound = function (callback) {
  callback(404, { eror: "notFound" });
};
let router = {
  hello: handler.hello,
};

//Please create a simple "Hello World" API. Meaning:

//1. It should be a RESTful JSON API that listens on a port of your choice.

//2. When someone sends an HTTP request to the route /hello, you should return a welcome message, in JSON format.
// This message can be anything you want.
