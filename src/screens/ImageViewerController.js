import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from "./login/Login";
import Home from './home/Home';
import Profile from './profile/Profile';

class ImageViewerController extends Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path='/' render={(props) => <Login {...props} />} />
          <Route exact path='/home' render={(props) => <Home {...props} />} />
          <Route exact path='/profile' render={(props) => <Profile {...props} />} />
        </div>
      </Router>
    )
  }
}

export default ImageViewerController;