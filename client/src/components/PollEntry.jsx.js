import React from 'react';
import { Container, Media } from 'reactstrap';

//Individual poll container
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleHover: false,
    };
  }
  toggleHover() {
    this.setState({ toggleHover: !this.state.toggleHover });
  }
  render() {
    const { message } = this.props;
    //Styles for individual poll component
    const styles = {
      body: {
        padding: '15px 0 15px 0',
      },
      timeStamp: {
        fontSize: '10px',
        color: '#bdbdbd',
        marginLeft: '10px',
      },
      username: {
        fontSize: '24',
        fontWeight: 'bold',
        display: 'block',
        paddingBottom: '5px',
      },
      message: {
        fontSize: '0.9em',
        overflowWrap: 'break-word',
        textAlign: 'left',
        display: 'fixed',
        left: '63.99',
      },
      egg: {
        backgroundColor: color(),
        float: 'left',
        marginRight: '7px',
      },
       poll: {
        float: 'left',
        marginRight: '7px',
      },
    };

    const pollOptions = [
    {id: 1, text: 'yellow'},
    {id: 2, text: 'blue'},
    {id: 3, text: 'red'}
    ];

    return (
      <div className="message-entry-container">
        <Container style={styles.body}>
          <Media left href="#">
            <img
              className="poll"
              href="#"
              src="/images/poll.png"
              alt="profile-pic"
              style={styles.poll}
            />
          </Media>
          <span style={styles.username}>
            Simple Poll
            <span style={styles.timeStamp}>{new Date(message.createdAt).toLocaleTimeString()}</span>
          </span>
          <div style={styles.message}>{message.text}</div>
          <ol>
          	{pollOptions.map(option => {

          		<li key={option.id}>{option.text}</li>
          	})}
 					</ol>

        </Container>
      </div>
    );
  }
}