import React from 'react'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import Greeting from '../js/components/Greeting'

describe('Greeting', () => {

  let greeting

  beforeEach(() => {
    greeting = shallow(<Greeting />)
  })

  it('Class of rendered outer div', () => {
    expect(greeting.find('.greeting').length).toEqual(1)
  })

  it('Class of rendered container div', () => {
    expect(greeting.find('.greeting-container').length).toEqual(1)
  })

  it('Class of rendered iterative divs', () => {
    expect(greeting.find('.greeting-item').length).toEqual(5)
  })

  it('Greeting item divs render data', () => {
    const arr = greeting.find('.greeting-item')
    expect(arr.at(0).text()).toEqual('We speak your language')
    expect(arr.at(1).text()).toEqual('我们可以说您的母语。')
    expect(arr.at(2).text()).toEqual('Nosotros hablamos su idioma.')
    expect(arr.at(3).text()).toEqual('Nakapagsasalita kami ng Wika mo')
    expect(arr.at(4).text()).toEqual('お客様の言語で提供いたします')
  })

  // regression test - jest snapshot
  it('enzyme shallow matches snapshot', () => {
    expect(shallowToJson(greeting)).toMatchSnapshot()
  })

})
