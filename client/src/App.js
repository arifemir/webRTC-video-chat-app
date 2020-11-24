import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import join from './pages/join'
import chat from './pages/chat'

const App = () => {
  return (
    <Router>
      <Route exact path='/' component={join} />
      <Route exact path="/chat" component={chat}/>
    </Router>
  )
}

export default App
