import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OnlineStatus } from 'src/enums'

interface ChatRoomState {
  user: User
}

// 使用该类型定义初始 state
const initialState: ChatRoomState = {
  user: {
    id: '0',
    userName: '',
    status: OnlineStatus.OFFLINE,
    createTime: new Date()
  }
}

export const chatRoomSlice = createSlice({
  name: 'chatRoom',
  // `createSlice` 将从 `initialState` 参数推断 state 类型
  initialState,
  reducers: {
    // 使用 PayloadAction 类型声明 `action.payload` 的内容
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload

    }
  }
})

export const { updateUser } = chatRoomSlice.actions
// 选择器等其他代码可以使用导入的 `RootState` 类型
// export const selectChatRoom = (state: RootState) => state.chatRoom

export default chatRoomSlice.reducer