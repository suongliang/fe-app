import React from 'react'
import './App.css'
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom'
import Counter from './pages/Counter'
import Employees from './pages/Employees'
import LandingPage from './pages/LandingPage'
import './styles/styles.scss'

function App () {
  return (
    <div className="App">
      <BrowserRouter>
       <header>
         <nav>
           <ul className="d-flex align-items-center justify-content-end full-width">
             <li className="list-style-none"><NavLink to="/" activeClassName="active">Home</NavLink></li>
             <li className="list-style-none"><NavLink to="/counter">Counter Page</NavLink></li>
             <li className="list-style-none"><NavLink to="/employees">Employees page</NavLink></li>
           </ul>
         </nav>
       </header>
        <Switch>
          <Route exact path="/" component={LandingPage}/>
          <Route path="/counter" component={Counter} />
          <Route path="/employees" component={Employees} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App