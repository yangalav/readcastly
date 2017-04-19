import React from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { hashHistory } from 'react-router';

class LoginForm extends React.Component {
  constructor() {
		super();

    this.state = {
      email: '',
      password: '',
    };

   this.handleLogin = this.handleLogin.bind(this);
   this.handleEmailChange = this.handleEmailChange.bind(this);
   this.handlePasswordChange = this.handlePasswordChange.bind(this);
	}

  handleLogin(e) {
    e.preventDefault();
    console.log("The email is: " + this.state.email);
    console.log("The password is: " + this.state.password);
    axios.post('/api/login', {
      email: this.state.email,
      password: this.state.password,
    })
		.then((res) => {
			console.log("post request hahahahahaha" + res);
      hashHistory.push('/app');
      return;
		});
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleLogin}>
          E-mail:<br/>
        <input type="email" name="email" value={this.state.email} onChange={this.handleEmailChange}/><br/>
          Password:<br/>
        <input type="password" name="password" value={this.state.password} onChange={this.handlePasswordChange}/><br/>
          <Button type="submit" bsStyle="success">Login</Button>
        </form>
        <div>Don't have an account? <a href="/#/signup">Sign up here</a></div>
      </div>
  	);
  }
}

export default LoginForm;
