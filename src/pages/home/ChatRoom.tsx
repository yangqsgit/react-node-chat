import React, { useState } from 'react';
import { Input } from 'antd';
import { users } from 'src/utils/datas/user';
import { MessageType, SessionType } from 'src/enums';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import ChatRoomCore from 'src/utils/chat/chatRoom';
export function ChatRoom() {
    const user = useSelector<RootState>(state => state.chatRoom.user)
    const list = users.filter(i => i.id !== (user as User).id)
    const [activeUser, setActiveUser] = useState<User>(list[0])
    const [userList] = useState<Array<User>>(list)

    const im = new ChatRoomCore('ws://127.0.0.1:7979?userId=' + (user as User).id, user as User)
    im.onerror = (e) => {
        console.log(e, '======err')
    }
    im.onmessage = (e) => {
        console.log(e);
    }
    const [sessions, SetSessions] = useState<Array<Session>>([])



    function selectUser(user: User) {
        if (activeUser.id === user.id) return
        setActiveUser(user)
    }
    return <div className='chat-room'>
        <div className='user-tab-row flex-row'>
            <img src="assets/imgs/head.png" width={50} height={50} style={{ borderRadius: 6 }} alt="" />
            <div className='color333' style={{ padding: '0px 10px', fontSize: 16, fontWeight: 600 }}>{(user as User).nick || (user as User).userName}</div>
        </div>
        <div className='flex-row' style={{ flex: 1 }}>
            <div className='session-tabs'>
                {userList.map(i => <div key={i.id} onClick={() => selectUser(i)}><UserTab user={i} /></div>)}
            </div>
            <SessionContent user={activeUser} />
        </div>

    </div>
}
function UserTab(props: { user: User }) {
    return <div className='flex-row session-item'>
        <img src="assets/imgs/head.png" width={40} height={40} style={{ borderRadius: 6 }} alt="" />
        <div className='session-item-info'>
            <div className='color333'>
                <div>{users[1].nick || users[1].userName}</div>
            </div>
            {/* <div className='color999'>{messageList[0].sendTime.toLocaleTimeString()}</div> */}
        </div>
    </div>
}
function SessionContent(props: { user: User }) {
    const { TextArea } = Input;
    const [inputVal, setInputVal] = useState<string>('')
    return <div className='session-content'>
        <div className='message-area'></div>
        <div className='btn-group-row'></div>
        <TextArea
            value={inputVal}
            onChange={(e: any) => setInputVal(e.target.value)}
        />
    </div>
}