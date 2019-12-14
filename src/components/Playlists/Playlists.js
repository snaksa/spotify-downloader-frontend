import React, {useEffect, useState} from 'react';
import {Card, Table, Image} from 'react-bootstrap';
import {Helmet} from "react-helmet";
import useStyles from './styles';
import {TRACK_STATUS_FETCHED} from '../../constants/downloadStatus';
import request from '../../api/request';
import Header from "../Header/Header";
import Tracks from "../Tracks/Tracks";

const Playlists = ({history}) => {

    const classes = useStyles();

    const [playlists, setPlaylists] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState('');
    const [fetchedIds, setFetchedIds] = useState({});
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        request('/api/me/playlists')
            .then(response => response.json())
            .then(json => {
                const result = json.map((item) => {
                    const image = item.images.length > 0 ? item.images[0].url : '';

                    return {
                        id: item.id,
                        name: item.name,
                        total: item.total,
                        image: image
                    }
                });

                setPlaylists(result);
            })
            .catch(error => console.log('Authorization failed : ' + error.message));
    }, []);

    const getTracks = (id) => {
        setSelectedPlaylist(id);

        request(`/api/playlists/${id}/tracks`)
            .then(response => response.json())
            .then(json => {
                const result = json.map((item) => {
                    const artists = item.artists.map((artist) => {
                        return artist.name;
                    });

                    return {
                        id: item.id,
                        name: item.name,
                        artists: artists.join(' & '),
                        status: TRACK_STATUS_FETCHED
                    }
                });

                setTracks(result);
            })
            .catch(error => console.log('Authorization failed : ' + error.message));
    };

    return (
        <div className={classes.main}>
            <Helmet>
                <title>Spotify Playlists | Youtube & Spotify Audio Downloader</title>
            </Helmet>
            <Card bg="dark" text="white">
                <Header history={history}/>
                <Card.Body>
                    <div className={classes.playlists}>
                        <Table striped hover variant="dark">
                            <thead>
                            <tr>
                                <th width={'60px'}></th>
                                <th width={'300px'}>Title</th>
                                <th width={'60px'}>Tracks</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                playlists.map((playlist, index) => {
                                    // TODO: what are we gonna do !?!?!?
                                    return <tr key={index}
                                               className={(playlist.id === selectedPlaylist ? classes.tableRowSelected : classes.tableRow)}
                                               onClick={() => getTracks(playlist.id)}>
                                        <td style={{verticalAlign: 'middle'}}>
                                            <Image src={playlist.image} className={classes.playlistImage}/>
                                        </td>
                                        <td style={{verticalAlign: 'middle'}}>
                                            {playlist.name}
                                        </td>
                                        <td style={{verticalAlign: 'middle'}}>
                                            {playlist.total}
                                        </td>
                                        <td>
                                        </td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </Table>
                    </div>

                    <Tracks
                        tracks={tracks}
                        setTracks={setTracks}
                        setFetchedIds={setFetchedIds}
                        fetchedIds={fetchedIds}
                        fetching={fetching}
                        setFetching={setFetching}
                    />
                </Card.Body>
            </Card>
        </div>
    );
};

export default Playlists;