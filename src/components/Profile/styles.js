import {makeStyles} from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
    root: {
      minWidth: 275,
      minHeight: '50vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '20px'
    },
    cardContent: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    avatarSection: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        margin: '30px',
        marginBottom: '0'
    },
    textFieldSection: {
        display: 'flex',
        margin: '64px',
        marginBottom: '20px',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column'
        }
    },
    avatar: {
        width: '130px',
        height: '130px'
    },
    iconButtonDelete: {
        bottom: '-90px',
        maxHeight: '50px !important'
    },
    inputFileContainer: {
        display: 'flex',
        alignItems: 'flex-end'
    },
    inputFile: {
        display: 'none !important'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
  }));