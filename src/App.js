import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import AddVehicle from './components/AddVehicle'
import Home from './components/Home'
import Webcam from './components/webcam/Index'

import './App.css'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/add" component={AddVehicle} />
          <Route exact path="/" component={Home} />
          <Route exact path="/webcam" component={Webcam} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App
