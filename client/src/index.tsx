import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { createTheme, StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import { DynamicSnackbar } from './components/shared/dynamicSnackbar/DynamicSnackbar';
import reportWebVitals from './reportWebVitals';
import DynamicConfirmPopup from './components/shared/dynamicConfirmPopup/DynamicConfirmPopup';
import SearchInPopupContainer from './components/shared/searchInPopup/SearchInPopupContainer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a38d6'
    },
    secondary: {
      main: '#8092a9'
    }
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <Provider store={store}>
          <App />
          <DynamicSnackbar />
          <DynamicConfirmPopup />
          <SearchInPopupContainer />
        </Provider>
      </StylesProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
