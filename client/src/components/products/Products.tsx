import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductItem from './ProductItem';
import { getProducts, selectProducts } from './ProductsSlice';
import styles from './Products.module.css';

export default function Products() {
    const products = useSelector(selectProducts);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getProducts())
    }, [])

    return (
        <main>
            <div>
                <Container className={styles.cardGrid} maxWidth="md">
                    <Grid container spacing={4}>
                        {
                            products?.map((item: any, index: number) => {
                                return (
                                    <ProductItem products={item} key={index} />
                                )
                            })
                        }
                    </Grid>
                </Container>
            </div>
        </main>
    )
}