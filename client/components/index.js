// index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import SignupForm from './SignupForm';
import { Router, Route, hashHistory } from 'react-router'; 

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path='/' component={App}></Route>
    <Route path='/signup' component={SignupForm}></Route>
  </Router>,
  document.getElementById('root')
)
