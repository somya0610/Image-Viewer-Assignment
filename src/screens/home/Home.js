import React, { Component } from 'react';
import './Home.css';
import Header from '../../common/header/Header';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true
        }
    }

    render() {
        return (
            <div>
                <Header loggedIn={this.state.loggedIn} homePage={true}/>
            </div>
        )
    }
}

export default Home;