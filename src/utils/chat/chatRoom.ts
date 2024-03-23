import { SessionType } from "src/enums"

export default class ChatRoomCore extends WebSocket {
    sessions: Array<Session>
    owner: User
    groups: Array<Session>
    constructor(url: string | URL, owner: User, protocols?: string | string[]) {
        super(url, protocols)
        this.sessions = []
        this.owner = owner
        this.groups = []
    }

    openSession(user: User): Session {
        if (this.sessions.length) {
            const session = this.sessions.find(i => i.users.map(s => s.id).includes(user.id))
            if (session) return session
        }
        const session = {
            messageList: [],
            users: [user, this.owner],
            id: this.sessions.length + 1 + '',
            type: SessionType.C2C
        }
        this.sessions.push(session)
        return session
    }
    sendTextMsgToSession(sessionId: string,) { }
    openGroup() { }
}