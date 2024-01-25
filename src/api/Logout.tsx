import { NavigateFunction } from "react-router-dom"

export const handleLogout = async (navigate: NavigateFunction) => {
    await fetch(
        'http://localhost:3001/logout', {
        method: "post",
        credentials: 'include',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(() => {
        console.log("Logging Out")
        navigate('/login')
    }).catch(err => console.log(err))
}