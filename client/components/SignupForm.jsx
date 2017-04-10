import React from 'react';
import { Button } from 'react-bootstrap';

class SignupForm extends React.Component {
  constructor() {
		super();
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
          <input type="email" name="email"/><br/>
          Password:<br/>
          <input type="password" name="password"/><br/>
          Avatar:<br/>
          <input type="url" name="avatar"/><br/>
          <Button bsStyle="success">Sign Up</Button>
        </form>
      </div>
  	);
  }
}

export default SignupForm;
