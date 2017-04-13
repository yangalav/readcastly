import React from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

class LoginForm extends React.Component {
  constructor() {
		super();

    this.state = {
      email: '',
      password: '',
    };

    
	}

  handleLogin() {
    console.log('The email is: ' + email);
    console.log('The password is: ' + password);
    axios.post('/api/login', {
      email: this.state.email,
      password: this.state.password,
    })
    .then((res) => {
      console.log("post request y'all'");
    });
  }

  render() {
    return (
      <div>
        <form>
          E-mail:<br/>
          <input type="email" name="email"/><br/>
          Password:<br/>
          <input type="password" name="password"/><br/>
          <Button bsStyle="success" onSubmit={this.handleLogin}>Login</Button>
        </form>
      </div>
  	);
  }
}

export default LoginForm;
