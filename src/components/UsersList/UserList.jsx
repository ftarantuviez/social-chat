import React, {useState, useEffect} from 'react';
import { useStyles } from './styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import {db} from '../../firebase'

import { Fade, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, LinearProgress } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { Link, useHistory } from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';
import firebase from 'firebase'




export default function UserList({uid, group}) {
  const classes = useStyles();
  const history = useHistory()

  const [checked, setChecked] = useState([]);
  const [users, setUsers] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [nameGroup, setNameGroup] = useState('')

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
      console.log(newChecked)
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleCreateGroup = () => {
    db.collection('users').doc(uid).get()
    .then(e => {
      db.collection('users').doc(e.id).collection('groups').doc(nameGroup)
      .set({createdAt: firebase.firestore.FieldValue.serverTimestamp(), nameGroup: nameGroup})
      .then(eve => {
        db.collection('users').doc(e.id).collection('groups').doc(nameGroup).collection('userGroup').doc(e.id).set({username: e.data().username, uid: e.id,})
      })
      checked.map(userX => {
          checked.map(userY => {
            db.collection('users').doc(userX.id).collection('groups').doc(nameGroup)
            .set({createdAt: firebase.firestore.FieldValue.serverTimestamp(), nameGroup: nameGroup})
            .then(ev => {
              db.collection('users').doc(userX.id).collection('groups').doc(nameGroup).collection('userGroup').doc(userY.id).set({username: userY.data.username, uid: userY.id,})
            })
          })
          
          db.collection('users').doc(userX.id).collection('groups').doc(nameGroup)
          .set({createdAt: firebase.firestore.FieldValue.serverTimestamp(), nameGroup: nameGroup})
          .then(ev => {
            db.collection('users').doc(userX.id).collection('groups').doc(nameGroup).collection('userGroup').doc(e.id).set({username: e.data().username, uid: e.id,})
          })
          db.collection('users').doc(e.id).collection('groups').doc(nameGroup)
          .set({createdAt: firebase.firestore.FieldValue.serverTimestamp(), nameGroup: nameGroup})
          .then(ev => {
            db.collection('users').doc(e.id).collection('groups').doc(nameGroup).collection('userGroup').doc(userX.id).set({username: userX.data.username, uid: userX.id,})
          })

      })
    })
    .then(() => {
      setDialogOpen(false)
      setChecked([])
      history.push(`/g/${nameGroup}`)

    })
    .catch(e => {
      alert('Something went wrong')
    })
    
  }

  useEffect(() => {
    setLoading(true)
    if(group && uid) {
      db.collection('users').doc(uid).collection('groups').onSnapshot(snapshot => setGroups(snapshot.docs.map(doc => ({data: doc.data(), id: doc.id}))))
      setLoading(false)
    } else {
      db.collection('users')
      .onSnapshot(snapshot => setUsers(snapshot.docs.map(doc => ({data: doc.data(), id: doc.id}))))
      setLoading(false)
    }
}, [uid])


  return (
    <>

      <List dense className={classes.root}>
        <Typography className={classes.mainGridTitle} variant="h4" color="textPrimary">{group ? 'Groups': 'Users'}</Typography> 
        {
          loading
          ? <LinearProgress />
          : group ? ( <>
               <Link to="/users"> <Button style={{margin: '10px'}} variant="outlined" color="primary">Create group</Button></Link>
               {
                 groups.length > 0
                 ? (<>
                    {groups.map((group) => {
                      return (
                        <Fade key={group.id} in={!loading}>
                            <ListItem button>
                              <Link to={`/g/${group.id}`}>
                                <ListItemText  primary={group.id} />
                              </Link>
                              <ListItemSecondaryAction>
                                <Link to={`/g/${group.id}`}>
                                  <IconButton>
                                    <SendIcon color="primary"  />
                                  </IconButton>
                                </Link>
                              </ListItemSecondaryAction>
                            </ListItem>
                        </Fade>
                      );
                    })}
                 
                  </>) : <Typography variant="body2" style={{marginTop: '20%', textAlign: 'center'}} color="textSecondary" component="h3">You don't have any groups yet</Typography>
               }
            </>
          )
 
          : <> 
          <Button onClick={() => setDialogOpen(true)} style={{margin: '10px'}} variant="outlined" color="primary" disabled={checked.length >= 2 ? false : true}>Create group</Button>
          {users.map((user) => {
            const labelId = `checkbox-list-secondary-label-${user}`;
            return (
              <Fade key={user.data.username} in={!loading}>
                  <ListItem button>
                    <ListItemAvatar>
                      <Avatar
                        alt={user.data.username}
                        src={user.data.imageProfile}
                      />
                    </ListItemAvatar>
                    <Link to={user.id === uid ? '/profile' :`/c/${user.data.username}`}>
                      <ListItemText id={labelId} primary={user.data.username} />
                    </Link>
                    <ListItemSecondaryAction>
                      <Checkbox
                        edge="end"
                        onChange={handleToggle(user)}
                        checked={checked.indexOf(user) !== -1}
                        inputProps={{ 'aria-labelledby': labelId }}
                        disabled={user.id === uid ? true : false}
                      />
                      <Link to={user.id === uid ? '/profile' : `/c/${user.data.username}`}>
                        <IconButton>
                          {
                            user.id === uid
                            ? <AccountCircle />
                            : <SendIcon color="primary"  />
                            
                          }
                        </IconButton>
                      </Link>
                    </ListItemSecondaryAction>
                  </ListItem>
              </Fade>
            );
          }
          )}


      <Dialog open={dialogOpen} onClose={setDialogOpen} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Put a name for the new group!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="namegroup"
            label="Name Group"
            type="text"
            fullWidth
            onChange={(e) => setNameGroup(e.target.value)}
            value={nameGroup}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateGroup} color="primary">
            Create group
          </Button>
        </DialogActions>
      </Dialog>
        </>
        }
        </List>
    </>
  );
}
