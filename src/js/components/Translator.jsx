'use strict'

var React = require('react')
var ReactDOM = require('react-dom')
var $ = require('jquery')

import Modal from './Modal.jsx'

var timer
var timerModal
var transTimeoutID
var transIntervalID
var timerAppPageOne

var Translator = React.createClass({

  displayName: "Translator",

  getInitialState: function() {
    return {
      biggies: [
        {
          value: 'en',
          text: 'English'
        },
        {
          value: 'zh-CN',
          text: '中文'
        },
        {
          value: 'es',
          text: 'Español'
        },
        {
          value: 'tl',
          text: 'Pilipino'
        },
        {
          value: 'ja',
          text: '日本語'
        }
      ],
      languages: [],
      language: 'en',
      isModalOpen: false,
      nextPage: true,
      prevPage: false,
      appOnPage: 'events',
      nextPageEvent: false,
      prevPageEvent: false,
      eventPage: 'first',
    }
  },

  _autoGoAppPageOne: function() {
    $('#app-container').css('margin-left','0')
    this.setState({
      nextPage: true,
      prevPage: false,
      appOnPage: 'events',
    })
  },

  _resetAppPageOneTimer: function() {
    clearTimeout(timerAppPageOne)
    timerAppPageOne = setTimeout(()=>this._autoGoAppPageOne(), 30000)
  },

  _resetDefaultLanguage: function() {
    if (navigator.onLine) {
      this.setState({
        language: 'en'
      })
      $('.google-translate select').val('en')
      this._triggerHtmlEvent($('.google-translate select'), 'change')
    }
  },

  _resetTranslationTimer: function() {
    clearTimeout(timer)
    // reset default translation after 30 sec
    timer = setTimeout(()=>this._resetDefaultLanguage(), 30000)
  },

  _openModal: function() {
    if (navigator.onLine) {
      this.setState({isModalOpen: true})
      clearTimeout(timerModal)
      // auto-close modal after 30 sec
      timerModal = setTimeout(()=>this._closeModal(), 30000)
    }
  },

  _closeModal: function() {
      this.setState({isModalOpen: false})
  },

  _handleClick: function(lang, text) {
    if ((navigator.onLine) && (lang !== this.state.language)) {
      this.setState({
        language: lang
      })
      $('.google-translate select').val(lang)
      this._triggerHtmlEvent($('.google-translate select'), 'change')
      ga('send', 'event', {
        'eventCategory': 'Google Translate',
        'eventAction': 'translate',
        'eventLabel': text
      })
      this._resetTranslationTimer()
      this._initTranslationLoader()
    }
  },

  _initTranslationLoader: function() {
    clearTimeout(transTimeoutID)
    // only init load anim if expected google trans dom el.
    // if google changes gt dom render, degrades to no load anim.
    if ($('.goog-te-spinner-pos').length) {
      $('#custom-loading-container').css('display','block')
      transTimeoutID = setTimeout(()=>this._checkTranslationLoad(), (500))
    }
  },

  _checkTranslationLoad: function() {
    if ($('.goog-te-spinner-pos').hasClass('goog-te-spinner-pos-show')) {
      $('#custom-loading-container').css('display','block')
      clearTimeout(transTimeoutID)
      transTimeoutID = setTimeout(()=>this._checkTranslationLoad(), (200))
    } else {
      $('#custom-loading-container').css('display','none')
      clearTimeout(transTimeoutID)
      this._resetTranslationTimer()
    }
  },

  _triggerHtmlEvent: function (el, eventName) {
    var element = el.get(0)
		var event
		if (document.createEvent) {
		    event = document.createEvent('HTMLEvents')
		    event.initEvent(eventName, true, true)
		    element.dispatchEvent(event)
		} else {
		    event = document.createEventObject()
		    event.eventType = eventName
		    element.fireEvent('on' + event.eventType, event)
		}
  },

  _buildTranslatorOptions: function() {
    var arrLanguageOptions = []
    $('.google-translate').bind('DOMNodeInserted', function(event) {

      if (event.target.localName === 'option') {

        var langValueText = {
          value: event.target.value,
          text: event.target.innerText,
        }
        arrLanguageOptions = arrLanguageOptions.concat(langValueText)
        // unique-ify for recurring node inserts on menu change
        var unique = {}
        var distinct = []
        for (var i in arrLanguageOptions) {
          if( typeof(unique[arrLanguageOptions[i].value]) == "undefined") {
            distinct.push({value: arrLanguageOptions[i].value, text: arrLanguageOptions[i].text})
          }
          unique[arrLanguageOptions[i].value] = 0
        }
        arrLanguageOptions = distinct

        // force alpha order on english option
        arrLanguageOptions.sort(function(a, b) {
          var textA = a.text.toUpperCase()
          var textB = b.text.toUpperCase()
          if (textA < textB) {
            return -1
          }
          if (textA > textB) {
            return 1
          }
          return 0
        })

        this.setState({
          languages: arrLanguageOptions
        })
      }
    }.bind(this))
  },

  _handleClickNext: function() {
    var adj = 0 - $('#app-container').width()
    $('#app-container').css('margin-left',adj)
    this.setState({
      nextPage: false,
      prevPage: true,
      appOnPage: 'map',
    })
    this._resetTranslationTimer()
    this._resetAppPageOneTimer()
  },

  _handleClickPrev: function() {
    $('#app-container').css('margin-left','0')
    this.setState({
      nextPage: true,
      prevPage: false,
      appOnPage: 'events',
    })
    this._resetTranslationTimer()
    clearTimeout(timerAppPageOne)
  },

  _multiPageCheck: function() {
    var more = false
    var limit = $('#event-list-container').width()
    $('article').each(function () {
      var position = $(this).position();
      if (position.left > limit) {
        more = true
      }
		})
    if (this.state.eventPage === 'last') {
      more = false
    }
    this.setState({
      nextPageEvent: more
    })
  },

  _handleClickNextEvent: function() {
    var adj = 0 - $('#event-list-container').width()
    $('.row-wrapper').css('margin-left',adj)
    this.setState({
      nextPageEvent: false,
      prevPageEvent: true,
      eventPage: 'last'
    })
    this._resetTranslationTimer()
  },

  _handleClickPrevEvent: function() {
    $('.row-wrapper').css('margin-left','0')
    this.setState({
      nextPageEvent: true,
      prevPageEvent: false,
      eventPage: 'first'
    })
    this._resetTranslationTimer()
  },

  componentWillReceiveProps: function(nextProps) {
    if ((this.props.networkConnected === false) && (nextProps.networkConnected === true)) {
      $.getScript("//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit")
      this._buildTranslatorOptions()
    }
    this._multiPageCheck()
  },

  componentDidMount: function() {
    // we need 1 sec interval check for possible multipage layout based on
    // update in Translator component (trans runs longer than orig lang)
    setInterval(()=>this._multiPageCheck(), 1000)
  },

  render: function() {

    var _this = this

    var setButtons = ''
    if (this.state.biggies) {
      var rows = []
      this.state.biggies.forEach(function (data) {
        if (data.value !== '') {
          rows.push(
            <li key={data.value}>
            <button
            className={(data.value === this.state.language) ? 'selected notranslate big-select-button' : 'notranslate big-select-button'}
            onClick={_this._handleClick.bind(_this, data.value, data.text)}
            >{data.text}</button>
            </li>
          )
        }
      }.bind(this))
      setButtons = <ul className="list-lang-buttons" >{rows}</ul>
    }

    var setLinks = ''
    if (this.state.languages) {
      var rows = []
      this.state.languages.forEach(function (data) {
        if (data.value !== '') {
          rows.push(
            <li key={data.value}>
            <a className={(data.value === this.state.language) ? 'selected notranslate' : 'notranslate'} onClick={_this._handleClick.bind(_this, data.value, data.text)}>{data.text}</a>
            </li>
          )
        }
      }.bind(this))
      setLinks = <ul className="list-lang-links">{rows}</ul>
    }

    return (
      <div>
        <div id="custom-loading-container">
          <div className="custom-animation" />
        </div>
        <div className="header-translate">
          <div className="google-translate">
            <div id="google_translate_element"></div>
          </div>
          <div className="modal-container">

            <button onClick={this._openModal} className="notranslate modal-button">Select Language</button>

            <Modal isOpen={this.state.isModalOpen}
              transitionName="modal-anim">

              <div className="modal-outer" onClick={this._closeModal}>
                <div className="modal-inner" onClick={(e) => {
                if ((e.target.localName !== 'button') && (e.target.localName !== 'a')) {
                  e.stopPropagation()
                }
                }}>
                  <div className="modal-header">
                    <h2 className="notranslate">Select your language</h2>
                  </div>
                  <div className="modal-body">
                    <h3 className="notranslate">Quick list of most commonly selected languages</h3>
                    {setButtons}
                    <h3 className="notranslate">Full list of available languages</h3>
                    {setLinks}
                  </div>
                </div>
              </div>

            </Modal>

          </div>
        </div>
        <div id="footer-container">
          <div className={(this.state.language !== 'en') ? 'footer-google notranslate' : 'hide notranslate'}>Translation provided by</div>
          {/*<div className={this.state.language === 'en' ? 'footer-claude' : 'hide'}></div>*/}
          <div className="footer-claude" />

          <div className="app-pager-controls">
            <div className="app-pager app-next" onClick={this._handleClickNext}>
              <div>Visitor Map</div><div className="button-arrow" />
            </div>
            <div className="app-pager app-prev" onClick={this._handleClickPrev}>
              <div className="button-arrow"></div><div>Daily Programs</div>
            </div>
          </div>

          <div className={((this.state.nextPageEvent) && (this.props.appOnPage === 'events')) ? 'pager next' : 'hide pager next'} onClick={this._handleClickNextEvent}></div>
          <div className={((this.state.prevPageEvent) && (this.props.appOnPage === 'events')) ? 'pager prev' : 'hide pager prev'} onClick={this._handleClickPrevEvent}></div>

        </div>

      </div>
    )
  }

})

export default Translator
