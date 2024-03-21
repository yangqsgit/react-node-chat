import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { store } from "src/store"
import { updateUser } from "src/store/chatRoom/slice"

const WithLogin = (props: any) => {
    const navigate = useNavigate()
    useEffect(() => {
        const storage = localStorage.getItem('user')
        if (storage) {
            const { expireTime, user } = JSON.parse(storage)
            if (expireTime <= new Date().getTime()) {
                navigate("/login", { replace: true })
            } else {
                store.dispatch(updateUser(user))
            }
        } else {
            navigate("/login", { replace: true })
        }
    }, [navigate])
    return props.children
}
export default WithLogin