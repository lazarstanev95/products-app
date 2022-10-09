import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import CartService from '../../services/cartService';

const cartInitialState: any = {
    cart: []
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
            state.cart = payload.data
        },
        getCartFailed: loadingCartFailed,
    }
});

export const {
    getCartStart,
    getCartSuccess,
    getCartFailed
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

export const selectCart = (state: RootState) => state.cart.cart;