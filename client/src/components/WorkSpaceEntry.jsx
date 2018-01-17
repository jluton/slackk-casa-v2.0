import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { getWorkSpaceMessagesFromServer } from '../socketHelpers/index.js';
import PropTypes from 'prop-types';

export default class WorkSpaceEntry extends Component {
  constructor(props) {
    super(props);
    this.state = { joined: false };
  }

  handleClick(event) {
    let { handleFail, changeCurrentWorkSpace, workSpace } = this.props;
    handleFail();
    getWorkSpaceMessagesFromServer(workSpace.id);
    changeCurrentWorkSpace(workSpace.id, workSpace.name);
  }

  handleJoinClick(event) {
    let { handleFail, changeCurrentWorkSpace, workSpace, currentUser} = this.props;
    handleFail();
    this.setState({ joined: !this.state.joined });
    console.log(currentUser)
  }


  render() {
    let { workSpace, currentWorkSpaceId } = this.props;
    return (
      <div className="workSpace-entry-container">

        {workSpace.id === currentWorkSpaceId ? (
          <h5
            className="workSpace-name highlight-workSpace"
            onClick={event => this.handleClick(event)}
          >
            {' '}
            # {workSpace.name}
          </h5>
        ) : (
          <h5 className="workSpace-name workSpace-hover" onClick={event => this.handleClick(event)}>
            {' '}
            # {workSpace.name}
          </h5>
        )}
        <button onClick={event => this.handleJoinClick(event)}>
          {this.state.joined ? 'Leave' : 'Join'}
        </button>
      </div>
    );
  }
}

WorkSpaceEntry.propTypes = {
  currentWorkSpaceId: PropTypes.number,
}
