import React from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

class SignupForm extends React.Component {
  constructor() {
		super();

    this.state = { email: '', password: '' };

    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
	}

  handleSignUp(e) {
    console.log("The email is: " + this.state.email);
    console.log("The password is: " + this.state.password);
    axios.post('/signup', {email: this.state.email, password: this.state.password})
		.then((res) => {
			console.log("POST REQUESTTTTTTTTTTTTTTTTTTTTTT");
			return;
		})
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  render() {
    return (
      <div>
        <form>
          First Name:<br/>
          <input type="text" name="firstName"/><br/>
          Last Name:<br/>
          <input type="text" name="lastName"/><br/>
          E-mail:<br/>
          <input type="email" name="email" value={this.state.email} onChange={this.handleEmailChange}/><br/>
          Password:<br/>
        <input type="password" name="password" value={this.state.password} onChange={this.handlePasswordChange}/><br/>
          Avatar:<br/>
          <input type="url" name="avatar"/><br/>
          <Button bsStyle="success" onClick={this.handleSignUp}>Sign Up</Button>
        </form>
      </div>
  	);
  }
}

export default SignupForm;
