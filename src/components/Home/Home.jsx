import React from 'react'
import { Grid, Slide } from '@material-ui/core';

import LastChatsList from '../LastChatsList/LastChatsList'
import {useStyles} from './style'



function Home(props) {

    const classes = useStyles()

    return (
        <Grid container>

            <Slide direction="up" in={window.innerWidth > 959 ? true : props.openChat} mountOnEnter unmountOnExit>
                <Grid className={`${classes.lastChats} ${window.innerWidth > 959 ? classes.listsMedium : classes.lists}`} xs={12} item md={3}>
                    <LastChatsList uid={props.uid} setOpenChat={props.setOpenChat} />
                </Grid>
            </Slide>
           

            <Grid className={classes.mainGrid} item xs={12} md={9}> 
                {props.children}
            </Grid>
            
        </Grid>
    )
}

export default Home
