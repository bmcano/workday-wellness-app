import { NavigateFunction } from "react-router-dom";
import { apiPost } from "./serverApiCalls.tsx";
import { getServerCall } from "../util/getFullAppLink.ts";

export const AuthorizedUser = (navigate: NavigateFunction) => {
    const token = localStorage.getItem('token');
    const jsonData = JSON.stringify({ token: token });
    apiPost(getServerCall("/"), jsonData)
        .then(res => res.json())
        .then(data => {
            console.log(data.authorized)
            if (data.authorized) {
                console.log("User authorized.");
            } else {
                navigate('/login');
            }
        })
        .catch(err => console.log(err));
}