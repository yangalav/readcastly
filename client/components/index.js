// index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import { Router,
        Route,
        hashHistory,
        Link
} from 'react-router'

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}/>
  </Router>
  ),
  document.getElementById('root')
)
