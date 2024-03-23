
const { WebSocketServer } = require('ws')
const types = {
  //  系统事件
  OPEN_SESSION: 'OPEN_SESSION',
  DELEET_SESSION: 'DELEET_SESSION',
  EVENT_CALLBACK: 'EVENT_CALLBACK',
  GET_ONLINE_USERS: 'GET_ONLINE_USERS',
  // 用户事件
  MESSAGE: 'MESSAGE'
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
function createTaskMsg({ type, status = 'success', taskId, payload }) {
  return {
    type,
    status,
    id: genID(type),
    taskId,
    payload
  }
}
function createSession({ userId, memberId, sessionId }) {
  const session = {
    userIds: [userId, memberId],
    sessionId
  }
  sessionMap[sessionId] = session
  return session
}
function openSession(data, userId) {
  const { member } = JSON.parse(data.payload)
  const msg = createTaskMsg({
    type: types.EVENT_CALLBACK,
    taskId: data.id
  })
  if (member) {
    if (wsMap[member.id]) {
      let sessionIds = [`session-${userId}-${member.id}`, `session-${member.id}-${userId}`]
      let session = sessionMap[sessionIds[0]] || sessionMap[sessionIds[1]]
      if (session) {
        msg.payload = JSON.stringify({ session })
      } else {
        session = createSession({ userId, memberId: member.id, sessionId: sessionIds[0] })
        msg.payload = JSON.stringify({ session })
      }
    } else {
      msg.status = 'fail'
      msg.payload = JSON.stringify({ message: '会话成员未上线！' })
    }
  } else {
    msg.status = 'fail'
    msg.payload = JSON.stringify({ message: '会话成员无效！' })
  }
  return msg
}
function handleMsg(data, userId) {
  let msg = null
  switch (data.type) {
    case types.DELEET_SESSION: { }
    case types.OPEN_SESSION: {
      msg = openSession(data, userId)
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
