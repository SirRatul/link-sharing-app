import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import Cookies from 'js-cookie';

// bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';

// SCSS
import './assets/scss/index.scss';

axios.interceptors.request.use((request) => {
    if (request.url) {
        request.url = process.env.REACT_APP_APP_API_BACKEND_SERVER + request.url;
    }
    if (localStorage.getItem("token") && Cookies.get('token')) {
        request.headers['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
    }
    return request;
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <App />
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
