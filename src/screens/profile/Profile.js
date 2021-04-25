import React, { Component } from 'react';
import './Profile.css';
import { Redirect } from 'react-router-dom';
import Header from '../../common/header/Header';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accessToken: sessionStorage.getItem("access-token"),
            loggedIn: sessionStorage.getItem("access-token") === null ? false : true,
        };
    }

    render() {
        if (!this.state.loggedIn) {
            return (
                <Redirect to="/" />
            )
        }
        return (
            <div>
                <Header loggedIn={this.state.loggedIn} history={this.props.history} />
            </div >
        )
    }
}

export default Profile;