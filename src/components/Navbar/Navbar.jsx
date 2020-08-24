import React, { useState, useEffect } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import {Link, useHistory} from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MessageIcon from '@material-ui/icons/Message';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PeopleIcon from '@material-ui/icons/People';
import HomeIcon from '@material-ui/icons/Home';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, FormControlLabel, Switch, Fade } from '@material-ui/core';
import {db, auth} from '../../firebase'
import firebase from 'firebase'
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appBar: {
    height: '64px !important',
    justifyContent: 'center'
  },
  menuButton: {
    marginRight: theme.spacing(2),
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: '34%',
    },
  },
  searchNoUser: {
    display: 'none'
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      alignItems: 'center !important'
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function Navbar({isUser, setOpenChat, openChat, allUsers, categories}) {
  const classes = useStyles();
  const history = useHistory()
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  
  const [dialogOpen, setDialogOpen] = useState({open: false, sign: ''})
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [checkboxHandle, setCheckboxHandle] = useState(true)

  const [errorUsername, setErrorUsername] = useState({error: false, text: ''})
  const [errorPassword, setErrorPassword] = useState({error: false, text: ''})
  const [errorEmail, setErrorEmail] = useState({error: false, text: ''})
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useState([])
  const [valueAuto, setValueAuto] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [optionSelect, setOptionSelect] = useState('')

  const handleAuth = (e) => {
    setLoading(true)
    e.preventDefault()
    const dbRef = db.collection('users')

    if(dialogOpen.sign === 'up'){
      dbRef.where('username', '==', username).get().then((doc) => {
        if(doc.docs.length > 0){
          setErrorUsername({error: true, text: 'This user already exists'})
          throw new Error('This user already exists')
        } else {
          firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((e) => {
            console.log(e.user)
            dbRef.doc(e.user.uid).set({username: username, email: email})
            setLoading(false)
            setUsername('')
            setEmail('')
            setPassword('')
            setDialogOpen(false)
          })
          .catch((e) => {
            setLoading(false)
            switch(e.code){
              case "auth/weak-password":
                setErrorPassword({error: true, text: 'Password must have at least 6 characteres'})
                break;
              case "auth/email-already-in-use":
                setErrorEmail({error: true, text: 'Email already in use'})
                break;
              default:
                alert(e.message)
            }
          })
        }
      })
      .catch(e => {
        setLoading(false)
      })
    } else{
      dbRef.where('username', '==', email).get().then(doc => {

        if(doc.docs.length > 0){
          firebase.auth().signInWithEmailAndPassword(doc.docs[0].data().email, password)
          .then((user) => {
            setUsername('')
            setEmail('')
            setPassword('')
            setLoading(false)
            setDialogOpen(false)
          }).catch((e) => {
            setLoading(false)
            switch(e.code){
              case "auth/wrong-password":
                setErrorPassword({error: true, text: 'Incorrect password'})
                break;
              case ("auth/user-not-found"):
                setErrorEmail({error: true, text: 'User not found'})
                break;
              case 'auth/invalid-email':
                setErrorEmail({error: true, text: 'User not found'})
                break;
              default:
                alert(e.message)
              }
          })
        } else {
          console.log('no read')
          firebase.auth().signInWithEmailAndPassword(email, password)
          .then(user => {
            setUsername('')
            setEmail('')
            setPassword('')
            setLoading(false)
            setDialogOpen(false)
          }).catch((e) => {
            setLoading(false)
            switch(e.code){
              case "auth/wrong-password":
                setErrorPassword({error: true, text: 'Incorrect password'})
                break;
              case "auth/user-not-found" :
                setErrorEmail({error: true, text: 'User not found'})
                break;
              case 'auth/invalid-email':
                setErrorEmail({error: true, text: 'User not found'})
                break;
              default:
                alert(e.message)
              }
          })
        }
      })
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
    setUsername(''); 
    setEmail(''); 
    setPassword('')
    setErrorPassword({error: false})
    setErrorEmail({error: false})
    setErrorUsername({error: false})
    setLoading(false)
  }

  const handleLogout = (e) => {
    setCheckboxHandle(!checkboxHandle)
    handleMenuClose()
    auth.signOut()
  }

  useEffect(() => {
    if(isUser){
    setSearchParams([...allUsers.map(u => u.data.username), ...categories])

    }

  }, [allUsers, categories, isUser])

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link to="/users" onClick={() => {setOpenChat(false); handleMenuClose()}}><MenuItem>Users</MenuItem></Link>
      <Link to="/groups" onClick={() => {setOpenChat(false); handleMenuClose()}}><MenuItem>Groups</MenuItem></Link>
      
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <Link to="/" onClick={() => {setOpenChat(false); handleMenuClose()}}>
        <MenuItem>
          <IconButton color="inherit">
            <HomeIcon />
          </IconButton>
          <p>Home</p>
        </MenuItem>
      </Link>
      
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton aria-controls="primary-search-account-menu"
                      aria-haspopup="true"
                      color="inherit">
            <PeopleIcon />
          </IconButton>
          <p>People</p>
        </MenuItem>
      
      <MenuItem> 
        <FormControlLabel checked={checkboxHandle} control={<Switch onChange={handleLogout} name="checkedA" />} label="Logout"  />
      </MenuItem>
      <Link to="/profile" onClick={() => {setOpenChat(false); handleMenuClose()}}>
        <MenuItem>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Link>
    </Menu>
  );
  
  return (
    <div className={classes.grow}>
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
        {isUser && 
        <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpenChat(!openChat)}
          >
            <MessageIcon />
          </IconButton>}
          <Link to="/">
            <Typography className={classes.title} variant="h6" noWrap>
              BUSINESS ID CHAT
            </Typography>
          </Link>
          
          <Fade in={searchParams.length > 8 ? true : false}>
            <div className={isUser ? classes.search : classes.searchNoUser}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
               <Autocomplete
                  getOptionSelected={(option, value) => {
                    if(option === value){
                      if(categories.indexOf(option) !== -1){
                        history.push(`/${option}`)
                      } else {
                        history.push(`/c/${option}`)
                      }
                    } 
                    return option === value
                  }}
                    getOptionLabel={option => { return option}}
                    options={searchParams.map(param => param)}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <InputBase
                              {...params.inputProps}
                              placeholder="Search…"
                              classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                              }}
                            />
                      </div>
                    )}
                  />
              
            </div>
          </Fade>
          <div className={classes.grow} />
          {
            !isUser
            ? (<><Button onClick={() => setDialogOpen({open: true, sign: 'up'})} style={{color: 'white'}}>Sign Up </Button> <Button onClick={() => setDialogOpen({open: true, sign: 'in'})} style={{color: 'white'}}>Sign In</Button> </>)
            : (<>
            <div className={classes.sectionDesktop}> 
            <Link to="/">
              <IconButton aria-label="show 4 new mails" color="inherit">
                <HomeIcon />
              </IconButton>
            </Link>
            
              <IconButton edge="end"
                          style={{marginRight: '7px'}}
                          aria-label="social"
                          aria-controls={menuId}
                          aria-haspopup="true"
                          onClick={handleProfileMenuOpen}
                          color="inherit">
                <PeopleIcon />
              </IconButton>
            
            
              <FormControlLabel checked={checkboxHandle} control={<Switch onChange={handleLogout} name="checkedA" />} label="Logout" style={{color: 'white'}} />
            
            <Link to="/profile">
              <IconButton edge="end" color="inherit">
                <AccountCircle />
              </IconButton>
            </Link>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
          </>
        )}
        </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}



        <Dialog open={dialogOpen.open} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sign {dialogOpen.sign === 'up' ? 'Up' : 'In'} to can send messages and connect with people!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={dialogOpen.sign === 'in' ? 'Email or username' : 'Email adress'}
            onChange={(e) => {setEmail(e.target.value); setErrorEmail({error: false})}}
            value={email}
            type="email"
            fullWidth
            error={errorEmail.error}
            helperText={errorEmail.error ? errorEmail.text : ''}
          />
          {dialogOpen.sign === 'up' &&
            (<TextField
              margin="dense"
              id="username"
              label="Username"
              type="text"
              onChange={(e) => {setUsername(e.target.value); setErrorUsername({error: false})}}
              value={username}
              fullWidth
              error={errorUsername.error}
              helperText={errorUsername.error ? errorUsername.text : ''}
            />
          )}
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            onChange={(e) => {setPassword(e.target.value); setErrorPassword(false)}}
            value={password}
            error={errorPassword.error}
            helperText={errorPassword.error ? errorPassword.text : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          {
            loading 
            ? <CircularProgress />
            : <Button onClick={handleAuth} disabled={dialogOpen.sign === 'in' ? !(email && password) : !(username && email && password)} color="primary">
              {
                dialogOpen.sign === 'up' ? 'Sign Up' : 'Sign In'
              }
            </Button>

          }
        </DialogActions>
      </Dialog>
          
    </div>
  );
}
