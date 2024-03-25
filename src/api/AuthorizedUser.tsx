import { NavigateFunction } from "react-router-dom";
import { apiGet } from "./serverApiCalls.tsx";

export const AuthorizedUser = (navigate: NavigateFunction) => {
    apiGet("/")
        .then(data => {
            console.log(data.authorized);
            if (data.authorized) {
                console.log("User authorized.");
            } else {
                navigate('/login');
            }
        })
        .catch(error => {
            console.log(error);
            navigate('/login');
        });
}