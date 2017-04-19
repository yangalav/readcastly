// index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import SignupForm from './components/SignupForm.jsx';
import LoginForm from './components/LoginForm.jsx';
import Splash from './components/Splash.jsx';
import { Router, Route, hashHistory } from 'react-router';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path='/' component={Splash}></Route>
    <Route path='/signup' component={SignupForm}></Route>
    <Route path='/login' component={LoginForm}></Route>
    <Route path='/app' component={App}></Route>
  </Router>,
  document.getElementById('root')
)
