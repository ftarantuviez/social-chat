import {makeStyles} from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
    root: {
      width: 'calc(100% - 60px)',
      height: '90%',
      overflowY: 'scroll',
      margin: '25px',
      backgroundColor: '#fff',
      textAlign: 'right'
    },
    mainGridTitle: {
        textAlign: 'center', 
        margin: '20px',
    },
   
    
  }));