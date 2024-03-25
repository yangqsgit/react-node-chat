

declare type Message<T> = {
    sender: User,
    sendTime: Date,
    type: MessageType,
    content: T,
    id: string,
    sessionId: string,
    sendTo: Array<User>
}
declare type User = {
    id: number,
    nick?: string,
    userName: string,
    password?: string,
    createTime: Date,
    status: OnlineStatus,
    groups?: Array<Session>
}

