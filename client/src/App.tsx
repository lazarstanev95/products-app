import './App.css';
import { useDispatch } from 'react-redux';
import { BrowserRouter, useHistory } from 'react-router-dom';
import Routes from './components/routes/Routes';
import Navbar from './components/Navbar';
import jwt_decode from 'jwt-decode';
import { useEffect } from 'react';
import { logoutUser, setCurrentUser } from './components/users/UsersSlice';
import { setAuthToken } from './services/DataService'

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.jwtToken) {
      setAuthToken(localStorage.jwtToken);
      const decoded: any = jwt_decode(localStorage.jwtToken);
      dispatch(setCurrentUser(decoded));
      const currentTime = Date.now() / 1000;
      if(decoded.exp < currentTime) {
        dispatch(logoutUser());
        window.location.href = '/login'
      }
    }
  }, [])

  return (
    <BrowserRouter>
          <div className={'appWrapper'}>
            <Navbar />
            <Routes />
          </div>
    </BrowserRouter>
  );
}

export default App;
