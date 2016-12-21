import React from 'react'
import { shallow } from 'enzyme'
import Header from '../js/components/Header'
import Translator from '../js/components/Translator'
import Greeting from '../js/components/Greeting'

describe('Header', () => {

  let header

  beforeEach(() => {
    header = shallow(<Header />)
  })

  it('renders one <Translator /> component', () => {
    expect(header.find(Translator).length).toEqual(1)
  })

  it('renders one <Greeting /> component', () => {
    expect(header.find(Greeting).length).toEqual(1)
  })

})
