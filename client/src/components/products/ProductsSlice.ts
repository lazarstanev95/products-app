import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import ProductService from '../../services/productService';
import { openSnackbar } from '../shared/dynamicSnackbar/DynamicSnackbarSlice';

export const DOCS_ON_PAGE = 10;

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
            const { data, count, productsListHasMoreItems } = payload;
            state.productsLoading = false;
            state.products = data;
            state.productsCount = count;
            state.productsListHasMoreItems = productsListHasMoreItems;
            state.productsFetched = true;
        },
        getProductsFailed: loadingProductsFailed,
        resetProducts(state, { payload }: PayloadAction<string | undefined>) {
            //TODO
            state.productsFetched = false;
        },
    }
});

export const {
    getProductsStart,
    getProductsSuccess,
    getProductsFailed,
    resetProducts
} = products.actions;

export default products.reducer;

export const getProducts = (payload?: any): AppThunk => async (dispatch, getState) => {
    try {
        dispatch(getProductsStart());
        const response = await ProductService.getProducts(payload);
        const { products } = getState().products;
        const currentPage = payload.page;
        let itemsData;
        if (currentPage !== 1) {
            itemsData = [...products, ...response.data]
        }
        const payloadNew = {
            data: itemsData || response.data,
            count: response.count,
            productsListHasMoreItems: response.data.length === DOCS_ON_PAGE,
            page: currentPage
        }
        dispatch(getProductsSuccess(payloadNew));
    } catch (error) {
        console.log('error', error);
        dispatch(getProductsFailed(error))
    }
}

export const selectProducts = (state: RootState) => state.products.products;
export const selectProductsIsLoading = (state: RootState) => state.products.productsLoading;
export const selectProductsFetched = (state: RootState) => state.products.productsFetched;
export const selectProductsListHasMoreItems = (state: RootState) => state.products.productsListHasMoreItems;