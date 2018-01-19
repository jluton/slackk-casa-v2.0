import React from 'react';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

//this is the button and then the actual popup that appears to create a workspace
export default class SendFiles extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false,
    };
  }
  //Changes the popout state
  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  }
  //calls workspace creation then pops back down
  handleClick() {
    this.props.createWorkSpace();
    this.closePopUp();
  }

  //grabs the input value
  handleChange(event) {
    event.preventDefault();
    this.props.getWorkSpaceQuery(event.target.value);
  }

  //Closes popup for sure
  closePopUp() {
    this.setState({
      popoverOpen: false,
    });
  }
  //Renders the button. When clicked, the button will toggle the popup.
  render() {
    return (
      <div>
        <Button id="Popover2" onClick={this.toggle}>
          +
        </Button>
        <Popover
          placement="top"
          isOpen={this.state.popoverOpen}
          target="Popover2"
          toggle={this.toggle}
        >
          <PopoverHeader>Send Files: </PopoverHeader>
          <PopoverBody>
            <form onSubmit= {this.props.fileSubmit} >
              <input name="imageFile" type="file" onChange={this.props.change}/>
              <button type="submit"> Send </button>
            </form>
          </PopoverBody>
        </Popover>
      </div>
    );
  }
}
