import React from 'react';

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
          <input type="submit" value="Sign Up"/>
        </form>
      </div>
  	);
  }
}

export default SignupForm;
