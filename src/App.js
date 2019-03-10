import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import AddVehicle from './components/AddVehicle'
import Home from './components/Home'

import './App.css'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/add" component={AddVehicle} />
          <Route exact path="/" component={Home} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App
