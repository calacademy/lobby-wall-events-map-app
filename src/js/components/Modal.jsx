'use strict'

var React = require('react')
var ReactCSSTransitionGroup = require('react-addons-css-transition-group')

var Modal = React.createClass({
    render: function() {
        if(this.props.isOpen){
            return (
              <ReactCSSTransitionGroup
                transitionName={this.props.transitionName}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}>
                {this.props.children}  
              </ReactCSSTransitionGroup>
            );
        } else {
            return (
              <ReactCSSTransitionGroup
                transitionName={this.props.transitionName}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}>
              </ReactCSSTransitionGroup>
            )
        }
    }
})

export default Modal
