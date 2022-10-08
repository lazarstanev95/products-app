import { Link, useHistory } from 'react-router-dom';
import styles from './Cart.module.css';

export default function Cart() {
    return (
        <div className={styles.wrapper}>
            <h1>Shopping Cart</h1>
            <div className={styles.subwrapper}>
                <div className={styles.emptyCart}>
                    Cart is empty. 
                    <Link to='/products' style={{color: '#0a58ca', marginLeft: 5}}>
                        Go Shopping
                    </Link>
                </div>
                <div className={styles.totalWrap}>
                <div className={styles.card}>
                    <div className={styles.cardBody}>
                        <div className={`${styles.listGroup} ${styles.listGroupFlush}`}>
                            <div className={styles.listGroupItem}>
                                <h3>Subtotal (0 items) : $0</h3>
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
            </div>
        </div>
    )
}