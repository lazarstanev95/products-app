import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import ProductService from '../../services/productService';
import { openSnackbar } from '../shared/dynamicSnackbar/DynamicSnackbarSlice';

const productsInitialState: any = {
    products: [],
    productsPage: 0,
    productsCount: 0,
    productsFetched: false,
    productsLoading: false,
    productsError: null,
    productsListHasMoreItems: true
}

function startProductsLoading(state: any) {
    state.productsLoading = true;
}

function loadingProductsFailed(state: any, action: PayloadAction<any>) {
    state.productsLoading = false;
    state.productsError = action.payload.error;
}

const products = createSlice({
    name: 'products',
    initialState: productsInitialState,
    reducers: {
        getProductsStart: startProductsLoading,
        getProductsSuccess(state, { payload }: PayloadAction<any>) {
            const { data, count } = payload;
            state.productsLoading = false;
            state.products = data;
            state.productsCount = count;
            state.productsFetched = true;
        },
        getProductsFailed: loadingProductsFailed
    }
});

export const {
    getProductsStart,
    getProductsSuccess,
    getProductsFailed
} = products.actions;

export default products.reducer;

export const getProducts = (payload?: any): AppThunk => async (dispatch) => {
    try {
        dispatch(getProductsStart());
        const response = await ProductService.getProducts();
        dispatch(getProductsSuccess(response));
    } catch (error) {
        console.log('error', error);
        dispatch(getProductsFailed(error))
    }
}

export const selectProducts = (state: RootState) => state.products.products;
export const selectProductsIsLoading = (state: RootState) => state.products.productsLoading;