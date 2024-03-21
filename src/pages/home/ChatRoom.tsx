import React, { useState } from 'react';
import { Input } from 'antd';
import { users } from 'src/datas/user';
import { MessageType, SessionType } from 'src/enums';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

export function ChatRoom() {
    const user = useSelector<RootState>(state => state.chatRoom.user)
    const list: Array<Session> = [{
        messageList: [],
        users: [user as User, users[4]],
        id: '1',
        type: SessionType.C2C
    }]
    list[0].messageList.push({
        sender: users[0],
        sendTime: new Date(),
        type: MessageType.TEXT,
        content: 'hhhh',
        id: '1'
    })
    const [activeSession, setActiveSession] = useState<Session>(list[0])
    const [sessionList] = useState<Array<Session>>(list)
    function selectSession(session: Session) {
        if (activeSession.id === session.id) return
        setActiveSession(session)
    }
    return <div className='chat-room'>
        <div className='user-tab-row flex-row'>
            <img src="assets/imgs/head.png" width={50} height={50} style={{ borderRadius: 6 }} alt="" />
            <div className='color333' style={{ padding: '0px 10px', fontSize: 16, fontWeight: 600 }}>{(user as User).nick || (user as User).userName}</div>
        </div>
        <div className='flex-row' style={{ flex: 1 }}>
            <div className='session-tabs'>
                {sessionList.map(i => <div key={i.id} onClick={() => selectSession(i)}><SessionTab session={i} /></div>)}
            </div>
            <SessionContent session={activeSession} />
        </div>

    </div>
}
function SessionTab(props: { session: Session }) {
    const { users, messageList } = props.session
    return <div className='flex-row session-item'>
        <img src="assets/imgs/head.png" width={40} height={40} style={{ borderRadius: 6 }} alt="" />
        <div className='session-item-info'>
            <div className='color333'>
                <div>{users[1].nick || users[1].userName}</div>
                <div className='color999'>{messageList[0].content}</div>
            </div>
            <div className='color999'>{messageList[0].sendTime.toLocaleTimeString()}</div>
        </div>
    </div>
}
function SessionContent(props: { session: Session }) {
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