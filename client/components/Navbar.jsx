import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { hashHistory } from 'react-router';
import axios from 'axios';

class HeaderNav extends React.Component {
  constructor(props) {
    super(props);
  }

  handleLogout(e){
    e.preventDefault();
    console.log('handleddd logout');
    return axios.get('/api/logout')
    .then((res) => {
      console.log("get requesttt logout button" + res);
      hashHistory.push('/');
      return;
    });
  }

  goSignup() {
    hashHistory.push('/signup');
  }

  goSplash() {
    hashHistory.push('/')
  }

  render() {
    return(
      <Navbar fixedTop fluid collapseOnSelect id="headernav">
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#"><img style={{paddingTop: "5px"}} src="../images/readcastly-full-white-15pct.png" /></a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Navbar.Text style={{paddingTop: "3px"}}>
            Welcome, {this.props.isGuest ? 'esteemed guest' : this.props.username}!
          </Navbar.Text>
          <Nav pullRight>
            {this.props.isGuest && <NavItem eventKey={1} href='/#/signup'><button style={{marginTop: "6px"}}type="button" className="btn btn-default navbar-btn" onClick={this.goSignup.bind(this)} >Sign Up!</button></NavItem>}
            {this.props.isGuest && <NavItem eventKey={2} href='/'><button style={{marginTop: "6px"}} type="button" className="btn btn-default navbar-btn" onClick={this.goSplash.bind(this)} >Log In</button></NavItem>}
            {!this.props.isGuest && <NavItem eventKey={3} href='/signup'><button style={{marginTop: "6px"}} type="button" className="btn btn-default navbar-btn" onClick={this.goSignup.bind(this)} >Update User Info</button></NavItem>}
            {!this.props.isGuest && <NavItem eventKey={4}><button style={{marginTop: "6px"}} type="button" className="btn btn-default navbar-btn" onClick={this.handleLogout.bind(this)} >Logout</button></NavItem>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

};

export default HeaderNav;


// import React from 'react';
//
// import  Navbar from 'react-bootstrap';

// import  Nav from 'react-bootstrap';
//
// class HeaderNavigation extends React.Component {
//   constructor() {
// 		super();
// 	}
//   render() {
//     return(
//     navbarInstance = (
//       <Navbar inverse collapseOnSelect>
//         <Navbar.Header>
//           <Navbar.Brand>
//             <a href="#">Read.cast.ly</a>
//           </Navbar.Brand>
//           <Navbar.Toggle />
//         </Navbar.Header>
//         <Navbar.Collapse>
//           <Nav>
//             <NavItem eventKey={1} href="#">settings</NavItem>
//             <NavItem eventKey={2} >Logged in as [username]</NavItem>
//             <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
//               <MenuItem eventKey={3.1}>Text paste mode</MenuItem>
//               <MenuItem eventKey={3.3}>Change password</MenuItem>
//               <MenuItem divider />
//               <MenuItem eventKey={3.3}>Sign out</MenuItem>
//             </NavDropdown>
//           </Nav>
//           <Nav pullRight>
//             <NavItem eventKey={1} href="#">Share Read.cast.ly</NavItem>
//           </Nav>
//         </Navbar.Collapse>
//       </Navbar>
//     )
//   )
//  }
// }
//
// export default HeaderNavigation;
// export default HeaderNavigation extends React.Component {

// to make responsive: add toggleNavKey={0} to the Navbar and eventKey={0} to the Nav. 0 in this case is the key used to coordinate those two together. Resize the window to a mobile device size and observe what this does to the inline form.
