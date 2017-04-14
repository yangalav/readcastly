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

   this.handleLogin = this.handleLogin.bind(this);
	}

  handleLogin(e) {
    // console.log('The email is: ' + email);
    // console.log('The password is: ' + password);
    // axios.post('/api/login', {
    //   email: this.state.email,
    //   password: this.state.password,
    // })
    // .then((res) => {
    //   console.log("post request y'all'");
    // });
    e.preventDefault()
    console.log('pressed');
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleLogin}>
          E-mail:<br/>
          <input type="email" name="email"/><br/>
          Password:<br/>
          <input type="password" name="password"/><br/>
          <Button type="submit" bsStyle="success">Login</Button>
        </form>
      </div>
  	);
  }
}

export default LoginForm;
