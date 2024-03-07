/**
 * Job: gets the full `workday-wellness-app` prefix for every link
 */
export const getFullAppLink = (link: string): string => {
    const public_url = process.env.PUBLIC_URL;
    return `${public_url}${link}`;
}

export const getServerCall = (link: string): string => {
    // const server_url = process.env.REACT_APP_SERVER_URL;
    // console.log(server_url);
    // http://localhost:3001
    // https://workday-wellness-app.onrender.com
    return `https://workday-wellness-app.onrender.com${link}`;
}
