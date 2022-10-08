import { useRef, useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectIsAuthenticated, selectCurrentUser } from "./users/UsersSlice";

export default function Navbar() {
    const dispatch = useDispatch();
    const history = useHistory();
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const currentUser = useSelector(selectCurrentUser);
    const [menuOpen, handleSetMenuOpen] = useState(false);
    const iconRef = useRef(null);

    const handleOpenMenu = (event: any) => {
        event.stopPropagation();
        handleSetMenuOpen(true)
    }

    const handleClose = () => {
        handleSetMenuOpen(false)
    }

    const handleLogout = (event: any) => {
        event.preventDefault();
        dispatch(logoutUser(history));
        handleClose();
    }

    const authLinks = (
        <div>
            <MenuItem onClick={handleClose} component={Link} to='/'>Home</MenuItem>
            <MenuItem onClick={handleClose}>{currentUser?.name}</MenuItem>
            <MenuItem onClick={handleLogout} component={Link} to='/'>Logout</MenuItem>
        </div>
    )

    const guestLinks = (
        <div>
            <MenuItem onClick={handleClose} component={Link} to='/'>Home</MenuItem>
            <MenuItem onClick={handleClose} component={Link} to='/login'>Login</MenuItem>
            <MenuItem onClick={handleClose} component={Link} to='/register'>Register</MenuItem>
        </div>
    )

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>
                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                        <Typography variant="h6" >
                            E-commerce Project
                        </Typography>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Link to='/cart' style={{color: 'white', textDecoration: 'none'}}>Cart</Link>
                            <div ref={iconRef} onClick={handleOpenMenu}>
                                <IconButton
                                    aria-label="Account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                            </div>
                            <Menu
                                id="menu-appbar"
                                anchorEl={iconRef.current}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={menuOpen}
                                onClose={handleClose}
                            >
                                <div>
                                    {isAuthenticated ? authLinks : guestLinks}
                                </div>
                            </Menu>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}