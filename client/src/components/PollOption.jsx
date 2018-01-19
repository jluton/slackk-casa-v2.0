import React from 'react';

export default class PollOption extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    	votes: 0
    }

    this.handleVote = this.handleVote.bind(this)
  }

  handleVote(event) {
  	let votes = this.state.votes
  	votes++
  	this.setState({
  		votes: votes
  	})
  }

  render() {

	  return(
		  <div className="option">
		  	<button className="optionButton" onClick={this.handleVote}>{this.props.index + 1}</button>
		  	<span></span><span>{this.props.option} : </span><span className="votes">{this.state.votes} Votes</span><br/>
		  </div>
	  )
	}
}
