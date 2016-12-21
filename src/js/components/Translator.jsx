'use strict'

var React = require('react')
var ReactDOM = require('react-dom')
var $ = require('jquery')

import Modal from './Modal.jsx'

var timer

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
    }
  },

  _openModal: function() {
    if (navigator.onLine) {
      this.setState({isModalOpen: true})
      clearTimeout(timer)
      // reset default translation after 60 sec
      timer = setTimeout(function() {
        this._resetDefaultTranslation()
      }.bind(this), 60000)
    }
  },

  _closeModal: function() {
      this.setState({isModalOpen: false})
  },

  _handleClick: function(lang, text) {
    if (navigator.onLine) {
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
      clearTimeout(timer)
      // reset default translation after 60 sec
      timer = setTimeout(function() {
        this._resetDefaultTranslation()
      }.bind(this), 60000)
    }
  },

  _resetDefaultTranslation: function() {
    this._closeModal()
    if (navigator.onLine) {
      this.setState({
        language: 'en'
      })
      $('.google-translate select').val('en')
      this._triggerHtmlEvent($('.google-translate select'), 'change')
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

  componentWillReceiveProps: function(nextProps) {
    if ((this.props.networkConnected === false) && (nextProps.networkConnected === true)) {
      $.getScript("//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit")
      this._buildTranslatorOptions()
    }
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
            <button className={(data.value === this.state.language) ? 'selected notranslate big-select-button' : 'notranslate big-select-button'} onClick={_this._handleClick.bind(_this, data.value, data.text)}>{data.text}</button>
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
          <div className={this.state.language === 'en' ? 'footer-claude' : 'hide'}></div>
        </div>
      </div>
    )
  }

})

export default Translator
