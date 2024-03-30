import React, { createContext, memo, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Input } from 'antd';
import { users } from 'src/utils/datas/user';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import creatIm from 'src/utils/chat/chatRoom';
import { timeFormat } from 'src/utils/common';
import lodash from 'lodash'
let UserContext = createContext(null)
export function ChatRoom() {
    // 当前登录用户
    const user: any | User = useSelector<RootState>(state => state.chatRoom.user)
    const list = users.filter(i => i.id !== user.id)
    // 当前聊天对象，初始化为聊天列表第一个
    const [activeUserId, setactiveUserId] = useState<string>(list[0].id)
    const [userList, setUserList] = useState<Array<User>>(list)
    const [im, setIm] = useState<any>()

    // 聊天区域滚动高度
    const [srcollHeight, setSrcollHeight] = useState<Number>(0)
    // 是否需要滚动
    const [doScroll, setDoScroll] = useState<boolean>(false)
    // 聊天列表是否停止滚动（鼠标在消息列表上滚动后触发状态修改）
    const [msgViewFixed, setMsgViewFixed] = useState<boolean>(false)
    // 底部新消息提示
    const [newMsgTp, setNewMsgTip] = useState<boolean>(false)


    useEffect(() => {
        setIm(creatIm())
        setactiveUserId(list[0].id)
    }, [])
    // 计算需要滚动的高度
    useLayoutEffect(() => {
        if (doScroll && !msgViewFixed) {
            const sl = document.querySelector('#scroll-list')
            const rect = sl?.getBoundingClientRect()
            setSrcollHeight(rect?.height as number)
        }
    }, [doScroll, msgViewFixed])
    // 
    useEffect(() => {
        if (doScroll) {
            const sw = document.querySelector('#scroll-view')
            sw?.scrollTo({ top: srcollHeight as number, left: 0, behavior: 'smooth' })
            setDoScroll(false)
        }
    }, [doScroll, srcollHeight])

    const messageList: Array<Message<any>> = useMemo(() => {
        return userList.find(i => i.id === activeUserId)?.messageList as Array<Message<any>>
    }, [activeUserId, userList])


    im?.bindEvent('onRecvMsg', (msg: Message<any>) => {
        const { sender, sendTo } = msg
        if (sender.id === user.id) {
            //自己发的消息
            if (msg.groupId) {
                // 群消息
            } else {
                const to: User = sendTo[0]
                addMsgToUser(to, msg)
            }
        } else {
            if (msg.groupId) {
                // 群消息
            } else {
                addMsgToUser(sender, msg)
            }
        }
        if (msgViewFixed) {
            setNewMsgTip(true)
        } else {
            setDoScroll(true)
        }

    })
    function addMsgToUser(user: User, msg: Message<any>) {
        const ml = JSON.parse(JSON.stringify(userList))
        const index = ml.findIndex((i: { id: string; }) => {
            return i.id === user.id
        })
        if (index !== -1) {
            ml[index].messageList.push(msg)
            setUserList(ml)
        }
    }
    function selectUser(user: User) {
        if (activeUserId === user.id) return
        setactiveUserId(user.id)
    }
    function sendMsg(content: string) {
        im?.sendTextMsg(userList.find(i => i.id === activeUserId), content)
    }
    // 当鼠标在聊天列表滚动时
    function scrollMsgView(e: any) {
        if (e.target) {
            const sl = e.target.querySelector('#scroll-list')
            const slRect = sl?.getBoundingClientRect()
            const eRect = e.target.getBoundingClientRect()
            if ((slRect.bottom - eRect.bottom) <= 30) {
                setMsgViewFixed(false)
            } else {
                setMsgViewFixed(true)
            }
        }
    }
    return <div className='chat-room'>
        <div className='user-tab-row flex-row'>
            <img src="assets/imgs/head.png" width={50} height={50} style={{ borderRadius: 6 }} alt="" />
            <div className='color333' style={{ padding: '0px 10px', fontSize: 16, fontWeight: 600 }}>{user.nick || user.userName}</div>
        </div>
        <div className='flex-row' style={{ flex: 1, overflow: 'hidden' }}>
            <div className='user-tabs'>
                {userList.map(i => <div key={i.id} onClick={() => selectUser(i)}><UserTab user={i} isActive={i.id === activeUserId} /></div>)}
            </div>
            <div className='session-area flex-column' style={{ flex: 1 }}>
                <UserContext.Provider value={user}>
                    <SessionContent scrollMsgView={scrollMsgView} messageList={messageList} showNewMsgTip={msgViewFixed} />
                </UserContext.Provider>
                <InputArea sendMsg={sendMsg} />
            </div>
        </div>
    </div>
}
function UserTab(props: { user: User, isActive: Boolean }) {
    const { user, isActive } = props
    return <div className={'flex-row user-item' + (isActive ? ' active-tab' : '')} >
        <img src="assets/imgs/head.png" width={40} height={40} style={{ borderRadius: 6 }} alt="" />
        <div className='user-item-info'>
            <div className='color333'>
                <div>{user.nick || user.userName}</div>
            </div>
        </div>
    </div>
}
function SessionContent(props: { messageList: Array<Message<any>>, scrollMsgView: Function, showNewMsgTip: boolean }) {

    return <div className='user-content'>
        <div className='message-area' onScroll={lodash.debounce((e) => {
            props.scrollMsgView(e)

        }, 200)} id='scroll-view'>
            <div style={{ width: 320 }} id='scroll-list'>
                {props.messageList.map(i => <MessageItem key={i.id} msg={i} />)}
            </div>
        </div>
    </div>
}
const MessageItem = memo(function MessageItem(props: { msg: Message<any> }) {
    console.log('========rend')
    const user: User = useContext(UserContext) as unknown as User
    const { msg } = props
    return <div className='message-item'>
        <div className='message-info-row'>
            <span style={{ color: user.id === msg.sender.id ? '#00ccff' : '#999' }}>{msg.sender.nick || msg.sender.userName}</span>
            <span style={{ marginLeft: 10, color: '#999' }}>{timeFormat(new Date(msg.sendTime))}</span>
        </div>
        <div className='messge-bubble'>
            <div>{msg.content}</div>
        </div>
    </div>
}, function (prevProps: any, nextProps: any): boolean {
    return prevProps.id === nextProps.id
})
// function MessageItem(props: { msg: Message<any> }) {
//     console.log('========rend')

//     const user: User = useContext(UserContext) as unknown as User
//     const { msg } = props
//     return <div className='message-item'>
//         <div className='message-info-row'>
//             <span style={{ color: user.id === msg.sender.id ? '#00ccff' : '#999' }}>{msg.sender.nick || msg.sender.userName}</span>
//             <span style={{ marginLeft: 10, color: '#999' }}>{timeFormat(new Date(msg.sendTime))}</span>
//         </div>
//         <div className='messge-bubble'>
//             <div>{msg.content}</div>
//         </div>
//     </div>
// }
function InputArea(props: { sendMsg: Function }) {
    const [inputVal, setInputVal] = useState<string>('')
    const { sendMsg } = props
    const { TextArea } = Input;
    return <TextArea
        onPressEnter={(e) => {
            e.preventDefault()
            sendMsg(inputVal)
            setInputVal('')
        }}
        value={inputVal}
        onChange={(e: any) => setInputVal(e.target.value)}
    />
}