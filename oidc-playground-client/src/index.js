import "isomorphic-fetch";
import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.scss';
import App from './pages/App';

polyfill();

ReactDOM.render(<App/>, document.getElementById("app"));