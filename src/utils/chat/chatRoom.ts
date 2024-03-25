
import { store } from "src/store"

// websocket 通信消息
enum ImMessageType {
    MESSAGE = 'MESSAGE',
    UPDATE_USER_STATUS = 'UPDATE_USER_STATUS',
    CREATE_GROUP = 'CREATE_GROUP'
}
interface ImMessage {
    type: ImMessageType,
    payload: string,
    id: string,
    sendTime: number
}

function genID(type: string) {
    return new Date().getTime() + type
}
function getUser() {
    return store.getState().chatRoom.user
}

class ChatRoom extends WebSocket {
    owner: User
    constructor(url: string | URL, owner: User, protocols?: string | string[]) {
        super(url, protocols)
        this.owner = owner
    }
    sendMsg(msg: ImMessage) {
        this.send(JSON.stringify(msg))
    }
}



export default function creatIm() {
    const user = getUser()
    if (user) {
        const im = new ChatRoom(`ws://127.0.0.1:7979?userId=${user.id}`, user)
        im.onopen = () => {
            console.log('==================连接到聊天服务器');
        }
        im.onmessage = e => {
            const data = JSON.parse(e.data)
            console.log(data);
        }
        return im
    } else {
        return null
    }
}
