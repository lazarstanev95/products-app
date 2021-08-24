import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

const initialState: any = {};

const snackbar = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        openSnackbar(state, { payload }: PayloadAction<any>) {
            state.message = payload.message;
            state.severity = payload.severity;
            state.snackbarIsOpen = true;
        },
        closeSnackbar(state) {
            state.snackbarIsOpen = false;
            state.message = '';
        }
    }
});

export const {
    openSnackbar,
    closeSnackbar
} = snackbar.actions;

export default snackbar.reducer;

export const getSnackbar = (state: RootState) => state.snackbar;