import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import Home from './components/Home';
import * as serviceWorker from './serviceWorker';
import { CookiesProvider } from 'react-cookie';

ReactDOM.render(
<CookiesProvider>
<Home />
</CookiesProvider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
