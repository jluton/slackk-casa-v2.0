import React from 'react';
import PropTypes from 'prop-types';
const axios = require('axios');


import {
  Collapse,
  inNavBar,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      joined: false,
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  handleJoinClick(event) {
    let { currentWorkSpaceId, currentUser } = this.props;
    this.setState({ joined: !this.state.joined });
    const body = {
      ws: currentWorkSpaceId,
      user: currentUser,
      action: this.state.joined ? 'drop' : 'add',
    };
    console.log(body);
    axios.post('/workspaces/membership', body)
      .then(console.log)
      .catch(console.log);
  }

  render() {
    return (
      <Navbar color="faded" light expand="md">
        <NavbarBrand>
          <h1>slackk-casa</h1>
        </NavbarBrand>
        <h3 className="text-center">
          #{this.props.currentWorkSpaceName || 'select a workspace!'}{' '}
        </h3>
        <button onClick={event => this.handleJoinClick(event)}>
          {this.state.joined ? 'Leave' : 'Join'}
        </button>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle nav caret>
                Options
              </DropdownToggle>
              <DropdownMenu>
                <NavLink href="/login">
                  <DropdownItem>Sign Out</DropdownItem>
                </NavLink>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

NavBar.propTypes = {
  currentWorksSpaceName: PropTypes.string,
}
NavBar.defaultProps = {
  currentWorkSpaceName: 'select a workspace!',
}
