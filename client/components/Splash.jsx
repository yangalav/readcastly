import React from 'react';
import axios from 'axios';
import { hashHistory } from 'react-router'
import { Button, Form, FormControl, FormGroup, ControlLabel, Col, Row } from 'react-bootstrap';
import { Collapse } from 'react-collapse';
// import {Grid, Row, Col, FormGroup, FormControl, Button, Carousel} from 'react-bootstrap';

const techLogos = ['../images/amazon-polly.jpg', '../images/Bookshelf.png', '../images/bootstrap-logo.png', '../images/express.png','../images/knex.png', '../images/MySQL-Logo.png', '../images/node-js.png', '../images/nodemailer.png', '../images/Passport.png', '../images/Postlight.png', '../images/react-logo.png', '../images/S3.png', '../images/Twilio_logo.png', '../images/webpack.png']


class Splash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
                  email: '',
                  password: '',
                  isOpened: false,
    }

   this.handleEmailChange = this.handleEmailChange.bind(this);
   this.handlePasswordChange = this.handlePasswordChange.bind(this);
   this.handleLogin = this.handleLogin.bind(this);
   this.handleGuestMode = this.handleGuestMode.bind(this);
   this.handleSignup = this.handleSignup.bind(this);

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

  componentWillMount() {
    axios.get('/api/getUserInfo')
    .then((res) => {
      if (res.data !== "") {
        hashHistory.push('/app');
      }
    })
    .catch((err) => console.log('SPLASH REDIRECT ERROR: ', err));
  }

  handleSignup(e){
    e.preventDefault();
    console.log('handleddd signuppp');
    hashHistory.push('/signup');
    return;
  }

  handleGuestMode(e){
    e.preventDefault();
    console.log('handleddd guest mode');
    hashHistory.push('/app');
    return;
  }



  render() {
    return (
    <div>

      <header>
        <div className="container">
          <div className="row">

            <div className="col-xs-6">
              <a href="/"><img src="images/ReadcastlyJoeLogoFull.png" alt="Logo"/></a>
            </div>
          </div>

          <div className="row header-info">
            <div className="col-sm-10 col-sm-offset-1 text-center">

              <h1 className="wow fadeIn">Welcome to Readcast.ly</h1>
              <br />
              <p className="lead wow fadeIn" data-wow-delay="0.5s">Lorem ipsum dolor sit amet, consectetur adipis. <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit sit dol mi arlna.</p>
              <br />


              <div className="row">
                <div>
                  <div className="row">

                    <Form inline>
                      <FormGroup bsSize="small" controlId="formInlineName" className="wow fadeInUp">
                          <FormControl className="customFormWidth" type="text" placeholder="Email" />
                      </FormGroup>
                        {'         '}
                      <FormGroup bsSize="small" controlId="formInlineEmail" className="wow fadeInUp">
                        <FormControl type="email" placeholder="Password" />
                      </FormGroup>
                        {'           '}
                      <Button bsSize="small" className="btn btn-primary btn-lg scroll wow fadeInUp customLoginButtonSize" onClick={this.handleLogin}>Login</Button>
                    </Form>

                  </div>
                </div>
              </div>


              <div className="row">
                <div className="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
                  <div className="row">

                    <div className="col-xs-6 text-right wow fadeInUp" data-wow-delay="1s">
                      <Button className="btn btn-primary btn-lg scroll" onClick={this.handleSignup}>Signup</Button>
                    </div>

                    <div className="col-xs-6 text-left wow fadeInUp" data-wow-delay="1.4s">
                      <Button className="btn btn-secondary btn-lg scroll" onClick={this.handleGuestMode}>Explore as guest</Button>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </header>

      <section id="be-the-first" className="pad-xl">
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-sm-offset-2 text-center margin-30 wow fadeIn" data-wow-delay="0.6s">
              <h2>Blah</h2>
              <p className="lead">Lorem ipsum dolor sit amet, consectetur adipis.</p>
            </div>
          </div>

          <div className="iphone wow fadeInUp" data-wow-delay="1s">
            <img src="images/screenshot1.png"/>
          </div>
        </div>
      </section>

      <section id="main-info" className="pad-xl">
        <div className="container">
          <div className="row">
            <div className="col-sm-4 wow fadeIn" data-wow-delay="0.4s">
              <hr className="line purple"/>
              <h3>Blurb 1</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam viverra orci ut est facilisis, eu elementum mi volutpat. Pellentesque ac tristique nisi.</p>
            </div>
            <div className="col-sm-4 wow fadeIn" data-wow-delay="0.8s">
              <hr  className="line blue"/>
              <h3>Blurb 2</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam viverra orci ut est facilisis, eu elementum mi volutpat. Pellentesque ac tristique nisi.</p>
            </div>
            <div className="col-sm-4 wow fadeIn" data-wow-delay="1.2s">
              <hr  className="line yellow"/>
              <h3>Blurb 3</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam viverra orci ut est facilisis, eu elementum mi volutpat. Pellentesque ac tristique nisi.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
    );
  }

};

// <Grid/>
//   <Row>
//     <Col md={6} mdOffset={3}>
//       <h1>Welcome to Readcast.ly</h1>
//     </Col>
//   </Row>
//   <Row>
//     <div>
//     <Col md={6} mdOffset={3}>
//       <FormGroup id='username' onSubmit={this.goLogin.bind(this)}>
//         <FormControl name='username' type='text' placeholder="E-mail address" onChange={this.handleEmailChange} required />
//         <FormControl name='password' type='password' placeholder="Password" onChange={this.handlePasswordChange} required />
//         <Button type="submit" bsStyle="success" onClick={!this.state.islogging ? this.goLogin.bind(this) : null}>LOG IN</Button>
//       </FormGroup>
//     </Col>
//     </div>
//   </Row>
//   <Row>
//     <Col md={6} mdOffset={3}>
//       <Button type="submit" bsStyle="warning" onClick={this.goSignup.bind(this)}>SIGN UP</Button>
//     </Col>
//   </Row>
//   <Row>
//     <Col md={6} mdOffset={3}>
//       <Button type="submit" bsStyle="primary" onClick={this.goGuest.bind(this)}>Explore as a guest!</Button>
//     </Col>
//   </Row>
//   <Row>
//     <Carousel data-ride="carousel" interval={2000}>
//       {techLogos.map((logo,i) =>
//         <Carousel.Item className='logo-carousel' key={i} >
//           <img className='logo-carousel img-responsive center-block' width={517} height={115} alt="517x115" src={logo}/>
//         </Carousel.Item>
//       )}
//     </Carousel>
//   </Row>
// </Grid>

export default Splash;
