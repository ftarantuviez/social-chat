import React, {useState, useEffect} from 'react'

import {useStyles} from './style'
import SendIcon from '@material-ui/icons/Send';
import { IconButton, Typography, Menu, MenuItem, Avatar, Chip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import {db} from '../../firebase'
import firebase from 'firebase'
import { Link } from 'react-router-dom';

function Chat({userId, uid, categorie, group}) {

    const classes = useStyles()
    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [userTo, setUserTo] = useState({})
    const [usersGroup, setUsersGroup] = useState([])

    useEffect(() => {
        if(categorie){
            db.collection('categories').doc(categorie).collection('messages')
            .orderBy('sendAt', 'desc').onSnapshot((snapshot) => {
                setMessages(snapshot.docs.map(doc => ({data: doc.data(), id: doc.id})))
            })

        } else if(group){
            db.collection('users').doc(uid).collection('groups').doc(group)
            .collection('messages').orderBy('sendAt', 'desc').onSnapshot(snapshot => setMessages(snapshot.docs.map(doc => ({data: doc.data(), id: doc.id}))))
            
            db.collection('users').doc(uid).collection('groups').doc(group).collection('userGroup')
            .onSnapshot(snapshot => setUsersGroup(snapshot.docs.map(doc => doc.data())))
        } else{
            db.collection('users').doc(uid).collection('chats')
            .doc(userId).collection('messages').orderBy('sendAt','desc').onSnapshot((snapshot) => {
                setMessages(snapshot.docs.map(doc => ({data: doc.data(), id: doc.id})))
            db.collection('users').doc(userId).get().then(e => {
                setUserTo(e.data())
            })
        })}
    

    }, [])

    const handleClick = () => {
        if(categorie){
            db.collection('users').doc(uid).get()
                .then(e => {
                    db.collection('categories').doc(categorie).collection('messages').add({text: newMessage, sendBy: uid, username: e.data().username, sendAt: firebase.firestore.FieldValue.serverTimestamp()})
                })
            
        } else if(group){

            usersGroup.map(user => {
                db.collection('users').doc(user.uid).collection('groups').doc(group)
                .update({lastMessage: firebase.firestore.FieldValue.serverTimestamp()})
                .then(e => {
                db.collection('users').doc(user.uid).collection('groups').doc(group)
                .collection('messages').add({text: newMessage, sendBy: uid, sendAt: firebase.firestore.FieldValue.serverTimestamp()})
            })
            })

        } 
        else {
            db.collection('users').doc(uid).collection('chats').doc(userId)
            .set({lastMessage: firebase.firestore.FieldValue.serverTimestamp()})
            .then(e => {
                db.collection('users').doc(uid).collection('chats').doc(userId)
                .collection('messages').add({text: newMessage, sendBy: uid, sendAt: firebase.firestore.FieldValue.serverTimestamp()})
            })
            db.collection('users').doc(userId).collection('chats').doc(uid)
            .set({lastMessage: firebase.firestore.FieldValue.serverTimestamp()})
            .then(e =>{
                db.collection('users').doc(userId).collection('chats').doc(uid).collection('messages').add({text: newMessage, sendBy: uid, sendAt: firebase.firestore.FieldValue.serverTimestamp()})
            })
            
        }
        setNewMessage('')
    }

    const handleEnter = (e) => {
        if(e.key === 'Enter' && newMessage.length > 0){
            if(categorie){
                db.collection('users').doc(uid).get()
                .then(e => {
                    db.collection('categories').doc(categorie).collection('messages').add({text: newMessage, sendBy: uid, username: e.data().username, sendAt: firebase.firestore.FieldValue.serverTimestamp()})
                })
            } else if(group){

                usersGroup.map(user => {
                    db.collection('users').doc(user.uid).collection('groups').doc(group)
                    .update({lastMessage: firebase.firestore.FieldValue.serverTimestamp()})
                    .then(e => {
                    db.collection('users').doc(user.uid).collection('groups').doc(group)
                    .collection('messages').add({text: newMessage, sendBy: uid, username: user.username, sendAt: firebase.firestore.FieldValue.serverTimestamp()})
                })
                })
    
            } else {
                db.collection('users').doc(uid).collection('chats').doc(userId)
                .set({lastMessage: firebase.firestore.FieldValue.serverTimestamp()})
                .then(e => {
                    db.collection('users').doc(uid).collection('chats').doc(userId)
                    .collection('messages').add({text: newMessage, sendBy: uid, sendAt: firebase.firestore.FieldValue.serverTimestamp()})
                })
                db.collection('users').doc(userId).collection('chats').doc(uid)
                .set({lastMessage: firebase.firestore.FieldValue.serverTimestamp()})
                .then(e =>{
                    db.collection('users').doc(userId).collection('chats').doc(uid).collection('messages').add({text: newMessage, sendBy: uid, sendAt: firebase.firestore.FieldValue.serverTimestamp()})

                })
            }
            setNewMessage('')
        }
        
    }    

    const handleDelete = (mid) => {
        if(categorie){
            db.collection('categories').doc(categorie).collection('messages').doc(mid).delete()
        } else if(group){
            db.collection('users').doc(uid).collection('groups').doc(group).collection('messages').doc(mid).delete()
        } else {
            db.collection('users').doc(uid).collection('chats').doc(userId).collection('messages').doc(mid).delete()
        }
        
    };


    return (
        <>  
        
            
            <div className={classes.userData}>
                {
                    group
                    ? usersGroup.map(user => (
                        <Link key={user.uid} to={user.uid === uid ? '/profile' : `/c/${user.username}`}>
                            <Chip className={classes.chipGroup} size="small" key={user.uid} avatar={<Avatar alt={user.username} src={user.imageProfile} />} label={user.username} />
                        </Link>
                    ))
                    : categorie ? (<Chip size="small" label={categorie} />) : (<Chip size="small" avatar={<Avatar alt={userTo.username} src={userTo.imageProfile} />} label={userTo.username} />)

                }
            </div>
        
            <div className={classes.chat}>
                {
                    messages
                    .map((message) => (
                            <div key={message.id} className={`${classes.card} ${message.data.sendBy === uid ? classes.sendMessage : classes.reciveMessage}`}>
                                   {
                                       ((categorie || group) && message.data.sendBy !== uid) ? (

                                           <Link to={`/c/${message.data.username}`}>
                                                <Typography
                                                    className={classes.username}
                                                    variant="body2"
                                                    component="p"
                                                >
                                                    <strong>{message.data.username}</strong>
                                                </Typography>
                                            </Link>

                                       ): ''
                                    }
                                    <Typography
                                        variant="body2"
                                        component="p"
                                    >
                                        {message.data.text}
                                    </Typography>
                                
                                    {
                                     message.data.sendBy === uid ?(
                                        <IconButton className={classes.iconDelete} onClick={() => handleDelete(message.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                        
                                    ): ''}
                            </div>
                    ))
                }
            </div>
            <div className={classes.textFieldContainer}>
                <input onKeyPress={handleEnter} type="text" className={classes.textField} onChange={e => setNewMessage(e.target.value)} value={newMessage} placeholder="Insert text here" />
                <IconButton onClick={handleClick} disabled={!newMessage} className={newMessage && classes.send}>
                    <SendIcon />
                </IconButton>
            </div>


        </>
    )
}

export default Chat
