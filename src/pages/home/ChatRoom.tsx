import React, { useState } from 'react';
import { Input } from 'antd';
import { users } from 'src/utils/datas/user';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import creatIm from 'src/utils/chat/chatRoom';

export function ChatRoom() {
    const user: any | User = useSelector<RootState>(state => state.chatRoom.user)
    const list = users.filter(i => i.id !== user.id)
    const [activeUser, setActiveUser] = useState<User>(list[0])
    const [userList] = useState<Array<User>>(list)
    const im = creatIm()
    im?.bindEvent('onRecvMsg', (msg: Message<any>) => {
        console.log(msg);
    })
    function selectUser(user: User) {
        if (activeUser.id === user.id) return
        setActiveUser(user)
    }
    function sendMsg(to: User, content: string) {
        im?.sendTextMsg(to, content)
    }
    return <div className='chat-room'>
        <div className='user-tab-row flex-row'>
            <img src="assets/imgs/head.png" width={50} height={50} style={{ borderRadius: 6 }} alt="" />
            <div className='color333' style={{ padding: '0px 10px', fontSize: 16, fontWeight: 600 }}>{user.nick || user.userName}</div>
        </div>
        <div className='flex-row' style={{ flex: 1 }}>
            <div className='user-tabs'>
                {userList.map(i => <div key={i.id} onClick={() => selectUser(i)}><UserTab user={i} isActive={i.id === activeUser.id} /></div>)}
            </div>
            <SessionContent user={activeUser} sendMsg={sendMsg} />
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
function SessionContent(props: { user: User, sendMsg: Function }) {
    const { TextArea } = Input;
    const [inputVal, setInputVal] = useState<string>('')
    return <div className='user-content'>
        <div className='message-area'></div>
        <div className='btn-group-row'></div>
        <TextArea
            onPressEnter={() => {
                props.sendMsg(props.user, inputVal)
            }}
            value={inputVal}
            onChange={(e: any) => setInputVal(e.target.value)}
        />
    </div>
}