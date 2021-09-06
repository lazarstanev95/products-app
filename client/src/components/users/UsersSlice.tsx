import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import userService from '../../services/userService';
import jwt_decode from 'jwt-decode';
import { setAuthToken } from '../../services/DataService';
import isEmpty from '../../validation/is-empty';
import { openSnackbar } from '../shared/dynamicSnackbar/DynamicSnackbarSlice';

export const DOCS_ON_PAGE = 10;

const usersInitialState: any = {
    currentUser: null,
    user: null,
    userByIdLoading: false,
    userByIdError: null,
    isAuthenticated: false,
    users: [],
    usersPage: 0,
    usersCount: 0,
    usersFetched: false,
    usersLoading: false,
    usersError: null,
    usersListHasMoreItems: true
}

function startUsersLoading(state: any) {
    state.usersLoading = true;
}

function startUserByIdLoading(state: any) {
    state.userByIdLoading = true;
    state.user = null;
}

function loadingUsersFailed(state: any, action: PayloadAction<any>) {
    state.usersLoading = false;
    state.usersError = action.payload.error;
}

function loadingUserByIdFailed(state: any, action: PayloadAction<any>) {
    state.userByIdLoading = false;
    state.userByIdError = action.payload.error;
}

const users = createSlice({
    name: 'users',
    initialState: usersInitialState,
    reducers: {
        getUsersStart: startUsersLoading,
        getUsersSuccess(state, { payload }: PayloadAction<any>) {
            const { data, page, count, usersListHasMoreItems } = payload
            state.usersLoading = false;
            state.users = data;
            state.usersCount = count;
            state.usersListHasMoreItems = usersListHasMoreItems;
            state.usersFetched = true;
            state.usersPage = page;
        },
        getUsersFailure: loadingUsersFailed,
        resetUsers(state, { payload }: PayloadAction<string | undefined>) {
            //TODO
            state.usersFetched = false;
        },
        setCurrentUser(state, { payload }: PayloadAction<any>) {
            state.currentUser = payload;
            state.isAuthenticated = !isEmpty(payload);
        },
        getUserByIdStart: startUserByIdLoading,
        getUserByIdSuccess(state, { payload }: PayloadAction<any>) {
            state.userByIdLoading = false;
            state.user = payload;
        },
        getUserByIdFailure: loadingUserByIdFailed
    }
});

export const {
    getUsersStart,
    getUsersSuccess,
    getUsersFailure,
    resetUsers,
    setCurrentUser,
    getUserByIdStart,
    getUserByIdSuccess,
    getUserByIdFailure
} = users.actions;

export default users.reducer;

export const getUsers = (payload: any): AppThunk => async (dispatch, getState) => {
    try {
        dispatch(getUsersStart());
        const response: any = await userService.getUsers(payload);
        const { users } = getState().users;
        const currentPage = payload.page;
        let itemsData;
        if (currentPage !== 1) {
            itemsData = [...users, ...response.data]
        }
        const payloadNew = {
            data: itemsData || response.data,
            count: response.count,
            usersListHasMoreItems: response.data.length === DOCS_ON_PAGE,
            page: currentPage
        }
        dispatch(getUsersSuccess(payloadNew));
    } catch (error) {
        console.log('error', error);
        dispatch(getUsersFailure(error));
    }
}

export const registerUSer = (payload: any, history: any): AppThunk => async (dispatch) => {
    try {
        await userService.registerUser(payload);
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

export const logoutUser = (history?: any): AppThunk => (dispatch) => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    if (history) {
        history.push('/login');
    }
}

export const getUserById = (id: any): AppThunk => async (dispatch) => {
    try {
        dispatch(getUserByIdStart());
        const response = await userService.getUserById(id);
        dispatch(getUserByIdSuccess(response));
    } catch (error) {
        dispatch(getUserByIdFailure(error))
    }
}

export const saveUserById = (id: any, payload: any, history: any): AppThunk => async (dispatch) => {
    try {
        const response = await userService.saveUserById(id, payload);
        dispatch(openSnackbar({
            message: response.message,
            severity: 'success'
        }))
        if (history) {
            history.push('/users');
        }
    } catch (error) {
        console.log('error', error);
    }
}

export const selectCurrentUser = (state: RootState) => state.users.currentUser;
export const selectIsAuthenticated = (state: RootState) => state.users.isAuthenticated;
export const selectUsers = (state: RootState) => state.users.users;
export const selectUserById = (state: RootState) => state.users.user;
export const selectUsersIsLoading = (state: RootState) => state.users.usersLoading;
export const selectUsersFetched = (state: RootState) => state.users.usersFetched;
export const selectUsersListHasMoreItems = (state: RootState) => state.users.usersListHasMoreItems;