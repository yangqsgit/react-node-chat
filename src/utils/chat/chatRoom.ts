import { SessionType } from "src/enums"
import { store } from "src/store"

enum ImMessageType {
    //  系统事件
    OPEN_SESSION = 'OPEN_SESSION',
    DELEET_SESSION = 'DELEET_SESSION',
    EVENT_CALLBACK = 'EVENT_CALLBACK',
    // 用户事件
    MESSAGE = 'MESSAGE'
}
interface ImMessage {
    type: ImMessageType,
    payload: string,
    id: string,
    sendTime: number
}
interface TaskInfo {
    ImMsgId: string,
    taskEventType: ImMessageType
}
class ChatRoom extends WebSocket {
    sessions: Array<Session>
    owner: User
    groups: Array<Session>
    taskInfos: Array<TaskInfo> // 待服务器回复的事件
    constructor(url: string | URL, owner: User, protocols?: string | string[]) {
        super(url, protocols)
        this.sessions = []
        this.owner = owner
        this.groups = []
        this.taskInfos = []
    }
    sendTaskMsg(msg: ImMessage) {
        this.taskInfos.push({
            ImMsgId: msg.id,
            taskEventType: msg.type
        })
        this.send(JSON.stringify(msg))
    }
    sendMsg(msg: ImMessage) {
        this.send(JSON.stringify(msg))
    }
    openSession(user: User) {
        const time = new Date().getTime()
        const msg: ImMessage = {
            type: ImMessageType.OPEN_SESSION,
            id: ImMessageType.OPEN_SESSION + '_' + time,
            payload: JSON.stringify({ member: user }),
            sendTime: time
        }
        this.sendTaskMsg(msg)
    }
    openGroup() { }
    sendTextMsgToSession(sessionId: string) { }
}

function genID(type: string) {
    return new Date().getTime() + type
}
function getUser() {
    return store.getState().chatRoom.user
}

export default function creatIm() {
    const user = getUser()
    if (user) {
        const im = new ChatRoom(`ws://127.0.0.1:7979?userId=${user.id}`, user)
        im.onopen = () => {
            console.log('==================连接到聊天服务器');
            im.openSession(user)
        }
        im.onmessage = e => {
            console.log(e);
        }
        return im
    } else {
        return null
    }
}
