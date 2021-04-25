import React, { Component } from 'react';
import './Header.css';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import profilePic from '../../assets/profilePic.jpg';

class Header extends Component {
    render() {
        return (
            <div>
                <header className="app-header">
                    <span className="app-logo">Image Viewer</span>
                    {/**Below section needs to be displayed only for Home Page */}
                    {this.props.loggedIn ?
                        <div className="app-header-right">
                            {this.props.homePage ?
                                <Input type="search" placeholder="Search…" disableUnderline className="search-box"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <SearchIcon className="search-icon" />
                                        </InputAdornment>
                                    } />
                                : ''}
                            <div>
                                <IconButton aria-controls="simple-menu" aria-haspopup="true"
                                    style={{ padding: "5px 10px" }}>
                                    <Avatar variant="circular" alt={profilePic} src={profilePic} ></Avatar>
                                </IconButton>
                            </div>
                        </div>
                        : ''}
                </header>
            </div>
        )
    }
}

export default Header;