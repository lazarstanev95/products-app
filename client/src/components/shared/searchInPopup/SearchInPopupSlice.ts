import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from "../../../app/store";

interface ISearchInPopupState {
    searchText: string;
}

const initialState: ISearchInPopupState = {
    searchText: ''
}

const searchInPopup = createSlice({
    name: 'searchInPopup',
    initialState,
    reducers: {
        setSearchTextSuccess(state, { payload }: PayloadAction<any>) {
            state.searchText = payload.searchText;
        }
    }
});

export const {
    setSearchTextSuccess
} = searchInPopup.actions;

export default searchInPopup.reducer;

export const setSerchText = (text: any): AppThunk => async (dispatch, getState) => {
    dispatch(setSearchTextSuccess({
        searchText: text
    }));
}

export const getSearchText = (state: RootState) => state.searchInPopup.searchText;