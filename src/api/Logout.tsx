import { NavigateFunction } from "react-router-dom"
import { getServerCall } from "../util/getFullAppLink.ts"

export const handleLogout = async (navigate: NavigateFunction) => {
    localStorage.clear();
    await fetch(
        getServerCall("/logout"), {
        method: "post",
        credentials: 'include',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            console.log("Logging Out")
            navigate('/login')
        })
        .catch(err => console.log(err))
}