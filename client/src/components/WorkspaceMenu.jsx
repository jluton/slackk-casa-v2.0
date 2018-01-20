import React from 'react';
import { Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, NavLink } from 'reactstrap';
import AddUser from './AddUser.jsx'

const axios = require('axios');


export default class WorkspaceMenu extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      joined: false,
      currentWorkSpaceId: props.currentWorkSpaceId,
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
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
    let { currentUser, currentWorkSpaceId } = this.props;
    // this.setState({ joined: !this.state.joined });
    let body = {
      ws: currentWorkSpaceId,
      user: currentUser,
      action: this.state.joined ? 'drop' : 'add',
    };
    axios.post('/workspaces/membership', body)
      .then(console.log)
      .catch(console.log);
  }

  render() {
    const members = this.props.workspaceMembers || [];

    return (
      <div>
        <Nav pills>
          <NavItem>
            <button onClick={event => this.handleJoinClick(event)}>
              {this.state.joined ? 'Leave Workspace' : 'Join Workspace'}
            </button>
          </NavItem>
          &nbsp;&nbsp;&nbsp;
          <NavItem>
          <AddUser currentWorkSpaceId={this.props.currentWorkSpaceId} />
          </NavItem>
          <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle nav caret>
               {members.length} Members
              </DropdownToggle>
              <DropdownMenu>
                {members.map((x, i) => <DropdownItem key={i}>{x}</DropdownItem>)}
              </DropdownMenu>
          </Dropdown>
        </Nav>
      </div>
    );
  }
}
