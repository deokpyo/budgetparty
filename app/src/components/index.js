import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import {
  Route,
  BrowserRouter as Router,
  Redirect,
  Switch
} from 'react-router-dom'
import Home from './Home'
import Intro from './Intro'
import DashboardContainer from '../containers/Dashboard'
import Service from './Service'
import ServiceBudget from './ServiceBudget'
import User from './User'
import { firebaseAuth } from '../config/constants'
import { logout } from '../helpers/auth'
import { Provider } from 'react-redux'

// function PrivateRoute ({component: Component, authed, ...rest}) {
//   return (
//     <Route
//       {...rest}
//       render={(props) => authed === true
//         ? <Component {...props} />
//         : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
//     />
//   )
// }
//
// function PublicRoute ({component: Component, authed, ...rest}) {
//   return (
//     <Route
//       {...rest}
//       render={(props) => authed === false
//         ? <Component {...props} />
//         : <Redirect to='/intro' />}
//     />
//   )
// }
import store from '../store';

export default class App extends Component {
  state = {
    authed: false,
    loading: true,
  }

  updateAuthState(user) {
    console.log(user);
    if (user) {
      this.setState({
        authed: true,
        loading: false,
      })
    } else {
      this.setState({
        loading: false
      })
    }
  }

  componentDidMount () {
    this.removeListener = firebaseAuth().onAuthStateChanged(user => this.updateAuthState(user))
  }

  componentWillUnmount () {
    this.removeListener()
  }

  handleLogout() {
    console.log("LOGGED OUT")
    logout()
    this.setState({authed: false})
  }

  render() {
    return this.state.loading === true ? <h1>Loading</h1> : (
      <Provider store={store}>
        <Router>
          <div className="container">
            <div className="row">
              <Switch>
                <Route path='/' exact render={() => {
                  return this.state.authed
                  ? <Redirect to="/dashboard" />
                  : <Redirect to="/login" />
                }} />
                <Route path='/login' isAuthed={this.state.authed} render={() => {
                  return this.state.authed
                  ? <Redirect to="/intro/1" />
                  : <Home />
                  }}
                />
                <Route path='/intro/:id' render={(props) => <Intro {...props} authed={this.state.authed} handleLogout={this.handleLogout.bind(this)} />} />
                <Route path='/dashboard' render={props => <DashboardContainer isAuthed={this.state.authed} handleLogout={this.handleLogout.bind(this)} />} />
                <Route path='/service/:id' exact render={props => {
                  return <Service {...props}
                    isAuthed={this.state.authed}
                    handleLogout={this.handleLogout.bind(this)}
                  />
                }} />
                <Route path='/service/:service_id/department/:id' render={props => {
                  return <ServiceBudget {...props}
                    isAuthed={this.state.authed}
                    handleLogout={this.handleLogout.bind(this)}
                  />
                }} />
                <Route path='/user' render={props => <User isAuthed={this.state.authed} handleLogout={this.handleLogout.bind(this)} />} />
                <Route render={() => <h3>404, you ain't supposed to be here</h3>} />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}