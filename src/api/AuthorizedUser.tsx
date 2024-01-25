import { NavigateFunction } from "react-router-dom";

export const AuthorizedUser = (navigate: NavigateFunction) => {
    fetch(
        "http://localhost:3001/", {
        method: "get",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log(data.authorized)
            if (data.authorized) {
                console.log("User authorized.");
            } else {
                navigate('/login')
            }
        }).catch(err => console.log(err))
}