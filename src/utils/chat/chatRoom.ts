
import { MessageType } from "src/enums"
import { store } from "src/store"

// websocket 通信消息类型
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
const eventKeys = ['onRecvMsg']
function genID(type: string) {
    return type + '_' + new Date().getTime()
}
function getUser() {
    return store.getState().chatRoom.user
}
function createTextMsg(sender: User, to: User, content: string): Message<string> {
    return {
        sender,
        type: MessageType.TEXT,
        sendTo: [to],
        id: 'message_' + new Date().getTime(),
        sendTime: new Date().getTime(),
        content
    }
}
// wensocket 实际传输的消息
function createImMsg(msg: Message<string>): ImMessage {
    return {
        type: ImMessageType.MESSAGE,
        payload: JSON.stringify(msg),
        id: genID('imMessage_'),
        sendTime: new Date().getTime()
    }
}
class ChatRoom extends WebSocket {
    owner: User
    eventMap: {
        onRecvMsg: Function | null
    }
    constructor(url: string | URL, owner: User, protocols?: string | string[]) {
        super(url, protocols)
        this.owner = owner
        // 绑定的事件集合
        this.eventMap = { onRecvMsg: null }
    }
    sendTextMsg(to: User, content: string) {
        const msg = createTextMsg(this.owner, to, content)
        const imMsg: ImMessage = createImMsg(msg)
        // console.log('send msg', imMsg);
        this.send(JSON.stringify(imMsg))
        // 自己发的消息转发一份到自己聊天框
        if (this.eventMap?.onRecvMsg) {
            this.eventMap.onRecvMsg(msg)
        }

    }
    bindEvent(name: string, fn: any) {
        if (eventKeys.includes(name)) {
            this.eventMap = Object.assign(this.eventMap, { [name]: fn })
        }
    }
    unbindEvent(name: string) {
        if (eventKeys.includes(name)) {
            this.eventMap = Object.assign(this.eventMap, { [name]: null })
        }
    }
    onmessage = (e: any) => {
        const data = JSON.parse(e.data)
        const { payload, type } = data
        console.log('recv event %s', type);
        switch (type) {
            case ImMessageType.MESSAGE:
                // 只处理接收者里有用户的消息
                if (payload.sendTo.some((i: { id: string }) => i.id === this.owner.id))
                    if (this.eventMap?.onRecvMsg) {
                        this.eventMap.onRecvMsg(payload)

                    }
        }
    }
}



export default function creatIm() {
    const user = getUser()
    if (user) {
        const im = new ChatRoom(`ws://127.0.0.1:7979?userId=${user.id}`, user)
        im.onopen = () => {
            console.log('==================连接到聊天服务器');
        }
        // im.onmessage = e => {
        //     console.log(1);

        //     // const data = JSON.parse(e.data)
        //     // console.log(data);
        // }
        return im
    } else {
        return null
    }
}
