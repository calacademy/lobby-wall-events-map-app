'use strict'

var React = require('react')
var ReactDOM = require('react-dom')

import Translator from './Translator.jsx'
import Greeting from './Greeting.jsx'

var Header = React.createClass({

  displayName: "Header",

  render: function() {

    return (
      <div className={this.props.hide ? 'hide' : ''}>
        <header className="header" role="contentinfo">
          <div>
            <Translator networkConnected={this.props.networkConnected} appOnPage={this.props.appOnPage} />
          </div>
          <div className={!this.props.networkConnected ? 'hide' : ''}>
            <Greeting />
          </div>
        </header>
      </div>
    )

  }
})

export default Header
