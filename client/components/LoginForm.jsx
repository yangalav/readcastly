import React from 'react';

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
          <input type="submit" value="Login"/>
        </form>
      </div>
  	);
  }
}

export default LoginForm;
