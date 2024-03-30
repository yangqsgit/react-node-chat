
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

// 检查sendTo是否在线上
function checkUserIsOnline(user) {
  return !!wsMap[user.id]
}
function createImMsg(msg, type = types.MESSAGE) {
  const imMsg = {
    type,
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
        if (checkUserIsOnline(payload.sendTo[0])) {
          payload.sendTo.forEach(i => {
            if (wsMap[i.id]) {
              wsMap[i.id].send(JSON.stringify(createImMsg(payload)))
            }
          })
        } else {
          const { nick, userName } = payload.sendTo[0]
          const msg = createImMsg({ code: '10001', msg: `${nick || userName}未上线` }, types.ERROR)
          wsMap[payload.sender.id].send(JSON.stringify(msg))
        }
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
