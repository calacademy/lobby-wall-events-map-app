import React from 'react'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import Modal from '../js/components/Modal'

describe('Modal', () => {

  let modal

  beforeEach(() => {
    modal = shallow(<Modal transitionName="foobar" />)
  })

  // regression test - jest snapshot
  it('enzyme shallow matches snapshot', () => {
    expect(shallowToJson(modal)).toMatchSnapshot()
  })

})
