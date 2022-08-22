import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductItem from './ProductItem';
import { DOCS_ON_PAGE, getProducts, resetProducts, selectProducts, selectProductsFetched, selectProductsIsLoading, selectProductsListHasMoreItems, updateProductsLikes } from './ProductsSlice';
import styles from './Products.module.css';
import ProductService from '../../services/productService';
import { openSnackbar } from '../shared/dynamicSnackbar/DynamicSnackbarSlice';
import { useHistory } from 'react-router';
import { openConfirmPopup } from '../shared/dynamicConfirmPopup/DynamicConfirmPopupSlice';
import DynamicInfiniteScroll from '../shared/dynamicInfiniteScroll/DynamicInfiniteScroll';
import { selectCurrentUser } from '../users/UsersSlice';

export default function Products() {
    const products = useSelector(selectProducts);
    const isLoading = useSelector(selectProductsIsLoading);
    const itemsFetched = useSelector(selectProductsFetched);
    const hasMoreItems = useSelector(selectProductsListHasMoreItems);
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const history = useHistory();
    const [currentPage, setCurrentPage] = useState(1);

    const data = {
        page: 1,
        docs: DOCS_ON_PAGE,
    }
    useEffect(() => {
        if (!itemsFetched) {
            setCurrentPage(1);
            dispatch(getProducts(data))
        }
        return () => {
            dispatch(resetProducts());
        }
    }, [])

    const handleScrollProducts = () => {
        if (!hasMoreItems) {
            return;
        }
        setCurrentPage(currentPage + 1);
        dispatch(getProducts({
            page: currentPage + 1,
            docs: DOCS_ON_PAGE,
        }))
    }

    const handleDelete = (productId: any) => {
        dispatch(openConfirmPopup({
            message: 'Are you sure you want to delete this product?',
            url: '',
            callback: () => {
                ProductService.deleteProductById(productId)
                    .then((response: any) => {
                        dispatch(openSnackbar({
                            message: response.data.message,
                            severity: 'success'
                        }))
                        dispatch(getProducts(data));
                        setCurrentPage(1);
                    })
                    .catch((err: any) => {
                        console.log('err', err);
                    })
            }
        }))
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

    const handleLike = (productId: any) => {
        ProductService.likeProduct(productId)
            .then((response: any) => {
                dispatch(openSnackbar({
                    message: response.data.message,
                    severity: 'success'
                }))
                dispatch(updateProductsLikes({
                    userId: currentUser.id,
                    productId
                }));
            })
            .catch((err: any) => {
                dispatch(openSnackbar({
                    message: 'Like product failed!',
                    severity: 'error'
                }))
            });
    }

    const handleUnlike = (productId: any) => {
        ProductService.unlikeProduct(productId)
            .then((response: any) => {
                dispatch(openSnackbar({
                    message: response.data.message,
                    severity: 'success'
                }))
                dispatch(updateProductsLikes({
                    userId: currentUser.id,
                    productId
                }));
            })
            .catch((err: any) => {
                dispatch(openSnackbar({
                    message: 'Unlike product failed!',
                    severity: 'error'
                }))
            });
    }

    return (
        <main className={styles.productsWrap}>
            <div style={{ height: 'inherit' }}>
                <DynamicInfiniteScroll
                    hideHorizontalTrack={true}
                    autoHeight={false}
                    isLoading={isLoading}
                    minHeight={220}
                    maxHeight="none"
                    scrollOffset={1}
                    onScroll={handleScrollProducts}
                    manual={true}
                    contentWrapperStyle={styles.contentWrap}
                >
                    {
                        products?.map((item: any, index: number) => {
                            const isLiked = item.likes.some((id: any) => id === currentUser.id);
                            return (
                                <ProductItem 
                                    products={item}
                                    key={index}
                                    isLiked={isLiked}
                                    onDelete={handleDelete}
                                    onAddToCart={handleAddToCart}
                                    onLike={handleLike}
                                    onUnlike={handleUnlike}
                                />
                            )
                        })
                    }
                </DynamicInfiniteScroll>
            </div>
        </main>
    )
}