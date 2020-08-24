import {makeStyles} from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
    textFieldContainer: {
        position: 'absolute',
        width: '100%',
        padding: '18px 5px',
        bottom: '0px',
        background: '#3f51b5',
    },
    
    textField: {
        position: 'relative',
        background: 'white',
        padding: '10px',
        borderRadius: '20px',
        width: '80%',
        left: 0,
        margin: 0,
        background: 'white',
        border: 'none',
        outline: 0

    },
    send: {
        color: 'white'
    },
    chat: {
        height: 'calc(100% - 120px)',
        overflowY: 'scroll',
        background: '#272222',
        padding: '20px 10px 40px 10px',
        display: 'flex',
        flexDirection: 'column-reverse',
        '&::-webkit-scrollbar': {
            width: '10px',
            display: 'none'
        },
        [theme.breakpoints.up('md')]: {
            '&::-webkit-scrollbar': {
                display: 'block'
            },
            padding: '20px 35px 40px 35px',
        },
        '&::-webkit-scrollbar-track': {
            background: '#fff' 
          },
        '&::-webkit-scrollbar-thumb': {
            background: '#888' 
          },
        '&::-webkit-scrollbar-thumb:hover': {
            background: '#555' 
          }
        
        
    }, 
    card: {
        padding: '6px 7px 8px 9px',
        width: 'max-content',
        maxWidth: '60%',
        borderRadius: '8px',
        marginBottom: '7px',
        display: 'flex',
        alignItems: 'center'
        
      
    },
    sendMessage: {
        background: '#9abadc',
        alignSelf: 'flex-end',
        paddingTop: '0',
        paddingBottom: '0',
        
    },
    reciveMessage: {
        background: '#e9e9eb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    iconDelete: {
        marginLeft: '10px'
    },
    username: {
        marginBottom: '10px'
    },
    userData: {
        width: '100%',
        padding: '7px',
        background: '#3f51b5',
        
    },
    chipGroup: {
        cursor: 'pointer'
    }
}))