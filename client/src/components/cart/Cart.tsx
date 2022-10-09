import { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styles from './Cart.module.css';
import CartItem from './CartItem';
import { 
    addToCart, 
    deleteProductFromCart, 
    getCart, 
    removeFromCart, 
    selectCart, 
    selectCartLoading, 
    selectCartTotalCount, 
    selectCartTotalPrice 
} from './CartSlice';
import { useDispatch, useSelector } from 'react-redux';
import DynamicLoader from '../shared/dynamicLoader/DynamicLoader';

export default function Cart() {

    const dispatch = useDispatch();
    const cart = useSelector(selectCart);
    const isLoading = useSelector(selectCartLoading);
    const totalCount = useSelector(selectCartTotalCount);
    const totalPrice = useSelector(selectCartTotalPrice);

    useEffect(() => {
        dispatch(getCart());
    }, [])

    const handleAddToCart = (productId: any) => {
        dispatch(addToCart(productId));
    }

    const handleRemoveFromCart = (productId: any) => {
        dispatch(removeFromCart(productId));
    }

    const handleDeleteFromCart = (productId: any) => {
        dispatch(deleteProductFromCart(productId));
    }

    const renderEmptyCart = () => {
        if (!cart.length) {
            return (
                <div className={styles.emptyCart}>
                    Cart is empty.
                    <Link to='/products' style={{ color: '#0a58ca', marginLeft: 5 }}>
                        Go Shopping
                    </Link>
                </div>
            )
        }
    }

    const renderTotalSection = () => {
        return (
            <div className={styles.totalWrap}>
                <div className={styles.card}>
                    <div className={styles.cardBody}>
                        <div className={`${styles.listGroup} ${styles.listGroupFlush}`}>
                            <div className={styles.listGroupItem}>
                                <h3>Subtotal ({totalCount} items) : ${totalPrice}</h3>
                            </div>
                            <div className={styles.listGroupItem}>
                                <div>
                                    <button type="button" disabled={false} className={styles.btn}>
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderCartItems = () => {
        if (isLoading) {
            return (
                <div className={styles.loaderWrap}>
                    <DynamicLoader />
                </div>
            )
        }
        if (cart.length !== 0) {
            return cart?.map((item: any, index: number) => {
                return (
                    <CartItem
                        cart={item}
                        onAddToCart={handleAddToCart}
                        onRemoveFromCart={handleRemoveFromCart}
                        onDeleteFromCart={handleDeleteFromCart}
                    />
                )
            })
        }

        return (
            renderEmptyCart()
        )
    }

    return (
        <div className={styles.wrapper}>
            <h1>Shopping Cart</h1>
            <div className={styles.subwrapper}>
                <div>
                    {renderCartItems()}
                </div>
                {renderTotalSection()}
            </div>
        </div>
    )
}