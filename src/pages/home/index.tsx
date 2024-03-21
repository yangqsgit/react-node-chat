import React from 'react';
import './home.scss'
import { Tabs } from 'antd';
import { ChatRoom } from './ChatRoom';
import { Provider } from 'react-redux';
import { store } from 'src/store';
const tabs = [{
    name: 'chatRoom',
    label: '聊天室',
    children: <Provider store={store}><ChatRoom></ChatRoom></Provider>,
    key: 'chatRoom'
}]

export default function Home() {
    return (
        <Tabs
            defaultActiveKey="1"
            tabPosition='left'
            style={{ height: 220 }}
            items={tabs}
        />
    );
}