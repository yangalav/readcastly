// index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import SignupForm from './components/SignupForm.jsx';
import { Router, Route, hashHistory } from 'react-router';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path='/' component={App}></Route>
    <Route path='/signup' component={SignupForm}></Route>
  </Router>,
  document.getElementById('root')
)
