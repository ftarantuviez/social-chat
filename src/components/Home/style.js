import {makeStyles, createStyles} from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => createStyles({
    mainGrid: {
        textAlign: 'center',
        paddingTop: '0',
        height: 'calc(100vh - 64px)',
        position: 'relative'
    },
    lists: {
        display: 'none',
        [theme.breakpoints.down('sm')]: {
            position: 'absolute',
            display: 'block',
            zIndex: 21,
            width: '100%'
        },

    },
    listsMedium: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'block'
        }
    },
    lastChats: {
        height: 'calc(100vh - 64px)'
    }

}))