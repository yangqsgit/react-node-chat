import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Input, Button, message } from 'antd';
import { users } from 'src/utils/datas/user';
import { useNavigate } from 'react-router-dom';
import { updateUser } from 'src/store/chatRoom/slice';
import { store } from 'src/store';


const style = {
    inner: {
        width: 400,
        margin: '0 auto',
        marginTop: '30%'
    },
    marginTop: {
        marginTop: '30px'
    },
    marginLeft: {
        marginLeft: '20px'
    }
}
function Login() {
    const [userName, setUserName] = useState<string>('user-0')
    const [pwd, setPwd] = useState<string>('pwd-0')
    const navigate = useNavigate();

    function login() {
        const user = users.find(i => i.userName === userName && i.password === pwd)
        if (!user) {
            message.error('用户名或密码不正确')
        } else {
            delete user.password
            localStorage.setItem('user', JSON.stringify({ user, expireTime: new Date().getTime() + 12 * 60 * 60 * 1000 }))
            store.dispatch(updateUser(user))
            navigate("/home", { replace: true })
        }
    }
    return (
        <div className="page-login">
            <div className='login-inner' style={style.inner}>
                <Input size="large" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="输入用户名" prefix={<UserOutlined />} />
                <Input.Password size="large" value={pwd} onChange={(e) => setPwd(e.target.value)} style={style.marginTop} placeholder="输入密码" />
                <div className='flex-row-center' style={style.marginTop}>
                    <Button onClick={login} type="primary">登录</Button>
                    <Button style={style.marginLeft}>注册</Button>
                </div>
            </div>
        </div>
    );
}
export default Login;
