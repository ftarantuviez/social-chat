import {makeStyles} from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
    text: {
      padding: theme.spacing(2, 2, 0),
    },
    paper: {
      height: '100%'
    },
    list: {
      
      overflowY: 'scroll',
      marginBottom: 0
    },
    subheader: {
      backgroundColor: theme.palette.background.paper,
    },
    appBar: {
      top: 'auto',
      bottom: '56px',
      position: 'relative'
    },
    grow: {
      flexGrow: 1,
    },
    fabButton: {
      position: 'absolute',
      zIndex: 1,
      top: -30,
      left: 0,
      right: 0,
      margin: '0 auto',
    },
  }));
  