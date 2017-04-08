// index.js

import React from 'react';
import ReactDOM from 'react-dom';
<<<<<<< HEAD
import App from './app';
import SignupForm from './SignupForm';
import { Router, Route, hashHistory } from 'react-router';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path='/' component={App}></Route>
    <Route path='/signup' component={SignupForm}></Route>
  </Router>,
=======
import App from './App.js';
import { Router,
        Route,
        hashHistory,
        Link
} from 'react-router'

ReactDOM.render((
  <Router history={hashHistory} >
    <Route path="/" component={App}/>
  </Router>
  ),
>>>>>>> a985597a0afccd59f9f76d2106bb553a2935ed81
  document.getElementById('root')
)
