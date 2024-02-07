export const apiPost = async (link: string, jsonData: string) => {
    return await fetch(
        link, {
        method: "post",
        credentials: 'include',
        body: jsonData,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const apiGet = async (link: string) => {
    return await fetch(
        link, {
        method: "get",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}