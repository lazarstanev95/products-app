import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductItem from './ProductItem';
import { getProducts, selectProducts } from './ProductsSlice';
import styles from './Products.module.css';
import ProductService from '../../services/productService';
import { openSnackbar } from '../shared/dynamicSnackbar/DynamicSnackbarSlice';
import { useHistory } from 'react-router';

export default function Products() {
    const products = useSelector(selectProducts);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(getProducts())
    }, [])

    const handleDelete = (productId: any) => {
        ProductService.deleteProductById(productId)
            .then((response: any) => {
                dispatch(openSnackbar({
                    message: response.data.message,
                    severity: 'success'
                }))
                dispatch(getProducts());
            })
            .catch((err: any) => {
                console.log('err', err);
            })
    }

    const handleAddToCart = (productId: any) => {
        const data = {
            productId
        }
        ProductService.addToCartProduct(data)
            .then((response: any) => {
                dispatch(openSnackbar({
                    message: response.data.message,
                    severity: 'success'
                }))
            })
            .catch((err: any) => {
                dispatch(openSnackbar({
                    message: 'Add to cart failed!',
                    severity: 'error'
                }))
                history.push('/products');
            })
    }

    return (
        <main className={styles.productsWrap}>
            <div>
                <Container className={styles.cardGrid} maxWidth="md">
                    <Grid container spacing={4}>
                        {
                            products?.map((item: any, index: number) => {
                                return (
                                    <ProductItem products={item} key={index} onDelete={handleDelete} onAddToCart={handleAddToCart} />
                                )
                            })
                        }
                    </Grid>
                </Container>
            </div>
        </main>
    )
}