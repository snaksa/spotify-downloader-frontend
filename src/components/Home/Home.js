import React, {useState} from 'react';
import useStyles from './styles';
import {Helmet} from "react-helmet";
import {Form, Image} from "react-bootstrap";
import Button from '@material-ui/core/Button';
import spotifyLogo from "../../images/spotifyLogo.png";
import youtubeLogo from "../../images/youtubeLogoText.png";
import request from "../../api/request";

const Home = () => {
    const classes = useStyles();
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [trackTitle, setTrackTitle] = useState('');
    const [trackThumbnail, setTrackThumbnail] = useState('');

    const url = encodeURIComponent(`http://${process.env.REACT_APP_URL}/login`);

    const getInfo = (url) => {
        request(`/info?id="${url}"`, 'get', null, process.env.REACT_APP_DOWNLOAD_URL)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
            })
            .then(response => {
                setTrackTitle(response.title);
                setTrackThumbnail(response.thumbnail);
                downloadTrack(response.videoId, response.title);
            })
            .catch(error => console.log('Authorization failed : ' + error.message));
    };

    const downloadTrack = (url, title) => {
        url = encodeURIComponent(url);
        request(`/track?id=${url}`, 'get', null, process.env.REACT_APP_DOWNLOAD_URL)
            .then(response => {
                if (response.status === 200) {
                    return response.blob();
                }
            })
            .then(blob => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = `${title}.mp3`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTrackTitle('Download next');
            })
            .catch(error => console.log('Request failed: ' + error.message));
    };

    return (
        <div id="main">
            <Helmet>
                <title>Home | Youtube & Spotify Audio Downloader</title>
            </Helmet>
            <div className={'logo'}>
                <div>
                    <div className={classes.headerLogo}>
                        <Image className={classes.youtubeLogo} src={youtubeLogo}/>
                        <div className={classes.inputContainer}>
                            <Form.Control
                                placeholder="Paste video URL"
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                classes={{root: classes.youtubeDownloadButton}}
                                onClick={() => getInfo(youtubeUrl)}>
                                {trackTitle ? trackTitle : 'Download'}
                            </Button>
                            <Form.Text className="text-muted">
                                (e.g. https://www.youtube.com/watch?v=VsN7E35LpJE)
                            </Form.Text>

                            <Image src={trackThumbnail}/>
                        </div>
                    </div>
                    <div className={classes.headerLogo}>
                        <a href={`https://accounts.spotify.com/en/authorize?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&response_type=code&scope=user-read-private%20user-library-read%20user-read-email&redirect_uri=${url}`}>
                            <Image className={classes.logoImage} src={spotifyLogo}/>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;