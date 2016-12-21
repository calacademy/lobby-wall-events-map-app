import React from 'react'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import App from '../js/components/App'
import Map from '../js/components/Map'
import Header from '../js/components/Header'
import EventList from '../js/components/EventList'

describe('App', () => {

  let app

  beforeEach(() => {
    app = shallow(<App />)
  })

  it('Default state - networkConnected is false', () => {
    expect(app.state('networkConnected')).toBeFalsy()
  })

  it('Default state - eventDataInit is false', () => {
    expect(app.state('eventDataInit')).toBeFalsy()
  })

  it('Default state - eventData is null', () => {
    expect(app.state('eventData')).toBeNull()
  })

  it('Default state - eventCount is null', () => {
    expect(app.state('eventCount')).toBeNull()
  })

  //it('_testNetworkConnection() called - networkConnected is true', () => {
    //app.instance()._testNetworkConnection()
    //expect(app.state('networkConnected')).toBeTruthy()
  //})

  it('renders one <Map /> component', () => {
    expect(app.find(Map).length).toEqual(1)
  })

  it('renders one <Header /> component', () => {
    expect(app.find(Header).length).toEqual(1)
  })

  it('renders one <EventList /> component', () => {
    expect(app.find(EventList).length).toEqual(1)
  })

  // regression test - jest snapshot
  it('Enzyme shallow matches snapshot', () => {
    expect(shallowToJson(app)).toMatchSnapshot()
  })

})
