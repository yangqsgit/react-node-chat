
const { WebSocketServer } = require('ws')
const types = {
  MESSAGE: 'MESSAGE',
  UPDATE_USER_STATUS: 'UPDATE_USER_STATUS',
  CREATE_GROUP: 'CREATE_GROUP'
}
const wsMap = {}
const sessionMap = {}

function getParam(req, key) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const params = new URLSearchParams(url.search)
  return params.get(key)
}
// 简易生成id
function genID(type) {
  return type + '_' + new Date().getTime()
}
function createMsg({ type, status = 'success' }) {
  return {
    type,
    status,
    id: genID(type)
  }
}
function handleMsg(data, userId) {
  let msg = null
  switch (data.type) {
    case types.DELEET_SESSION: { }
    case types.OPEN_SESSION: {
    }
    case types.MESSAGE: { }
  }
  if (msg) wsMap[userId].send(JSON.stringify(msg))
}

const wss = new WebSocketServer({ port: 7979 });

wss.on('connection', function connection(ws, req) {
  const userId = getParam(req, 'userId')
  // 记录连接的用户
  wsMap[userId] = ws

  ws.on('error', console.error);
  ws.on('message', function message(data) {
    // console.log('received: %s', data)
    handleMsg(JSON.parse(data), userId)
  });

  // ws.send('something');
});
