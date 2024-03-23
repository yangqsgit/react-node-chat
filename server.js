

const { WebSocketServer }  = require('ws')
const wss = new WebSocketServer({ port: 7971});
process.on('exit',()=>{
  console.log('exit')
})
wss.on('connection', function connection(ws) {
  console.log(ws.url);
  ws.on('error', console.error);
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});
