import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import join from './pages/join'

const App = () => {
  return (
    <Router>
      <Route exact path='/' component={join} />
    </Router>
  )
}

export default App
