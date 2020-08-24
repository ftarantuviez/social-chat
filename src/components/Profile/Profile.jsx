import React, { useEffect, useState } from 'react';
import { useStyles } from './styles';
import { CircularProgress, Avatar, Tooltip, IconButton,Card, CardContent, Button, Typography, TextField, InputAdornment, Backdrop } from '@material-ui/core';
import {db, storage} from '../../firebase'
import firebase from 'firebase'
import DeleteIcon from '@material-ui/icons/Delete';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ButtonChange from './ButtonChange'

export default function Profile({uid}) {
  const classes = useStyles();
  const [userProfile, setUserProfile] = useState([])
  const [imageChanged, setImageChanged] = useState(null)
  const [userChanged, setUserChanged] = useState(false)
  const [newUser, setNewUser] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingPicture, setLoadingPicture] = useState(false)
  const [errorUsername, setErrorUsername] = useState({error: false, text: ''})
  
  
  useEffect(() => {
    if(uid){
        db
         .collection('users')
         .doc(uid)
         .get()
         .then(e => {
            setUserProfile(e.data())
            setLoading(false)
            setNewUser(e.data().username)
         })
         .catch(e => {
             console.error(e)
             setLoading(false)
        })
    }

  }, [uid, imageChanged, userChanged])
  
  const handleImageChange = (e) => {
      if(e.target.files[0]){
        const uploadTask = storage.ref(`images/${e.target.files[0].name}`).put(e.target.files[0])

        uploadTask.on('state_changed', function(snapshot){
            switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
                alert('upload is paused')
                break;
            case firebase.storage.TaskState.RUNNING: 
                setLoadingPicture(true)
                break;
            }
        }, function(error){
            alert('Something went wrong :(')
        }, function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            db.collection('users').doc(uid).update({
                imageProfile: downloadURL
            })
            setLoadingPicture(false)
            setImageChanged(true)
            }).catch(e => console.log(e))
        })
    }
  }

  const deleteImage = () => {
      setLoadingPicture(true)
      db.collection('users').doc(uid).update({
          imageProfile: ''
      }).then(() => setLoadingPicture(false))

      setImageChanged(false)
  }

  return (
    <Card className={classes.root}>
        {
            !loading
            ?<>
                <CardContent className={classes.cardContent}>
                    <div className={classes.avatarSection}>
                        <Avatar className={classes.avatar} src={userProfile.imageProfile} alt={userProfile.username} />
                        {
                            userProfile.imageProfile
                            ? <Tooltip onClick={deleteImage} type="file" title="Delete">
                                <IconButton className={classes.iconButtonDelete} aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                                </Tooltip>
                            : 
                            <div className={classes.inputFileContainer}> 
                                <input
                                accept="image/*"
                                className={classes.inputFile}
                                id="contained-button-file"
                                multiple
                                onChange={handleImageChange}
                                type="file"
                                />
                                <label htmlFor="contained-button-file">
                                <Button variant="contained" color="primary" component="span">
                                    Upload
                                </Button>
                                </label>
                                <input onChange={handleImageChange} accept="image/*" className={classes.inputFile} id="icon-button-file" type="file" />
                                <label htmlFor="icon-button-file">
                                <IconButton color="primary" aria-label="upload picture" component="span">
                                    <PhotoCamera />
                                </IconButton>
                                </label>
                          </div>
                        }
                    </div>
                    <div className={classes.textFieldSection}>
                        <TextField
                                value={newUser}
                                onChange={e => {setNewUser(e.target.value); setErrorUsername({error: false})}}
                                error={errorUsername.error}
                                helperText={errorUsername.error ? errorUsername.text : ''}
                                className={classes.textField}
                                id="input-with-icon-textfield"
                                label="Username"
                                InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    <AccountCircle />
                                    </InputAdornment>
                                ),
                                }}
                            />
                        <ButtonChange oldUser={userProfile.username} setErrorUsername={setErrorUsername} uid={uid} setUserChanged={setUserChanged} newUser={newUser} />
                    </div>
                    <Typography variant="body2" color="textSecondary" component="p">This is how you are visible for the other users</Typography>    
                </CardContent>
            </>
            : <CircularProgress />
        }

        <Backdrop className={classes.backdrop} open={loadingPicture}>
            <CircularProgress color="inherit" />
        </Backdrop>
    </Card>
  );
}
