import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import { selectIsAuthenticated } from '../users/UsersSlice';
import styles from './ProductItem.module.css';
import { useHistory } from 'react-router';
import { IconButton } from '@material-ui/core';
import { Favorite, FavoriteBorder } from '@material-ui/icons';

export default function ProductItem(props: any) {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const history = useHistory();

    const onEdit = () => {
        history.push('/edit/' + props.products.id);
    }

    return (
        <Grid item /* key={card} */ xs={12} sm={6} md={4} className={styles.tileWrap}>
            <Card className={styles.card} >
                <CardMedia
                    className={styles.cardMedia}
                    image={props.products.productImage}
                    title="Image title"
                />
                <CardContent className={styles.cardContent} >
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.products.name}
                    </Typography>
                    <Typography>
                        {`description - ${props.products.description}`}
                    </Typography>
                    <Typography>
                        {props.products.price}
                    </Typography>
                    {
                        props.isLiked ?
                            <IconButton 
                                onClick={() => props.onUnlike(props.products.id)} 
                                classes={{root: styles.like}}
                            >
                                <Favorite />
                            </IconButton> :
                            <IconButton 
                                onClick={() => props.onLike(props.products.id)}
                                classes={{root: styles.unlike}}
                            >
                                <FavoriteBorder />
                            </IconButton>
                    }
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary">
                        View
                        </Button>
                    {
                        isAuthenticated ?
                            <Button onClick={() => props.onAddToCart(props.products.id)} size="small" color="primary">
                                Add to Cart
                            </Button> : null
                    }
                    <Button size="small" color="primary" onClick={onEdit} >
                        Edit
                    </Button>
                    <Button onClick={() => props.onDelete(props.products.id)} size="small" color="primary">
                        Delete
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    )
}