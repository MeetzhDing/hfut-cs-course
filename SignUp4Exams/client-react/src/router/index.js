import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import Login from '../views/login';
import Home from '../views/home/home';
import AdminLogin from '../views/admin/adminLogin';
import AdminHome from '../views/admin/home/adminHome';

import { Provider } from 'react-redux';
import store from '../redux/store';


const MyRouter = () => (
  <Provider store={store}>
    <Router>
      <Route exact path="/" component={Login}/>
      <Route exact path="/home" component={Home}/>
      <Route exact path="/admin" component={AdminLogin}/>
      <Route exact path="/admin/home" component={AdminHome}/>
    </Router>
  </Provider>
)

export default MyRouter;