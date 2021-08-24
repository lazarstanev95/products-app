
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import snackbarReducer from '../components/shared/dynamicSnackbar/DynamicSnackbarSlice';
import usersReducer from '../components/users/UsersSlice';

export const store = configureStore({
    reducer: {
        snackbar: snackbarReducer,
        users: usersReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;