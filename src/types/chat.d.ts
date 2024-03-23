

declare type SessionMessage<T> = {
    sender: User,
    sendTime: Date,
    type: MessageType,
    content: T,
    id: string,
    sessionId: string
}
declare type User = {
    id: number,
    nick?: string,
    userName: string,
    password?: string,
    createTime: Date,
    status: OnlineStatus,
    groups?:Array<Session>
}

declare type Session = {
    messageList: Array<SessionMessage>,
    users: Array<User>,
    id: string,
    type: SessionType
}