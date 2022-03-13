import React, { Component } from "react";

export default class PopUp extends Component {

    handleClick = () => {
     this.props.toggle();
    };
    
    render() {
        return (
            <div className="modal">
                <div className="modal_content">
                    <span className="close" onClick={this.handleClick}>&times;    </span>
                    <p>I'm A Pop Up!!!</p>
                </div>
            </div>
        );
   }
  }

// TO ACCESS IN COMPONENT
//   togglePop = () => {
//     this.setState({
//       seen: !this.state.seen
//     });
// };