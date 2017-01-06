'use strict'

var React = require('react')
var $ = require('jquery')

// Displays an event for each event list member
var Event = React.createClass({

  displayName: "Event",

  _convertMilitaryTime: function(str) {
    var strTimes = ''
    var hours24 = parseInt(str.substring(0, 2),10)
    var hours = ((hours24 + 11) % 12) + 1
    var amPm = hours24 > 11 ? 'PM' : 'AM'
    var minutes = str.substring(2)
    strTimes += hours + ':' + minutes + ' ' + amPm
    return strTimes
  },

  render: function render() {

    if (this.props.dataset.title === "Museum Closes") {

      return (
        <article className={(this.props.time < this.props.currTime) ? 'event past' : 'event'}>
          <h2 className="notranslate">{this._convertMilitaryTime(this.props.time)}</h2>
          <h1 className="open-close">{this.props.dataset.title}</h1>
        </article>
      )

    } else {

      if (this.props.time < this.props.closingTime.replace(/:/, '')) {

        var markup = {__html: this.props.dataset.body}

        return (
          <article className={(this.props.time < this.props.currTime) ? 'event past' : 'event'}>
            <h2 className="notranslate">{this._convertMilitaryTime(this.props.time)}</h2>
            <h1>{this.props.dataset.title}</h1>
            <span className="location">{this.props.dataset.location}</span>
            <div dangerouslySetInnerHTML={markup} />
          </article>
        )

      } else {

        return null

      }

    }

  }

})

// Displays an event-list for each timeblock
var EventListTimeBlock = React.createClass({

  displayName: "EventListTimeBlock",

  render: function render() {

    var rows = []

    this.props.dataset.events.forEach(function(dataset) {
      rows.push(<Event dataset={dataset} key={dataset.nid} time={this.props.dataset.time} currTime={this.props.currTime} closingTime={this.props.closingTime} />)
    }.bind(this))

    return (
      <section className="time-block">
        {rows}
      </section>
    )
  }

})

// Displays events
var EventList = React.createClass({

  displayName: "EventList",

  getInitialState: function() {
    return {
      info: null,
      showBackup: false,
      currentTime: null,
    };
  },

  _setCurrentTime: function() {
    var date = new Date()
    var hours = date.getHours()
    var minutes = date.getMinutes()
    if (hours < 10) hours = "0" + hours.toString()
    if (minutes < 10) minutes = "0" + minutes.toString()
    var time = hours + '' + minutes
    this.setState ({
      currentTime: time
    })
  },

  _getNiceTodayDate: function() {

    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ]
    var date = new Date()
    var day = date.getDate()
    var monthIndex = date.getMonth()

    var val = day%100;

    return (monthNames[monthIndex] + ' ' + day)

  },

  _parseEventsByTime: function(data) {
    if (data) {
      // get all the timeslots in current data
      var times = []
      data.forEach(function(dataset) {
        if(dataset.time_slots) {
          if (Array.isArray(dataset.time_slots)) {
            dataset.time_slots.forEach(function(ts) {
              times.push(ts.replace(/:/, ''))
            })
          }
        }
      })
      times.sort()
      var uniqueTimes = []
      $.each(times, function(i, el){
        if($.inArray(el, uniqueTimes) === -1) uniqueTimes.push(el)
      })
      times = uniqueTimes
      // from times create array of time blocks - each member having
      // object comprised of time:string and event-list:array
      var timeBlocks = []
      times.forEach(function(time) {
        var obj = {
          'time': time,
          'events': []
        }
        timeBlocks.push(obj)
      })
      // iterate thru current data and drop event info into matching
      // time block member object event-lists based on data timeslots
      data.forEach(function(dataset) {
        if(dataset.time_slots) {
          if (Array.isArray(dataset.time_slots)) {
            dataset.time_slots.forEach(function(ts) {
              var time = ts.replace(/:/, '')
              var obj = {
                'nid': dataset.nid,
                'location': dataset.location,
                'title': dataset.title,
                'body': dataset.body
              }
              timeBlocks.forEach(function(tb) {
                if (tb.time === time) {
                  tb.events.push(obj)
                }
              })
            })
          }
        }
      })
      this.setState ({
        info: timeBlocks
      })
    }
  },

  componentWillReceiveProps: function(nextProps) {

    this._parseEventsByTime(nextProps.dataset)

    if (nextProps.networkConnected === false) {
      this.setState({
        showBackup: true
      })
    } else {
      this.setState({
        showBackup: false
      })
    }

  },

  componentDidMount: function() {
    // set currentTime every 5 minutes
    this._setCurrentTime()
    setInterval(()=>this._setCurrentTime(), (60000 * 5))
  },

  render: function render() {

    var classViewExpand = ''
    if (this.props.datacount <= 15) {
      classViewExpand = 'halfsize'
    } else {
      classViewExpand = 'fullsize'
    }

    if (this.state.info) {

      var rows = []

      this.state.info.forEach(function(dataset) {
        rows.push(<EventListTimeBlock dataset={dataset} key={dataset.time} currTime={this.state.currentTime} closingTime={this.props.closingTime} />)
      }.bind(this));

      return (
        <div>
          <div id="event-list-container" className={this.state.showBackup ? 'hide' : ''}>
            <div className="event-list-header">
              <span className="whats-on-today">{'Today'}</span>
              <span>{this._getNiceTodayDate()}</span>
            </div>
            <div className={classViewExpand + ' row-wrapper'}>
              <div className="outer-container">{rows}</div>
            </div>
          </div>
          <div id="event-list-container-backup" className={this.state.showBackup ? 'notranslate' : 'hide notranslate'}>
            <div className="event-list-header">
              <span className="whats-on-today">{'Today'}</span>
              <span>{this._getNiceTodayDate()}</span>
            </div>
            <div className={classViewExpand + ' row-wrapper'}>
              <div className="outer-container">{rows}</div>
            </div>
          </div>
        </div>
      )

    } else {

      return (
        <div className={this.props.hide ? 'hide' : ''}>
          <div id="event-list-container">
            <div className="event-list-header">
              <span className="whats-on-today">Information unavailable</span>
            </div>
          </div>
        </div>
      )

    }

  }

})

export default EventList
