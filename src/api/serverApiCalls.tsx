export const apiPost = async (link: string, jsonData: string) => {
    const token = localStorage.getItem('token');
    return await fetch(
        link, {
        method: "post",
        credentials: 'include',
        body: jsonData,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
}

export const apiGet = async (link: string) => {
    const token = localStorage.getItem('token');
    return await fetch(
        link, {
        method: "get",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
}