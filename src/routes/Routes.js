import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Orçamento from '../pages/Budget'
import AppMenu from '../components/Menu'

const Routes = () => (
  <Router>
    <div style={{ display: 'flex' }}>
      <AppMenu />
      <div style={{ flex: 1, padding: '20px' }}>
        <Switch>
          <Route path="/orcamento" component={Orçamento} />
        </Switch>
      </div>
    </div>
  </Router>
)

export default Routes
