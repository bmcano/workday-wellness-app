/**
 * Job: gets the full `workday-wellness-app` prefix for every link
 */
export const getFullAppLink = (link: string): string => {
    const public_url = process.env.PUBLIC_URL;
    return `${public_url}${link}`;
}
