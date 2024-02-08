import { NavigateFunction } from "react-router-dom";
import { apiGet } from "./serverApiCalls.tsx";

export const AuthorizedUser = (navigate: NavigateFunction) => {
    apiGet('http://localhost:3001/')
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