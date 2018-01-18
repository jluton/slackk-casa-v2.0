import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Alert, FormGroup, Input, Button } from 'reactstrap';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loginSuccess: false,
      loginStatus: '',
    };
  }

  //Function to that loggs in a user
  logIn() {
    let { username, password } = this.state;
    if (username === '') {
      return this.setState({ loginStatus: 'Enter a username' });
    }
    console.log(typeof password);
    fetch('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'content-type': 'application/json' },
    })
      .then(resp =>
        (resp.status === 200
          ? this.setState({ loginSuccess: true })
          : this.setState({ loginStatus: `${resp.status} - ${resp.statusText}` })))
      .catch(console.error);
  }

  //function to allow password recovery. 
  //TODO: recovery by email
  recoverPassword() {
    let { username } = this.state;
    if (username === '') {
      return this.setState({
        loginStatus: 'Enter your username or ssn for a chance to retrieve your password',
      });
    }
    fetch('/recover', {
      method: 'POST',
      body: JSON.stringify({ username }),
      headers: { 'content-type': 'application/json' },
    })
      .then(resp => resp.json())
      .then(data =>
        (data.password_hint.length
          ? this.setState({
            loginStatus: `The hint for user ${username} is: ${data.password_hint}`,
          })
          : this.setState({
            loginStatus:
                  'Looks like someone forget to set a password hint. Try making a new account instead!',
          })))
      .catch(console.error);
  }

  handleOnChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleKeyPress(event) {
    return event.key === 'Enter' ? this.logIn() : undefined;
  }

  render() {
    const styles = {
      body: {
        paddingTop: '40px',
        paddingBottom: '40px',
        maxWidth: '330px',
        padding: '15px',
        margin: '0 auto',
        textAlign: 'center',
      },
    };

    Notification.requestPermission().then((result) => {
      if (result === 'denied') {
        console.log('Permission wasn\'t granted. Allow a retry.');
        return;
      }
      if (result === 'default') {
        console.log('The permission request was dismissed.');
        return;
      }
      console.log('Permission was granted.');
    });

    return (
      <div style={styles.body}>
        {this.state.loginSuccess ? (
          <Redirect
            to={{
              pathname: '/messages',
              state: { username: this.state.username, password: this.state.password },
            }}
          />
        ) : (
          <div>
            <Link style={{ textDecoration: 'none' }} to="/">
              <h1>slackk-casa</h1>
            </Link>
            <br />
            {this.state.loginStatus ? (
              <Alert color="danger">{this.state.loginStatus}</Alert>
            ) : (
              undefined
            )}
            <h2>Please log in</h2>
            <br />
            <FormGroup>
              <Input
                type="text"
                placeholder="Username"
                name="username"
                onChange={e => this.handleOnChange(e)}
                onKeyPress={e => this.handleKeyPress(e)}
                bssize="lg"
              />
              <Input
                type="password"
                placeholder="Password"
                name="password"
                onChange={e => this.handleOnChange(e)}
                onKeyPress={e => this.handleKeyPress(e)}
                bssize="lg"
              />
            </FormGroup>
            <Button onClick={() => this.logIn()} color="primary" size="lg" block>
              Log in
            </Button>
            <br />
            <Link style={{ textDecoration: 'none' }} to="/signup">
              <Button color="primary" bssize="lg" block>
                Sign Up
              </Button>
            </Link>
            <br />
            <div>
              <Button onClick={() => this.recoverPassword()} color="primary" bssize="sm">
                Forgot your password? Click here
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}