
import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import snackbarReducer from '../components/shared/dynamicSnackbar/DynamicSnackbarSlice';
import usersReducer from '../components/users/UsersSlice';
import productsReducer from '../components/products/ProductsSlice';

export const store = configureStore({
    reducer: {
        snackbar: snackbarReducer,
        users: usersReducer,
        products: productsReducer
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false
    })
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;