'use strict'

var React = require('react')
var ReactDOM = require('react-dom')
var $ = require('jquery')

import Map from './Map.jsx'
import Header from './Header.jsx'
import EventList from './EventList.jsx'

var App = React.createClass({

  displayName: "App",

  getInitialState: function() {
    return {
      networkConnected: false,
      eventDataInit: false,
      eventData: null,
      eventCount: null,
      closingTime: '17:00', // default
      nextPage: true,
      prevPage: false,
      appOnPage: 'map',
    }
  },

  _testNetworkConnection: function() {
    if (navigator.onLine) {
      // only set state as needed to avoid extraneous rendering
      if (this.state.networkConnected === false) {
        this.setState({
          networkConnected: true
        })
      }
      // if init data not pulled yet, try
      if (this.state.eventDataInit === false) {
        this._getEventData()
      }
    } else {
      if (this.state.networkConnected === true) {
        this.setState({
          networkConnected: false
        })
      }
    }
  },

  _getEventData: function() {
    var closingTime = this.state.closingTime
    $.ajax({
      url: process.env.EVENTS_API_URL,
      dataType: process.env.EVENTS_API_DATATYPE,
      type: "GET",
      async: true,
      success: function(data) {
        var i = 0
        data.forEach(function(datum) {
          if (datum.time_slots) {
            i += datum.time_slots.length
          }
          if (datum.title === 'Museum Closes') {
            closingTime = datum.time_slots[0]
          }
        })
        if (i > 0) {
          this.setState ({
            eventDataInit: true,
            eventData: data,
            eventCount: i,
          })
          // request event data every hour after first successful pull
          setInterval(()=>this._updateEventData(), (60000 * 60))
        }
        this.setState ({
          closingTime: closingTime,
        })
      }.bind(this)
    })
  },

  _updateEventData: function() {
    if (navigator.onLine) {
      var closingTime = this.state.closingTime
      $.ajax({
        url: process.env.EVENTS_API_URL,
        dataType: process.env.EVENTS_API_DATATYPE,
        type: "GET",
        async: true,
        success: function(data) {
          var i = 0
          data.forEach(function(datum) {
            if (datum.time_slots) {
              i += datum.time_slots.length
            }
            if (datum.title === 'Museum Closes') {
              closingTime = datum.time_slots[0]
            }
          })
          if (i > 0) {
            this.setState ({
              eventDataInit: true,
              eventData: data,
              eventCount: i,
            })
          }
          this.setState ({
            closingTime: closingTime,
          })
        }.bind(this)
      })
    }
  },

  _handleClickNext: function() {
    var adj = 0 - $('#app-container').width()
    $('#app-container').css('margin-left',adj)
    this.setState({
      nextPage: false,
      prevPage: true,
      appOnPage: 'events',
    })
  },

  _handleClickPrev: function() {
    var adj = $('#app-container').width()
    $('#app-container').css('margin-left','0')
    this.setState({
      nextPage: true,
      prevPage: false,
      appOnPage: 'map',
    })
  },

  componentDidMount: function() {
    // establish network connection
    this._testNetworkConnection()
    // test network connectivity every 10 seconds
    setInterval(()=>this._testNetworkConnection(), 10000)
  },

  render: function render() {
    return (
      <div id='app-container'>
        <div id='app-pager-container'>
          <div id='app-page-map'>
            <Map appOnPage={this.state.appOnPage} />
          </div>
          <div id='app-page-events'>
            <Header hide={!this.state.eventDataInit} networkConnected={this.state.networkConnected} appOnPage={this.state.appOnPage} />
            <EventList hide={!this.state.eventDataInit} networkConnected={this.state.networkConnected} dataset={this.state.eventData} datacount={this.state.eventCount} closingTime={this.state.closingTime} appOnPage={this.state.appOnPage} />
            <div className={!this.state.eventDataInit ? 'no-data-init notranslate' : 'hide no-data-init notranslate'}>
              <p>Loading data. Thank you for your patience.</p>
            </div>
          </div>
        </div>
        <div className={this.state.nextPage ? 'app-pager app-next' : 'hide app-pager app-next'} onClick={this._handleClickNext}></div>
        <div className={this.state.prevPage ? 'app-pager app-prev' : 'hide app-pager app-prev'} onClick={this._handleClickPrev}></div>
      </div>
    )
  }
})

export default App
