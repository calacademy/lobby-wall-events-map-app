'use strict'

var React = require('react')

var Greeting = React.createClass({

  displayName: "Greeting",

  getInitialState: function() {
    return {
      items: [
        'We speak your language',
        '我们可以说您的母语。',
        'Nosotros hablamos su idioma.',
        'Nakapagsasalita kami ng Wika mo',
        'お客様の言語で提供いたします'
      ],
      activeItem: 0,
    }
  },

  _nextItem: function() {
      var item = this.state.activeItem + 1 < this.state.items.length ? this.state.activeItem + 1 : 0
      this.setState({activeItem: item})
  },

  componentDidMount: function() {
    setInterval(()=>this._nextItem(), 3000)
  },

  render: function() {

    var _this = this
    var items = this.state.items
    var item = items.map(function(item, index) {
      return (
        <div className="greeting-item notranslate" data-active={index === _this.state.activeItem} key={index}>{item}</div>
      )
    })

    return (
      <div className="greeting">
        <div className="greeting-container">{item}</div>
      </div>
    )

  }
})

export default Greeting
