const http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    mime = require("mime")
    WebSocket = require('ws');

const HTTP_PORT = 8080;
const WEBSOCKET_PORT = 8081;
const WebsocketClientCode = fs.readFileSync(path.join(__dirname, 'websocket-client.js'));

const wss = new WebSocket.Server({port: WEBSOCKET_PORT});

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);

  // console.log('==> pathname\n',uri);
  // console.log(process.cwd());
  // console.log('==> filename\n', filename);
  fs.access(filename, function(err) {
    if(err) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

	  if (fs.statSync(filename).isDirectory()) filename += '/index.html';
    console.log(filename);
    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      if(filename.endsWith('.html')) {
        file = `${file.toString()}\n\n<script>${WebsocketClientCode}</script>`
      }
      response.writeHead(200, {"Content-Type": mime.getType(filename)});
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(HTTP_PORT, function(err) {
  if(err) {
    console.log("Server couldn't be started!!")
  }
  console.log("Static file server running at\n  => http://localhost:" + HTTP_PORT + "/\nCTRL + C to shutdown");
});
