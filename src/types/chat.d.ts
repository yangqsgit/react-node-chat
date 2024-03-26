

declare type Message<T> = {
    sender: User,
    sendTime: number,
    type: MessageType,
    content: T,
    id: string,
    sendTo: Array<User>,
    groupId?: string
}
declare type User = {
    id: string,
    nick?: string,
    userName: string,
    password?: string,
    createTime: Date,
    status: OnlineStatus,
    groups?: Array<Session>,
    messageList?: Array<Message>
}

