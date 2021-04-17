import React, { Component } from 'react';
import './Login.css';
import Header from "../../common/header/Header";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';


class Login extends Component {
    render() {
        return (
            <div>
                <Header />
                <div className="login-card-container">
                    <Card className="login-card">
                        <CardContent>
                            <FormControl className='login-form-control'>
                                <Typography variant="h5">
                                    LOGIN
                                </Typography>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl required className='login-form-control'>
                                <InputLabel htmlFor='username'>Username</InputLabel>
                                <Input id='username' type='text' />
                            </FormControl>
                            <br />
                            <br />
                            <FormControl required className='login-form-control'>
                                <InputLabel htmlFor='password'>Password</InputLabel>
                                <Input id='password' type='text' />
                            </FormControl>
                            <br />
                            <br />
                            <FormControl>
                                <Button variant='contained' color='primary'>Login</Button>
                            </FormControl>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Login;