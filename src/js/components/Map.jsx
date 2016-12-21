'use strict'

var React = require('react')
var $ = require('jquery')

// Displays events
var Map = React.createClass({

  displayName: "Map",

  getInitialState: function() {
    return {
      nextPage: true,
      prevPage: false,
      mapPage: 'first',
    };
  },

  _handleClickNext: function() {
    var adj = 0 - $('#map-container').width()
    $('.map').css('margin-left',adj)
    this.setState({
      nextPage: false,
      prevPage: true,
      mapPage: 'last'
    })
  },

  _handleClickPrev: function() {
    $('.map').css('margin-left','0')
    this.setState({
      nextPage: true,
      prevPage: false,
      mapPage: 'first'
    })
  },

  render: function render() {

    return (
      <div>
        <div id="map-container">
          <div className="map">
            <div className="map-page"></div>
            <div className="map-page"></div>
          </div>
          <div className={((this.state.nextPage) && (this.props.appOnPage === 'map')) ? 'pager next' : 'hide pager next'} onClick={this._handleClickNext}></div>
          <div className={((this.state.prevPage) && (this.props.appOnPage === 'map')) ? 'pager prev' : 'hide pager prev'} onClick={this._handleClickPrev}></div>
        </div>
      </div>
    )

  }

})

export default Map
