import React from 'react';
import { Button } from 'react-bootstrap';
import { hashHistory } from 'react-router';

class LoginButton extends React.Component {
  constructor() {
    super();

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(e){
    e.preventDefault();
    console.log('handleddd login');
    hashHistory.push('/login');
  }

render() {
  return (
      <div>
        <Button onClick={this.handleLogin}>Login</Button>
      </div>
    );
  }
}

export default LoginButton;
