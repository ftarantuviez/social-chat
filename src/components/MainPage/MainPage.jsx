import React from 'react'
import { Typography, Grid } from '@material-ui/core'
import CategoriesCard from '../CategoriesCard/CategoriesCard'

import {useStyles} from './styles'

const categories = [
    {title: 'Science', description: 'Science is fascinating. All the time it is updating. Come in and share your knowledge with people who loves science from all over the world!', imageUrl: 'https://images.pexels.com/photos/745708/pexels-photo-745708.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', link: 'science'},
    {title: 'Technology', description: 'Every two years the computing capacity doubles. New news is there all the time. Meet people from the world of technology and share with them!', imageUrl: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', link: 'technology'},
    {title: 'Business', description: 'The companies are awesome. Financial statements, new investments, emerging startups and more! Welcome entrepreneurs and business-loving people', imageUrl: 'https://images.pexels.com/photos/814544/pexels-photo-814544.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', link: 'business'},
    {title: 'Travels', description: ' A travellers chat. Lovers of travel and exploration of the world. Share your best tourist adventures with people who like to travel and visit countries!', imageUrl: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', link: 'travels'},
    {title: 'Religion', description: 'All kinds of religions. A chat where the thoughts of the other are attended without prejudging! Are you religious? Share your ideas!', imageUrl: 'https://images.pexels.com/photos/2236674/pexels-photo-2236674.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', link: 'religion'},
    {title: 'Laws', description: 'Do you want to be a lawyer? Are you a lawyer? Do you like the laws? This chat is for you. Discuss the most recently decissions in the world.', imageUrl: 'https://images.pexels.com/photos/618158/pexels-photo-618158.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', link: 'laws'},
    {title: 'Sports', description: 'Share the latest news from the world of sports. Soccer, swimming, rugby, baseball, basketball, and more! Which is your team?', imageUrl: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', link: 'sports'},
    {title: 'Art', description: 'If you are a creative person, this chat is definetly for you! Is for you to meet another creative people...', imageUrl: 'https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', link: 'art'},
  ]

function MainPage() {
    const classes = useStyles()

    return (
        <div>
            <Typography className={classes.mainGridTitle} variant="h4" color="textPrimary">Categories</Typography>
                <Grid className={classes.categoriesCardContainer} container spacing={3}>
                {
                    categories.map(categorie => (
                        <Grid item xs={12} sm={6} md={4}>
                            <CategoriesCard {...categorie} />
                        </Grid>
                    ))
                }
            </Grid>
        </div>
    )
}

export default MainPage
