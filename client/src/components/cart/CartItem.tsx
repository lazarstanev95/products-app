import styles from './CartItem.module.css';
import { IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import DeleteIcon from '@material-ui/icons/Delete';

export default function CartItem(props: any) {
    return (
        <div className={styles.cartItemWrap}>
            <div className={styles.imageWrap}>
                <img src={`/image/getImage/${props.cart.productId.productImage}`} alt={props.cart.productId.name} className={styles.image} />
                <a className={styles.cartItemTitle} /* href="" */>{props.cart.productId.name}</a>
            </div>
            <div className={styles.column}>
                <IconButton
                >
                    <RemoveCircleIcon />
                </IconButton>
                <span>{props.cart.quantity}</span>
                <IconButton
                >
                    <AddCircleIcon />
                </IconButton>
            </div>
            <div className={styles.column}>
                ${props.cart.productId.price}
            </div>
            <div className={styles.column}>
                <IconButton
                >
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>
    )
}