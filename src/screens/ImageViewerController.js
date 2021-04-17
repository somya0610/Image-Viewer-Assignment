import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from "./login/Login";

class ImageViewerController extends Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path='/' render={(props) => <Login {...props} />} />
        </div>
      </Router>
    )
  }
}

export default ImageViewerController;