import { OnlineStatus } from "src/enums"

const getUsers = (): Array<User> => {
    const users: Array<User> = []
    for (let i = 0; i < 5; i++) {
        users.push({
            id: i,
            userName: 'user-' + i,
            password: 'pwd-' + i,
            createTime: new Date(),
            status: OnlineStatus.OFFLINE
        })
    }
    return users
}
export const users = getUsers().map(i => {
    delete i.password
    return i
})