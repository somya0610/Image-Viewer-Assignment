import React, { Component } from 'react';
import './Header.css';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

class Header extends Component {
    render() {
        return (
            <div>
                <header className="app-header">
                    <span className="app-logo">Image Viewer</span>
                    {this.props.loggedIn ?
                        <div className="app-header-right">
                            {this.props.showSearchBox ?
                                <Input type="search" placeholder="Search…" disableUnderline className="search-box"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <SearchIcon className="search-icon"/>
                                        </InputAdornment>
                                    } /> 
                                : ''}
                        </div>
                        : ''}
                </header>
            </div>
        )
    }
}

export default Header;