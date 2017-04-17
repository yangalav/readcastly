import React from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { hashHistory } from 'react-router';

//blah
class LogoutButton extends React.Component {
  constructor() {
    super();

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(e){
    e.preventDefault();
    console.log('handleddd logout');
    return axios.get('/api/logout')
    .then((res) => {
      console.log("get requesttt logout button" + res);
      hashHistory.push('/login');
      return;
    });
  }

render() {
  return (
      <div>
        <Button onClick={this.handleLogout}>Logout</Button>
      </div>
    );
  }
}

export default LogoutButton;
