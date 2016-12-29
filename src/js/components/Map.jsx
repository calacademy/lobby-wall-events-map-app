'use strict'

var React = require('react')
var $ = require('jquery')

// Displays events
var Map = React.createClass({

  displayName: "Map",

  render: function render() {

    return (
      <div>
        <div className="page-header">
          <h1>Visitor Map</h1>
        </div>
        <div id="map-container">
          <div className="map">
            <div className="map-page"></div>
            <div className="map-page"></div>
          </div>
        </div>
      </div>
    )

  }

})

export default Map
