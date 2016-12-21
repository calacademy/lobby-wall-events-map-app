import React from 'react'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import Translator from '../js/components/Translator'
import Modal from '../js/components/Modal'

describe('Translator', () => {

  let translator

  beforeEach(() => {
    translator = shallow(<Translator />)
  })

  it('Initial isModalOpen state is false', () => {
    expect(translator.state('isModalOpen')).toBe(false)
  })

  it('Modal button click changes isModalOpen state to true', () => {
    translator.find('.modal-button').simulate('click')
    expect(translator.state('isModalOpen')).toBe(true)
  })

  // regression test - jest snapshot
  it('enzyme mount matches snapshot', () => {
    expect(shallowToJson(translator)).toMatchSnapshot()
  })

})
