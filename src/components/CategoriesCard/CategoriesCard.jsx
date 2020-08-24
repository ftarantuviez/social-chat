import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    margin: '7px'
  },
  media: {
    height: 140,
  },
});



export default function CategoriesCard({title, description, link, imageUrl}) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <Link to={link}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={imageUrl}
            title={title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Link to={link}>
          <Button size="small" color="primary">
            Join chat
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
