import React from 'react';
import { Button } from 'react-bootstrap';

class LoginForm extends React.Component {
  constructor() {
		super();
	}

  render() {
    return (
      <div>
        <form>
          E-mail:<br/>
          <input type="email" name="email"/><br/>
          Password:<br/>
          <input type="password" name="password"/><br/>
          <Button bsStyle="success">Login</Button>
        </form>
      </div>
  	);
  }
}

export default LoginForm;
