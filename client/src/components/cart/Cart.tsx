import { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styles from './Cart.module.css';
import CartItem from './CartItem';
import { getCart, selectCart } from './CartSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Cart() {

    const dispatch = useDispatch();
    const cart = useSelector(selectCart);

    useEffect(() => {
        dispatch(getCart());
    }, [])

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
                                <h3>Subtotal ({cart.reduce((a: any, c: any) => a + c.quantity, 0)} items) : ${cart.reduce((a: any, c: any) => a + c.productId.price * c.quantity, 0)}</h3>
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

    return (
        <div className={styles.wrapper}>
            <h1>Shopping Cart</h1>
            <div className={styles.subwrapper}>
                <div>
                    {renderEmptyCart()}
                    {
                        cart?.map((item: any, index: number) => {
                            return (
                                <CartItem cart={item}/>
                            )
                        })
                    }
                </div>
                {renderTotalSection()}
            </div>
        </div>
    )
}