/**
 * Job: gets the full `workday-wellness-app` prefix for every link
 */
export const getFullAppLink = (link: string): string => {
    const public_url = process.env.PUBLIC_URL;
    return `${public_url}${link}`;
}

export const getServerCall = (link: string): string => {
    // Issue: gh-pages will not properly show the server link so we manually add it for the sake of this prototype.
    // const server_url = process.env.REACT_APP_SERVER_URL;
    // return `${server_url}${link}`;
    return `https://workday-wellness-app.onrender.com${link}`;
}
