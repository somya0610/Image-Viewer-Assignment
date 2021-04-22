import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from "./login/Login";
import Home from './home/Home';

class ImageViewerController extends Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path='/' render={(props) => <Login {...props} />} />
          <Route exact path='/home' render={(props) => <Home {...props} />} />
        </div>
      </Router>
    )
  }
}

export default ImageViewerController;