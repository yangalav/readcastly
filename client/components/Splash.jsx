import React from 'react';
import {Grid, Row, Col, FormGroup, FormControl, Button, Carousel} from 'react-bootstrap';

const techLogos = ['../images/amazon-polly.jpg', '../images/Bookshelf.png', '../images/bootstrap-logo.png', '../images/express.png','../images/knex.png', '../images/MySQL-Logo.png', '../images/node-js.png', '../images/nodemailer.png', '../images/Passport.png', '../images/Postlight.png', '../images/react-logo.png', '../images/S3.png', '../images/Twilio_logo.png', '../images/webpack.png']


class Splash extends React.Component {
  constructor() {
    super();
    this.state = {
                  email: '',
                  password: ''
    }
    // this.handleLogout = this.handleLogout.bind(this);
  }

  goGuest() {
    console.log('GUEST');
  }

  goSignup() {
    console.log('SIGNUP');
  }

  goLogin() {
    console.log('LOGIN');
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col md={6} mdOffset={3}>
            <h1>Welcome to Readcast.ly</h1>
          </Col>
        </Row>
        <Row>
          <div>
          <Col md={6} mdOffset={3}>
            <FormGroup id='username' onSubmit={this.goLogin.bind(this)}>
              <FormControl name='username' type='text' placeholder="E-mail address" required />
              <FormControl name='password' type='password' placeholder="Password" required />
              <Button type="submit" bsStyle="success" onClick={!this.state.islogging ? this.goLogin.bind(this) : null}>LOG IN</Button>
            </FormGroup>
          </Col>
          </div>
        </Row>
        <Row>
          <Col md={6} mdOffset={3}>
            <Button type="submit" bsStyle="warning" onClick={this.goSignup.bind(this)}>SIGN UP</Button>
          </Col>
        </Row>
        <Row>
          <Col md={6} mdOffset={3}>
            <Button type="submit" bsStyle="primary" onClick={this.goGuest.bind(this)}>Explore as a guest!</Button>
          </Col>
        </Row>
        <Row>
          <Carousel data-ride="carousel" interval={2000}>
            {techLogos.map((logo,i) =>
              <Carousel.Item className='logo-carousel' key={i} >
                <img className='logo-carousel img-responsive center-block' width={517} height={115} alt="517x115" src={logo}/>
              </Carousel.Item>
            )}
          </Carousel>
        </Row>
      </Grid>
    );
  }

};

export default Splash;