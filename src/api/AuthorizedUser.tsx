import { NavigateFunction } from "react-router-dom";
import { apiGet } from "./serverApiCalls.tsx";
import { getServerCall } from "../util/getFullAppLink.ts";

export const AuthorizedUser = (navigate: NavigateFunction) => {
    apiGet(getServerCall("/"))
        .then(res => res.json())
        .then(data => {
            console.log(data.authorized);
            if (data.authorized) {
                console.log("User authorized.");
            } else {
                navigate('/login');
            }
        })
        .catch(err => {
            console.log(err);
            navigate('/login');
        });
}