import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import {db} from '../../firebase'


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '17px',
    flexDirection: 'row-reverse',
    [theme.breakpoints.down('sm')]: {
      marginTop: '20px'
    }
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));


export default function ButtonChange({newUser, oldUser, uid, setUserChanged, setErrorUsername}) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const handleChangeUsername = () => {
      setLoading(true)

      db.collection('users').where('username', '==', newUser).get()
      .then(e =>{ 
        if(e.docs.length > 0){
          setErrorUsername({error: true, text: 'This user already exists'})
          setLoading(false)
          throw new Error()
        } else {
          db.collection('users').doc(uid).get()
          .then(e => {
              
              db.collection('users').doc(uid).update({username: newUser})
              .then(() => {
                setUserChanged(true)
                setLoading(false)
                setSuccess(true)
                setTimeout(() => {
                  setSuccess(false)
                }, 3000)
              })
          })
          
        }
      })
      .catch(e => {
        setLoading(false)
        alert('Something went wrong')
      })
    }
    
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  useEffect(() => {
    if(newUser === oldUser) setDisabled(true)
    else setDisabled(false)

  }, [newUser, oldUser])

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Fab
          aria-label="save"
          color="primary"
          className={buttonClassname}
          onClick={handleChangeUsername}
          disabled={disabled || loading}
        >
          {success ? <CheckIcon /> : <SaveIcon />}
        </Fab>
        {loading && <CircularProgress size={68} className={classes.fabProgress} />}
      </div>
      <div className={classes.wrapper}>
        <Button
          variant="contained"
          color="primary"
          className={buttonClassname}
          disabled={disabled || loading}
          onClick={handleChangeUsername}
        >

          {
            success 
            ? 'Saved'
            : 'Save changes'
          }
          
        </Button>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>

    </div>
  );
}
