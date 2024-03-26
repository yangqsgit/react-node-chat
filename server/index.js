
const { WebSocketServer } = require('ws')
const types = {
  MESSAGE: 'MESSAGE',
  UPDATE_USER_STATUS: 'UPDATE_USER_STATUS',
  CREATE_GROUP: 'CREATE_GROUP',
  ERROR: 'ERROR'
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
// function createMsg({ type, status = 'success' }) {
//   return {
//     type,
//     status,
//     id: genID(type)
//   }
// }
function createImMsg(msg) {
  const imMsg = {
    type: types.MESSAGE,
    payload: msg,
    id: genID('imMessage_'),
    sendTime: new Date().getTime()
  }
  return imMsg
}
function handleMsg(data, userId) {
  switch (data.type) {
    case types.DELEET_SESSION: { }
    case types.OPEN_SESSION: { }
    case types.MESSAGE: {
      const payload = JSON.parse(data.payload)
      if (payload.sendTo.length && !payload.groupId) {
        payload.sendTo.forEach(i => {
          if (wsMap[i.id ]) {
            wsMap[i.id].send(JSON.stringify(createImMsg(payload)))
          }
        })
      }
    }

  }
  // if (msg) wsMap[userId].send(JSON.stringify(msg))
}

const wss = new WebSocketServer({ port: 7979 });

wss.on('connection', function connection(ws, req) {
  const userId = getParam(req, 'userId')
  // 记录连接的用户
  // if (wsMap[userId]) return
  wsMap[userId] = ws
  ws.on('error', console.error);
  ws.on('message', function message(data) {
    // console.log('received: %s', data)
    handleMsg(JSON.parse(data), userId)
  });

  // ws.send('something');
});
