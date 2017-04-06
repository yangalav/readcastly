import React from 'react';

function SignUpForm() {
	return (
    <h2>Sign up</h2>
    <div>
      <label for="username">Username:</label>
      <input id="username" type="text" name="username">
    </div>
    <div>
      <label for="password">Password:</label>
      <input id="password" type="password" name="password">
    </div>
    <div>
      <input type="submit" value="Sign up">
    </div>
</form>
<p>
  <a href="/login">Login to your account &rarr;</a>
<p>
	);
}

export default SignUpForm;
