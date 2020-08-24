import React, { useEffect, useState } from 'react';
import { useStyles } from './style';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import {db} from '../../firebase'
import { CircularProgress, LinearProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';




export default function LastChatList({uid, setOpenChat}) {
  const classes = useStyles();

  const [lastMessages, setLastMessages] = useState([])
  const [lastChats, setLastChats] = useState([])
  const [loading, setLoading] = useState(true)
  let messages = []
  

  useEffect(() => {
    
    if(uid){


      db.collection('users').doc(uid).collection('chats').orderBy('lastMessage', 'desc')
      .onSnapshot(snapshot => setLastChats(snapshot.docs.map(doc => doc.id)))
      
    }
    
  }, [uid, ])

  useEffect(() => {
    setLoading(true)
    lastChats.map((lastChat, index) => {
      db.collection('users').doc(lastChat)
      .get()
      .then(e => {
        
        db.collection('users').doc(uid).collection('chats').doc(lastChat)
        .collection('messages').orderBy('sendAt', 'desc')
        .onSnapshot(snapshot => {
          messages.push({data: snapshot.docs[0].data(), username: e.data().username, imageProfile: e.data().imageProfile, id: e.id })
          setLastMessages([...messages])
          
        })
      })
      .then(() => {
        setLoading(false)
      })
      .catch(e => {
        alert('Something went wrong')
        setLoading(false)  
      })
    })
    
  }, [lastChats])

  
  return (
    <React.Fragment>
      <CssBaseline />
      <Paper square className={classes.paper}>
        <Typography className={classes.text} variant="h5" gutterBottom>
          Inbox
        </Typography>
        {
          loading
          ? <LinearProgress />
          :(
            <List>
              {
                lastMessages.length > 0
                ? (<>
                    {lastMessages.map((message) => (
                      <Link className={classes.listItem} to={`/c/${message.username}`} onClick={() => setOpenChat(false)} key={message.id}>
                        <ListItem button>
                          <ListItemAvatar>
                            <Avatar alt="Profile Picture" src={message.imageProfile} />
                          </ListItemAvatar>
                          <ListItemText primary={message.username} secondary={message.data.text} />
                        </ListItem>
                      </Link>
                    ))}
                 </>)
                : <Typography variant="body2" style={{marginTop: '20%', textAlign: 'center'}} color="textSecondary" component="h3">You don't have any messages yet</Typography>
              }
            </List>
          )
        }
      </Paper>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <Link to="/users" onClick={() => setOpenChat(false)}>
            <Fab color="secondary" aria-label="add" className={classes.fabButton}>
              <AddIcon/>
            </Fab>
          </Link>
          <div className={classes.grow} />
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
