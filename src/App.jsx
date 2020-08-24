import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import './App.css';
import Navbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import Chat from './components/Chat/Chat'
import MainPage from './components/MainPage/MainPage'
import {auth, db} from './firebase'
import UserList from './components/UsersList/UserList'
import Profile from './components/Profile/Profile';
import { CircularProgress, Typography, Backdrop, Card, CardContent } from '@material-ui/core';


function App() {
  
  const categories = [ 'science', 'technology', 'business', 'travels', 'religion', 'laws', 'sports', 'art']
  const [isUser, setIsUser] = useState({})
  const [loading, setLoading] = useState(true)
  const [openChat, setOpenChat] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const [allGroups, setAllGroups] = useState([])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if(authUser) {
        setIsUser(authUser)
      }
      else setIsUser(null)
    })
    setLoading(false)
    return () => unsubscribe()

  }, [isUser])

  useEffect(() => {
    db.collection('users').onSnapshot(snapshot => setAllUsers(snapshot.docs.map(doc => ({id: doc.id, data: doc.data()}))))

  }, [])

  useEffect(() => {
    if(isUser){
      if(isUser.uid){
        db.collection('users').doc(isUser.uid).collection('groups').onSnapshot(snapshot => setAllGroups(snapshot.docs.map(doc => doc.id)))
      }
    }

  }, [isUser])
  

  
  return (
    <div className="app">
      <Router>
        {
          loading
          ? <Backdrop open={loading} style={{zIndex: 1000}}> <CircularProgress color="inherit" /> </Backdrop>
          : isUser ? (
            <>
            <Navbar allUsers={allUsers} categories={categories} isUser={isUser} openChat={openChat} setOpenChat={setOpenChat} />
            <Home openChat={openChat} setOpenChat={setOpenChat} uid={isUser.uid}>
              <Switch>
                    <Route exact path="/" component={MainPage} />
                    <Route exact path="/users">
                        <UserList uid={isUser.uid} />
                    </Route>
                    <Route exact path="/groups">
                        <UserList group uid={isUser.uid} />
                    </Route>
                    <Route exact path="/profile">
                        <Profile uid={isUser.uid} />
                    </Route>
                    {
                      allUsers.map(user => (
                        <Route exact key={user.id} path={`/c/${user.data.username}`}>
                          <Chat userId={user.id} uid={isUser.uid} />
                        </Route>
                      ))
                    }
                    {
                      categories.map(categorie => (
                        <Route exact path={`/${categorie}`} key={categorie}>
                          <Chat uid={isUser.uid} categorie={categorie} />
                        </Route>
                      ))
                    }
                    {
                      allGroups.map(group => (
                        <Route exact path={`/g/${group}`} key={group}>
                          <Chat uid={isUser.uid} group={group} />
                        </Route>
                      ))
                    }
                    
                  )
              </Switch>
            </Home>
          </>
          ): (<Route>
            <Navbar categories={categories}  isUser={false} openChat={openChat} setOpenChat={setOpenChat} />
            <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <Card> 
                <CardContent style={{textAlign: 'center', padding: '24px 10px 0px 10px'}}>
                  <Typography variant="textPrimary" component="h1">Sign In to enjoy the chats!</Typography>
                  <img style={{maxWidth: '350px', width: 'auto', objectFit: 'contain'}} src="https://i.ibb.co/GsvkW1s/localhost-3000-i-Pad-1-ipadair2-spacegrey-portrait.png" alt="Image initial" />
                </CardContent>
              </Card>
            </div>
          </Route>
          )
          
          
        }
      </Router>
    </div>
  );
}

export default App;
