const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const https = require("https");
const fs = require("fs");

const httpServer = http.createServer((req, res) => {
 unifiedServer(req,res);
});

let httpsServerOptions = {
  "key" : fs.readFileSync("https/key.pem"),
  "cert" : fs.readFileSync("https/cert.pem")
};

const httpsServer = https.createServer(httpsServerOptions,(req,res)=>{
 unifiedServer(req,res);
});

httpServer.listen(config.httpPort, () => console.log("listening to port "+config.httpPort));

httpsServer.listen(config.httpsPort, () => console.log("listening to port "+config.httpsPort));

let unifiedServer = (req,res)=>{

  let headers = req.headers;
  let parsedUrl = new URL(`http://${headers.host}${req.url}`);
  let path = parsedUrl.pathname;
  let method = req.method.toLowerCase();
  let queryString = Object.fromEntries(parsedUrl.searchParams.entries());
  let trimmedPath = path.replace(/^\/+|\/+$/g, "");
  let decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", (data) => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();
    let chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;
    let data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryString,
      method: method,
      headers: headers,
      payloads: buffer,
    };

    chosenHandler(data, function (statusCode, payload) {
      statusCode = typeof statusCode == "number" ? statusCode : 200;
      payload = typeof payload == "object" ? payload : {};
      let payloadString = JSON.stringify(payload);
      res.setHeader("Content-Type","application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("returning this response : ", payloadString, statusCode);
    });
  });
};



//define the handlers
let handlers = {};

handlers.ping = (data,callback)=>{
  callback(200);
};
handlers.notFound = (data, callback) => {
  callback(404);
};

//define a request router

let router = {
  ping : handlers.ping 
};
