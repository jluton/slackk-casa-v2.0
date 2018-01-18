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
      currentWorkSpaceId: props.currentWorkSpaceId,
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  componentDidMount() {
    let { currentUser } = this.props;
    let body = {
      ws: this.props.currentWorkSpaceId,
      user: currentUser,
    };
    axios.post('/workspaces/check', body)
      .then(x => this.setState({ joined: x.data }));
  }
  componentDidUpdate() {
    let { currentUser } = this.props;
    let body = {
      ws: this.props.currentWorkSpaceId,
      user: currentUser,
    };
    axios.post('/workspaces/check', body)
      .then(x => this.setState({ joined: x.data }));
  }

  handleJoinClick(event) {
    console.log(this.state)
    let { currentUser, currentWorkSpaceId } = this.props;
    // this.setState({ joined: !this.state.joined });
    let body = {
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
          #{this.props.currentWorkSpaceName || 'select a workspace!'}{'  '}
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
  currentWorkSpaceName: PropTypes.string,
  currentUser: PropTypes.string,
  currentWorkSpaceId: PropTypes.number,
};
NavBar.defaultProps = {
  currentWorkSpaceName: 'select a workspace!',
  currentUser: '',
  currentWorkSpaceId: 9999,
};
