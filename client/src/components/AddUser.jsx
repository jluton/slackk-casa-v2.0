import React from 'react';
import PropTypes from 'prop-types';
const axios = require('axios');


export default class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }


  handleSubmit(event) {
    event.preventDefault();
    // this.setState({ joined: !this.state.joined });
    let body = {
      ws: this.props.currentWorkSpaceId,
      user: this.state.value,
      action: 'add',
    };
    axios.post('/workspaces/membership', body)
      .then(console.log)
      .catch(console.log);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Add User:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Add" />
      </form>
    );
  }
}
