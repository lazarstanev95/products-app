import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import userService from '../../services/userService';
import jwt_decode from 'jwt-decode';
import { setAuthToken } from '../../services/DataService';
import isEmpty from '../../validation/is-empty';
import { openSnackbar } from '../shared/dynamicSnackbar/DynamicSnackbarSlice';

const usersInitialState: any = {
    user: null,
    isAuthenticated: false,
    users: [],
    usersCount: 0,
    usersLoading: false,
    usersError: null
}

function startUsersLoading(state: any) {
    state.usersLoading = true;
}

function loadingUsersFailed(state: any, action: PayloadAction<any>) {
    state.usersLoading = false;
    state.usersError = action.payload.error;
}

const users = createSlice({
    name: 'users',
    initialState: usersInitialState,
    reducers: {
        getUsersStart: startUsersLoading,
        getUsersSuccess(state, { payload }: PayloadAction<any>) {
            state.usersLoading = false;
            state.users = payload.data;
            state.usersCount = payload.count;
        },
        getUsersFailure: loadingUsersFailed,
        setCurrentUser(state, { payload }: PayloadAction<any>) {
            state.user = payload;
            state.isAuthenticated = !isEmpty(payload);
        }
    }
});

export const {
    getUsersStart,
    getUsersSuccess,
    getUsersFailure,
    setCurrentUser
} = users.actions;

export default users.reducer;

export const getUsers = (payload: any): AppThunk => async (dispatch) => {
    try {
        dispatch(getUsersStart());

    } catch (error) {
        console.log('error', error);
    }
}

export const registerUSer = (payload: any, history: any): AppThunk => async (dispatch) => {
    try {
        const response: any = await userService.registerUser(payload);
        dispatch(openSnackbar({
            message: 'Profile created',
            severity: 'success'
        }))
        history.push('/login')
    } catch (error) {
        console.log('error', error);
    }
}

export const loginUser = (payload: any, history: any): AppThunk => async (dispatch) => {
    try {
        const response: any = await userService.loginUser(payload);
        localStorage.setItem('jwtToken', response.token);
        setAuthToken(response.token);
        const decoded = jwt_decode(response.token);
        dispatch(setCurrentUser(decoded));
        dispatch(openSnackbar({
            message: 'Successfully logged',
            severity: 'success'
        }))
        history.push('/')
    } catch (error) {
        console.log('error', error);
    }
}

export const logoutUser = (history: any): AppThunk => (dispatch) => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    if (history) {
        history.push('/login');
    }
}

export const selectCurrentUser = (state: RootState) => state.users.user;
export const selectIsAuthenticated = (state: RootState) => state.users.isAuthenticated;