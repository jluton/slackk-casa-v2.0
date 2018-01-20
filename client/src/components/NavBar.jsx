import React from 'react';
import PropTypes from 'prop-types';

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


  render() {
    return (
      <Navbar color="faded" light expand="md">
        <NavbarBrand>
          <h1>slackk-casa</h1>
        </NavbarBrand>
        <h3 className="text-center">
          #{this.props.currentWorkSpaceName || 'select a workspace!'}{'  '}
        </h3>
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
