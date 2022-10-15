import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, selectUsers, selectUsersIsLoading, selectUsersFetched, selectUsersListHasMoreItems, resetUsers, DOCS_ON_PAGE } from './UsersSlice';
import UserItem from './UserItem';
import DynamicInfiniteScroll from '../shared/dynamicInfiniteScroll/DynamicInfiniteScroll';
import styles from './Users.module.css';
import DynamicSearch from '../shared/dynamicSearch/DynamicSearch';

export default function Users() {
    let [searchString, setSearchString] = useState('');
    const users = useSelector(selectUsers);
    const isLoading = useSelector(selectUsersIsLoading);
    const itemsFetched = useSelector(selectUsersFetched);
    const hasMoreItems = useSelector(selectUsersListHasMoreItems);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);

    const handleChange = (value: any) => {
        setSearchString(value);
    }
    const data = {
        searchString: searchString,
        page: 1,
        docs: DOCS_ON_PAGE,
    }
    useEffect(() => {
        if (!itemsFetched) {
            setCurrentPage(1);
            dispatch(getUsers(data))
        }
        return () => {
            dispatch(resetUsers())
        }
    }, [])

    const handleScrollUsers = () => {
        if (!hasMoreItems) {
            return;
        }
        setCurrentPage(currentPage + 1);
        dispatch(getUsers({
            searchString: searchString,
            page: currentPage + 1,
            docs: DOCS_ON_PAGE,
        }))
    }

    const getSearchUsers = () => {
        setCurrentPage(1);
        dispatch(getUsers(data))
    }

    const handleOnClear = () => {
        setSearchString('');
        setCurrentPage(1);
        dispatch(getUsers({
            searchString: '',
            page: 1,
            docs: DOCS_ON_PAGE,
        }))
    }

    return (
        <div>
            <div className={styles.searchWrap}>
                <DynamicSearch
                    valueProp={searchString}
                    inputStyles={styles.inputSearch}
                    iconSearchStyles={styles.searchIcon}
                    clearOnEnterKey={false}
                    hasSearchIcon={true}
                    hasClearIcon={true}
                    onChange={handleChange}
                    onEnterKey={getSearchUsers}
                    placeholder={'Search for user'}
                    handleOnClear={handleOnClear}
                />
            </div>
            <h1 style={{ textAlign: 'center' }}>Users information</h1>
            <div style={{ display: 'flex', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.26)', height: 40, alignItems: 'center', maxWidth: 1000, margin: 'auto', marginTop: 20 }}>
                <div style={{ marginLeft: 20, width: 200, textAlign: 'center', fontSize: 20, fontWeight: 500 }}>First Name</div>
                <div style={{ marginLeft: 20, width: 200, textAlign: 'center', fontSize: 20, fontWeight: 500 }}>Last Name</div>
                <div style={{ marginLeft: 20, width: 200, textAlign: 'center', fontSize: 20, fontWeight: 500 }}>Email</div>
                <div style={{ marginLeft: 20, width: 200, textAlign: 'center', fontSize: 20, fontWeight: 500 }}>Is Admin</div>
            </div>
            <div style={{ overflowY: 'auto', height: 450, padding: '0px 20px' }}>
                <DynamicInfiniteScroll
                    hideHorizontalTrack={true}
                    autoHeight={false}
                    isLoading={isLoading}
                    minHeight={220}
                    maxHeight="none"
                    scrollOffset={1}
                    onScroll={handleScrollUsers}
                    manual={true}
                    contentWrapperStyle={styles.contentWrapper}
                >
                    {users.map((item: any, index: number) => {
                        return (
                            <UserItem users={item} key={index} />
                        )
                    })}
                </DynamicInfiniteScroll>
            </div>
        </div>
    )
}