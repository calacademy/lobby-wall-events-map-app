'use strict'

import React from 'react'
import { render } from 'react-dom'
import App from './components/App.jsx'

require('../sass/style.scss')

render(
  <App />,
  document.getElementById('app-container')
)
