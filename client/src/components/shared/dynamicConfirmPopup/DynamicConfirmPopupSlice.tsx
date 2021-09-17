import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

interface IConfirmPopupState {
    message: string,
    url: string,
    confirmPopupIsOpen: boolean,
    callback: Function | null
}

const initialState: IConfirmPopupState = {
    message: '',
    url: '',
    confirmPopupIsOpen: false,
    callback: null
}

const confirmPopup = createSlice({
    name: 'confirmPopup',
    initialState,
    reducers: {
        openConfirmPopup(state, { payload }: PayloadAction<any>) {
            state.message = payload.message;
            state.url = payload.url;
            state.callback = payload.callback;
            state.confirmPopupIsOpen = true;
        },
        closeConfirmPopup(state) {
            state.message = '';
            state.url = '';
            state.callback = null;
            state.confirmPopupIsOpen = false;
        }
    }
});

export const {
    openConfirmPopup,
    closeConfirmPopup
} = confirmPopup.actions;

export default confirmPopup.reducer;

export const getConfirmPopup = (state: RootState) => state.confirmPopup;