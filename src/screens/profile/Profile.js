import React, { Component } from 'react';
import './Profile.css';
import { Redirect } from 'react-router-dom';
import Header from '../../common/header/Header';
import profilePic from '../../assets/profilePic.jpg';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import Modal from '@material-ui/core/Modal';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    avatar: {
        width: 150,
        height: 150
    },
    editIcon: {
        margin: '10px 0 0 10px',
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

    },
    editModalContent: {
        backgroundColor: 'white',
        width: 200,
        padding: 25,
        borderRadius: 4,
        border: '2px solid #dcd6d6'
    },
});

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accessToken: sessionStorage.getItem("access-token"),
            loggedIn: sessionStorage.getItem("access-token") === null ? false : true,
            likeCountList: JSON.parse(sessionStorage.getItem('likeCountList')),
            commentList: JSON.parse(sessionStorage.getItem('commentList')),
            mediaList: [],
            username: '',
            numOfPosts: 0,
            followers: 300,
            following: 250,
            name: 'Somya Chowdhary',
            editModalIsopen: false,
            mediaModalIsopen: false
        };
    }

    // componentDidMount() {
    //     this.fectchUserName();
    //     this.fetchImageDetails();
    // }

    /** Method to fetch user details from instagram graph endpoint */
    // fectchUserName = () => {
    //     let url = this.props.baseUrl + "me?fields=id,username&access_token=" + this.state.accessToken;
    //     fetch(url)
    //         .then(resp => {
    //             if (resp.status === 200) {
    //                 resp.json().then(resp => {
    //                     console.log(resp);
    //                     this.setState({ username: resp.username })
    //                 });
    //             }
    //         },
    //             err => console.log(err)
    //         )
    //         .catch(err => console.log(err));
    // }

    /** Method to fetch data from instagram graph endpoint */
    // fetchImageDetails = () => {
    //     let that = this;
    //     fetch(
    //         `https://graph.instagram.com/me/media?fields=id,caption&access_token=${this.state.accessToken}`
    //     )
    //         .then(rsp => {
    //             if (rsp.status === 200) {
    //                 rsp.json().then(res => {
    //                     console.log('res', res);
    //                     this.setState({numOfPosts: res.data.length});
    //                     const promises = res.data.map(item =>
    //                         fetch(
    //                             `https://graph.instagram.com/${item.id}?fields=id,media_type,media_url,username,timestamp&access_token=${this.state.accessToken}`
    //                         )
    //                     );
    //                     Promise.all(promises)
    //                         .then(responses => {
    //                             return Promise.all(
    //                                 responses.map(function (response) {
    //                                     return response.json();
    //                                 })
    //                             );
    //                         },
    //                             err => console.log(err)
    //                         )
    //                         .then(function (data) {
    //                             console.log("data", data);
    //                             data.forEach((media, i) => {
    //                                 const mediaCaption = res.data[i];
    //                                 if (mediaCaption.caption) {
    //                                     media.caption = mediaCaption.caption
    //                                     media.hashtags = mediaCaption.caption.split(' ').filter(str => str.startsWith('#')).join(' ');
    //                                     media.trimmedCaption = mediaCaption.caption.replace(/(^|\s)#[a-zA-Z0-9][^\\p{L}\\p{N}\\p{P}\\p{Z}][\w-]*\b/g, '');
    //                                 } else {
    //                                     media.caption = null;
    //                                 }
    //                                 console.log(that.state.likeCountList);
    //                                 //console.log(this.state.likeCountList);
    //                                 console.log(that.state.commentList);
    //                                 //console.log(this.state.commentList);
    //                                 media.likeCount = that.state.likeCountList[i].count;
    //                                 media.likeStr = that.state.likeCountList[i].likeStr;
    //                                 media.userLiked = that.state.likeCountList[i].userLiked;
    //                                 media.comments = that.state.commentList[i];
    //                                 media.comment = '';

    //                                 // /** Method to change date format to mm/dd/yyyy HH:MM:SS format */
    //                                 // const mediaDate = new Date(media.timestamp);
    //                                 // const formattedDt = (mediaDate.getMonth() + 1).toString().padStart(2, '0') + '/'
    //                                 //     + mediaDate.getDate().toString().padStart(2, '0') + '/'
    //                                 //     + mediaDate.getFullYear().toString().padStart(4, '0') + ' '
    //                                 //     + mediaDate.getHours().toString().padStart(2, '0') + ':'
    //                                 //     + mediaDate.getMinutes().toString().padStart(2, '0') + ':'
    //                                 //     + mediaDate.getSeconds().toString().padStart(2, '0');
    //                                 // media.timestamp = formattedDt;
    //                             });
    //                             that.setState({ mediaList: data, filteredMediaList: data });
    //                         },
    //                             err => console.log(err)
    //                         ).catch(err => console.log(err));
    //                 });
    //             }
    //         },
    //             err => console.log(err)
    //         ).catch(err => console.log(err));
    // }

    /** Handler to open Edit modal when user clicks Edit icon */
    openEditModalHandler = () => {
        console.log(this.state.likeCountList);
        console.log(this.state.commentList);
        this.setState({ editModalIsopen: !this.state.editModalIsopen })
    }

    /** Handler to close Edit modal when user clicks Edit icon */
    closeEditModalHandler = () => {
        this.setState({ editModalIsopen: !this.state.editModalIsopen })
    }

    render() {
        if (!this.state.loggedIn) {
            return (
                <Redirect to="/" />
            )
        }
        const { classes } = this.props;
        return (
            <div>
                {/** Header component included here */}
                <Header loggedIn={this.state.loggedIn} history={this.props.history} />

                {/** User Info section starts here */}
                <div className="info-section">
                    <Avatar variant="circular" alt="Profile Picture" src={profilePic}
                        className={classes.avatar}></Avatar>
                    <div className="profile-details">
                        <div>
                            <Typography variant="h4">{this.state.username}</Typography>
                        </div>
                        <div className="middle-line">
                            <div>
                                <Typography>
                                    <span>Posts: </span>{this.state.numOfPosts}
                                </Typography>
                            </div>
                            <div>
                                <Typography>
                                    <span>Follows: </span>{this.state.following}
                                </Typography>
                            </div>
                            <div>
                                <Typography>
                                    <span>Followed By: </span>{this.state.followers}
                                </Typography>
                            </div>
                        </div>
                        <div>
                            <Typography variant="h6">
                                <span>{this.state.name}</span>
                                <Fab size="medium" color="secondary" aria-label="edit"
                                    className={classes.editIcon} onClick={this.openEditModalHandler}>
                                    <EditIcon />
                                </Fab>
                            </Typography>
                        </div>
                    </div>
                </div>
                {/** User Info section ends here */}

                {/** Edit Modal section starts here */}
                <Modal open={this.state.editModalIsopen} onClose={this.closeEditModalHandler}
                    className="edit-name-modal">
                    <div className={classes.editModalContent} style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)", position:'relative'
                    }}>
                        <FormControl className="modal-heading">
                            <Typography variant="h4">
                                Edit
                        </Typography>
                        </FormControl>
                        <br />
                        <br />
                        <FormControl required>
                            <InputLabel htmlFor='fullName'>Full Name</InputLabel>
                            <Input id='fullName' type='text'/>
                            
                        </FormControl>
                        <br />
                        <br />
                        <br />
                        <Button variant='contained' color='primary'>
                            UPDATE
                        </Button>
                    </div>
                </Modal>
                {/** Edit Modal section ends here */}
            </div >

        )
    }
}

export default withStyles(styles)(Profile);