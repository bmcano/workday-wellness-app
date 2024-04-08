import { Styles } from "react-modal";

export const marginTLR = { marginTop: '16px', marginLeft: '16px', marginRight: '16px' }
export const dividerMargin = { marginTop: '24px', marginLeft: '16px', marginRight: '16px' }
export const customModalStyle: Styles = {
    content: {
        width: '40%',
        margin: 'auto',
        maxHeight: '80%',
        overflow: 'auto',
        zIndex: 99,
        display: 'flex',
        flexDirection: 'column',
        border: 'none',
        background: 'none'
    },
    overlay: {
        zIndex: 99, // this ensures the overlay is over all other components
    },
};