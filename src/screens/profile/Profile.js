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
import FormHelperText from '@material-ui/core/FormHelperText';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Divider from '@material-ui/core/Divider';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { red } from '@material-ui/core/colors';

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
        justifyContent: 'center'
    },
    editModalContent: {
        backgroundColor: 'white',
        width: 200,
        padding: 25,
        borderRadius: 4,
        border: '2px solid #dcd6d6'
    },
    mediaModalContent: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        width: 800,
        padding: 25,
        borderRadius: 4,
        border: '2px solid #dcd6d6'
    }
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
            mediaModalIsopen: false,
            fullName: '',
            fullNameRequired: 'dispNone',
            selecetedMedia: {},
            selectedIndex: null,
            comment: ''
        };
    }

    componentDidMount() {
        this.fectchUserName();
        this.fetchImageDetails();
    }

    /** Method to fetch user details from instagram graph endpoint */
    fectchUserName = () => {
        let url = this.props.baseUrl + "me?fields=id,username&access_token=" + this.state.accessToken;
        fetch(url)
            .then(resp => {
                if (resp.status === 200) {
                    resp.json().then(resp => {
                        console.log(resp);
                        this.setState({ username: resp.username })
                    });
                }
            },
                err => console.log(err)
            )
            .catch(err => console.log(err));
    }

    /** Method to fetch data from instagram graph endpoint */
    fetchImageDetails = () => {
        let that = this;
        fetch(
            `https://graph.instagram.com/me/media?fields=id,caption&access_token=${this.state.accessToken}`
        )
            .then(rsp => {
                if (rsp.status === 200) {
                    rsp.json().then(res => {
                        console.log('res', res);
                        this.setState({ numOfPosts: res.data.length });
                        const promises = res.data.map(item =>
                            fetch(
                                `https://graph.instagram.com/${item.id}?fields=id,media_type,media_url,username,timestamp&access_token=${this.state.accessToken}`
                            )
                        );
                        Promise.all(promises)
                            .then(responses => {
                                return Promise.all(
                                    responses.map(function (response) {
                                        return response.json();
                                    })
                                );
                            },
                                err => console.log(err)
                            )
                            .then(function (data) {
                                console.log("data", data);
                                data.forEach((media, i) => {
                                    const mediaCaption = res.data[i];
                                    if (mediaCaption.caption) {
                                        media.caption = mediaCaption.caption
                                        media.hashtags = mediaCaption.caption.split(' ').filter(str => str.startsWith('#')).join(' ');
                                        media.trimmedCaption = mediaCaption.caption.replace(/(^|\s)#[a-zA-Z0-9][^\\p{L}\\p{N}\\p{P}\\p{Z}][\w-]*\b/g, '');
                                    } else {
                                        media.caption = null;
                                    }
                                    console.log(that.state.likeCountList);
                                    console.log(that.state.commentList);
                                    media.likeCount = that.state.likeCountList[i].count;
                                    media.likeStr = that.state.likeCountList[i].likeStr;
                                    media.userLiked = that.state.likeCountList[i].userLiked;
                                    media.comments = that.state.commentList[i];

                                    // /** Method to change date format to mm/dd/yyyy HH:MM:SS format */
                                    // const mediaDate = new Date(media.timestamp);
                                    // const formattedDt = (mediaDate.getMonth() + 1).toString().padStart(2, '0') + '/'
                                    //     + mediaDate.getDate().toString().padStart(2, '0') + '/'
                                    //     + mediaDate.getFullYear().toString().padStart(4, '0') + ' '
                                    //     + mediaDate.getHours().toString().padStart(2, '0') + ':'
                                    //     + mediaDate.getMinutes().toString().padStart(2, '0') + ':'
                                    //     + mediaDate.getSeconds().toString().padStart(2, '0');
                                    // media.timestamp = formattedDt;
                                });
                                that.setState({ mediaList: data, filteredMediaList: data });
                            },
                                err => console.log(err)
                            ).catch(err => console.log(err));
                    });
                }
            },
                err => console.log(err)
            ).catch(err => console.log(err));
    }

    /** Handler to open Edit modal when user clicks Edit icon */
    openEditModalHandler = () => {
        console.log(this.state.likeCountList);
        console.log(this.state.commentList);
        this.setState({ editModalIsopen: !this.state.editModalIsopen })
    }

    /** Handler to close Edit modal when user clicks Edit icon */
    closeEditModalHandler = () => {
        this.setState({
            editModalIsopen: !this.state.editModalIsopen,
            fullName: ''
        })
    }

    /** Handler to update state variable 'fullName' as user enter details on the screen*/
    inputFullNameChangeHandler = (event) => {
        this.setState({ fullName: event.target.value })
    }

    /** Handler to update user name on the user info section */
    updateHandler = () => {
        if (this.state.fullName === "") {
            this.setState({ fullNameRequired: 'dispBlock' })
            return;
        } else {
            this.setState({ fullNameRequired: 'dispNone' });
        }

        this.setState({
            editModalIsopen: !this.state.editModalIsopen,
            name: this.state.fullName,
            fullName: ''
        })
    }

    openMediaModalHandler = (mediaId) => {
        var idx = 0;
        var media = this.state.mediaDetailList.filter((media, index) => {
            if (media.id === mediaId) {
                idx = index;
                return true;
            }
            return false;
        })[0];
        var hashtags = media.caption.split(' ').filter(str => str.startsWith('#')).join(' ');
        media.caption = media.caption.replace(/(^|\s)#[a-zA-Z0-9][^\\p{L}\\p{N}\\p{P}\\p{Z}][\w-]*\b/g, '');

        this.setState({
            mediaModalIsopen: !this.state.mediaModalIsopen,
            selecetedMedia: media,
            selectedIndex: idx,
            selectedHashTags: hashtags,
        });
        console.log(this.state.commentList[idx].length);
    }

    closeMediaModalHandler = () => {
        this.setState({
            mediaModalIsopen: !this.state.mediaModalIsopen
        })
    }

    openMediaModalHandler = (mediaId) => {
        var idx = 0;
        var media = this.state.mediaList.filter((media, index) => {
            if (media.id === mediaId) {
                idx = index;
                return true;
            }
            return false;
        })[0];
        console.log("hiii");
        this.setState({
            mediaModalIsopen: !this.state.mediaModalIsopen,
            selecetedMedia: media,
            selectedIndex: idx
        });
    }

    closeMediaModalHandler = () => {
        this.setState({
            mediaModalIsopen: !this.state.mediaModalIsopen
        })
    }

    favIconClickHandler = () => {
        let tempMediaList = this.state.mediaList;
        tempMediaList[this.state.selectedIndex].userLiked
            ? --tempMediaList[this.state.selectedIndex].likeCount
            : ++tempMediaList[this.state.selectedIndex].likeCount;
        tempMediaList[this.state.selectedIndex].likeCount > 1
            ? tempMediaList[this.state.selectedIndex].likeStr = 'likes'
            : tempMediaList[this.state.selectedIndex].likeStr = 'like';
        tempMediaList[this.state.selectedIndex].userLiked = !tempMediaList[this.state.selectedIndex].userLiked;
        this.setState({ mediaList: tempMediaList });
    }

    inputCommentChangeHandler = (e) => {
        this.setState({ comment: e.target.value });
    }

    addCommentHandler = () => {
        if (this.state.comment) {
            let tempMediaList = this.state.mediaList;
            let tempComments = tempMediaList[this.state.selectedIndex].comments;
            tempComments.push({ commentStr: this.state.comment });
            tempMediaList[this.state.selectedIndex].comments = tempComments;
            tempMediaList[this.state.selectedIndex].comment = '';
            this.setState({
                mediaList: tempMediaList,
                comment: ''
            });
        }
        document.getElementById('comment').value = '';


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

                {/** Image section starts here */}
                <div className="image-section">
                    <GridList cols={3} cellHeight={450}>
                        {this.state.mediaList.map(media => (
                            <GridListTile onClick={() => this.openMediaModalHandler(media.id)}
                                key={"grid_" + media.id}>
                                <img src={media.media_url} alt={media.caption} style={{ cursor: 'pointer' }} />
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
                {/** Image section starts here */}

                {/** Edit Modal section starts here */}
                <Modal open={this.state.editModalIsopen} onClose={this.closeEditModalHandler}
                    className="edit-name-modal">
                    <div className={classes.editModalContent} style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)", position: 'relative'
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
                            <Input id='fullName' type='text' onChange={this.inputFullNameChangeHandler} />
                            <FormHelperText className={this.state.fullNameRequired}>
                                <span className='required'>required</span>
                            </FormHelperText>
                        </FormControl>
                        <br />
                        <br />
                        <br />
                        <Button variant='contained' color='primary' onClick={this.updateHandler}>
                            UPDATE
                        </Button>
                    </div>
                </Modal>
                {/** Edit Modal section ends here */}

                {/** Image Modal section starts here */}
                <Modal open={this.state.mediaModalIsopen} onClose={this.closeMediaModalHandler} className={classes.modal}>
                    <div className={classes.mediaModalContent}>
                        <div className="image-modal-left">
                            <img src={this.state.selecetedMedia.media_url} alt={this.state.selecetedMedia.media_url}
                                className="modal-media-img" />
                        </div>
                        <div className="image-modal-right">
                            <div className="media-header">
                                <Avatar variant="circular" alt="Profile Picture" src={profilePic}></Avatar>
                                <Typography variant="h4" style={{ paddingLeft: '10px' }}>
                                    {this.state.selecetedMedia.username}
                                </Typography>
                            </div>
                            <div className="media-dtl-divider">
                                <Divider variant="fullWidth" />
                            </div>
                            <div className="media-caption">
                                <Typography style={{ fontSize: '14px' }}>
                                    {this.state.selecetedMedia.trimmedCaption}
                                </Typography>
                                <Typography style={{ fontSize: '14px', color: '#0ab7ff' }}>
                                    {this.state.selecetedMedia.hashtags}
                                </Typography>
                            </div>
                            <div className="modal-comment-section">
                                {this.state.selecetedMedia.comments && this.state.selecetedMedia.comments.length > 0 ?
                                    (this.state.selecetedMedia.comments.map((comment, i) => (
                                        <p key={'comment_' + this.state.selectedIndex + '_' + i} style={{ margin: '0 0 6px 0' }}>
                                            <b>{this.state.selecetedMedia.username}:</b> {comment.commentStr}
                                        </p>
                                    )))
                                    : ''}
                            </div>
                            <div className="modal-media-icon-section">
                                {this.state.selecetedMedia.userLiked ?
                                    <FavoriteIcon fontSize='default' style={{ color: red[500], fontSize: 30 }}
                                        onClick={() => this.favIconClickHandler()} />
                                    :
                                    <FavoriteBorderIcon style={{ fontSize: 30 }}
                                        onClick={() => this.favIconClickHandler()} />}
                                <Typography style={{ paddingLeft: 15, fontSize: 14 }}>
                                    {this.state.selecetedMedia.likeCount + ' '
                                        + this.state.selecetedMedia.likeStr}
                                </Typography>
                            </div>
                            <div>
                                <FormControl style={{ marginRight: 10 }} className='modal-comment-form-control'>
                                    <InputLabel htmlFor='comment'>Add a comment</InputLabel>
                                    <Input id='comment' type='text' value={this.state.comment}
                                        onChange={this.inputCommentChangeHandler} />
                                </FormControl>
                                <FormControl style={{ verticalAlign: "bottom" }}>
                                    <Button variant='contained' color='primary'
                                        onClick={this.addCommentHandler}>
                                        ADD
                                    </Button>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                </Modal>
                {/** Image Modal section ends here */}
            </div >

        )
    }
}

export default withStyles(styles)(Profile);