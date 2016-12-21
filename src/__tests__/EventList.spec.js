import React from 'react'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import EventList from '../js/components/EventList'

describe('EventList', () => {

  let eventlist

  beforeEach(() => {
    eventlist = shallow(<EventList />)
  })

  // regression test - jest snapshot
  it('enzyme shallow matches snapshot', () => {
    expect(shallowToJson(eventlist)).toMatchSnapshot()
  })
})
