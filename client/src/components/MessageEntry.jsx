import React from 'react';
import { Container, Media } from 'reactstrap';

//Individual message container
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
    //for the color changing avatars
    let color = () => {
      let colors = [
        '#346A85',
        '#AFE356',
        '#348569',
        '#F6a43D',
        '#AAD3E6',
        '#7F3485',
        '#992B41',
        '#3B94D9',
        '#E95F28',
        '#4A913C',
        '#FFAC33',
        '#8899A6',
        '#744EAA',
        '#BE1931',
      ];
      let index = Math.floor(Math.random() * colors.length);
      return colors[index];
    };
    //Styles for individual message component
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
      img: {
        height: '200px',
      }
    };

    return (
      <div className="message-entry-container">
        <Container style={styles.body}>
          <Media left href="#">
            <img
              className="egg img-responsive"
              href="#"
              src="/images/twitter-egg.png"
              alt="profile-pic"
              style={styles.egg}
            />
          </Media>
          <span style={styles.username}>
            {message.username}
            <span style={styles.timeStamp}>{new Date(message.createdAt).toLocaleTimeString()}</span>
          </span>
          {message.text.slice(0, 10) === "https://s3" ? (
            <div>
              <div><b> {message.text} </b> </div>
              <a href={message.text}>
              <img id="messageEntry" src={message.text}/>
              </a> 
            </div>) : (<div> {message.text} </div> )}

        </Container>
      </div>
    );
  }
}
