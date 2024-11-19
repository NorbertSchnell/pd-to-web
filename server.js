import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import dgram from 'node:dgram';

/****************************************************************
 * http server
 */
const httpPort = Number(process.env.PORT) || 3000;
const app = express();

const httpServer = http
  .createServer(app)
  .listen(httpPort, () => console.log(`HTTP server listening on port ${httpPort}`));

app.use(express.static('.'));

/****************************************************************
 * websoket server
 */
// const webSocketServer = new WebSocket.Server({ server: httpsServer });
const webSocketServer = new WebSocket.Server({ server: httpServer });
console.log(`websocket server listening`);

const clientSockets = new Set();

// listen to new web socket connections
webSocketServer.on('connection', (socket, req) => {
  clientSockets.add(socket);

  // listen to client messages
  socket.on('message', (message) => {
    if (message.length === 0) {
      // receive ping from client and respond with pong message
      socket.send('');
    }
  });

  // remove board (when connection closes)
  socket.on('close', () => {
    clientSockets.delete(socket);
  });
});

/****************************************************************
* UDP Server
*/
const dgramPort = 4000;
const dgramServer = dgram.createSocket('udp4');
dgramServer.on('error', onDgramError);
dgramServer.on('message', onDgramMessage);
dgramServer.on('listening', onDgramListening);
dgramServer.bind(dgramPort);

function onDgramListening() {
  const address = dgramServer.address();
  console.log(`UDP server listening at ${address.address}:${address.port}`);
}

function onDgramMessage(data, info) {
  let str = data.toString();
  let length = str.length;
  let lastChar = str[length - 1];

  while (lastChar === ' ' || lastChar === ',' || lastChar === ';' || lastChar === '\n' || lastChar === '\t') {
    length--;
    lastChar = str[length - 1];
  }

  str = data.toString().substring(0, length);

  for (let socket of clientSockets) {
    socket.send(str);
  }
}

function onDgramError(err) {
  console.error(`UDP server error: ${err.stack}`);
  dgramServer.close();
}

