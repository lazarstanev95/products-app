import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import CartService from '../../services/cartService';
import { openSnackbar } from '../shared/dynamicSnackbar/DynamicSnackbarSlice';

const cartInitialState: any = {
    cart: [],
    cartTotalCount: 0,
    cartTotalPrice: 0,
    cartLoading: false
}

function startCartLoading(state: any) {
    state.cartLoading = true;
}

function loadingCartFailed(state: any, action: PayloadAction<any>) {
    state.cartLoading = false;
    state.cartError = action.payload.error;
}

const cart = createSlice({
    name: 'cart',
    initialState: cartInitialState,
    reducers: {
        getCartStart: startCartLoading,
        getCartSuccess(state, { payload }: PayloadAction<any>) {
            state.cartLoading = false;
            state.cart = payload.data;
            state.cartTotalCount = payload.totalCount;
            state.cartTotalPrice = payload.totalPrice;
        },
        getCartFailed: loadingCartFailed,
        updateCart(state, { payload }: PayloadAction<any>) {
            state.cart = payload.data;
            state.cartTotalCount = payload.totalCount;
            state.cartTotalPrice = payload.totalPrice;
        },
        resetCart(state, { payload }: PayloadAction<string | undefined>) {
            state.cart = [];
        },
    }
});

export const {
    getCartStart,
    getCartSuccess,
    getCartFailed,
    updateCart,
    resetCart
} = cart.actions;

export default cart.reducer;

export const getCart = (): AppThunk => async (dispatch, getState) => {
    try {
        dispatch(getCartStart());
        const response = await CartService.getCart();
        dispatch(getCartSuccess(response));
    } catch (error) {
        console.log('error', error);
        dispatch(getCartFailed(error));
    }
}

export const addToCart = (productId: any): AppThunk => async (dispatch, getState) => {
    try {
        const data = {
            productId
        }
        const response = await CartService.addToCartProduct(data);
        const updatedCart = await CartService.getCart();
        const payloadNew = {
            data: [...updatedCart.data],
            totalCount: updatedCart.totalCount,
            totalPrice: updatedCart.totalPrice
        }
        dispatch(updateCart(payloadNew));
        dispatch(openSnackbar({
            message: response.data.message,
            severity: 'success'
        }));
        
    } catch (error) {
        console.log('error', error);
        dispatch(openSnackbar({
            message: error,
            severity: 'error'
        }))
    }
}

export const removeFromCart = (productId: any): AppThunk => async (dispatch, getState) => {
    try {
        const data = {
            productId
        }
        const response = await CartService.removeFromCartProduct(data);
        const updatedCart = await CartService.getCart();
        const payloadNew = {
            data: [...updatedCart.data],
            totalCount: updatedCart.totalCount,
            totalPrice: updatedCart.totalPrice
        }
        dispatch(updateCart(payloadNew));
        dispatch(openSnackbar({
            message: response.data.message,
            severity: 'success'
        }));
        
    } catch (error: any) {
        console.log('error', error);
        dispatch(openSnackbar({
            message: error?.response?.data?.error,
            severity: 'error'
        }))
    }
}

export const deleteProductFromCart = (productId: any): AppThunk => async (dispatch, getState) => {
    try {
        const data = {
            productId
        }
        const response = await CartService.deleteProductFromCart(data);
        const updatedCart = await CartService.getCart();
        const payloadNew = {
            data: [...updatedCart.data],
            totalCount: updatedCart.totalCount,
            totalPrice: updatedCart.totalPrice
        }
        dispatch(updateCart(payloadNew));
        dispatch(openSnackbar({
            message: response.data.message,
            severity: 'success'
        }));
        
    } catch (error: any) {
        console.log('error', error);
        dispatch(openSnackbar({
            message: error?.response?.data?.error,
            severity: 'error'
        }))
    }
}

export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartLoading = (state: RootState) => state.cart.cartLoading;
export const selectCartTotalCount = (state: RootState) => state.cart.cartTotalCount;
export const selectCartTotalPrice = (state: RootState) => state.cart.cartTotalPrice;