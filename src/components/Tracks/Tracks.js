import React from 'react';
import { Table, Image } from 'react-bootstrap';
import useStyles from './styles';
import {
  TRACK_STATUS_FETCHED,
  TRACK_STATUS_DOWNLOADING,
  TRACK_STATUS_DOWNLOAD_SUCCESS,
  TRACK_STATUS_DOWNLOAD_FAILURE
} from '../../constants/downloadStatus';
import youtubeLogo from '../../images/youtubeLogo.png';
import loader from '../../images/loader.svg';
import download from '../../images/download.webp';
import success from '../../images/success.png';
import error from '../../images/error.png';
import request from '../../api/request';

const Tracks = ({ tracks, setTracks, fetching, setFetching, fetchedIds, setFetchedIds }) => {

  const classes = useStyles();

  const getYoutubeLinks = () => {

    let names = {};
    for (let i = 0; i < tracks.length; i++) {
      names[tracks[i].id] = tracks[i].artists + ' ' + tracks[i].name;
    }

    setFetching(true);
    request(`/api/youtube/find`, 'post', {
      songs: names
    })
      .then(response => response.json())
      .then(json => {
        setFetchedIds(json);
        setFetching(false);
      })
      .catch(error => console.log('Authorization failed : ' + error.message));
  };

  const downloadTrack = (id, track) => {
    const name = track.artists + ' - ' + track.name;

    let t = tracks.map(t => {
      if (track.id === t.id) {
        t.status = TRACK_STATUS_DOWNLOADING;
      }

      return t;
    });

    setTracks(t);

    request(`/track?id=${id}`, 'get', null, process.env.REACT_APP_DOWNLOAD_URL)
      .then(response => {
        if (response.status === 200) {
          return response.blob();
        }
      })
      .then(blob => {

        let t = tracks.map(t => {
          if (track.id === t.id) {
            if (!blob) {
              t.status = TRACK_STATUS_DOWNLOAD_FAILURE;
            }
            else {
              t.status = TRACK_STATUS_DOWNLOAD_SUCCESS;
            }
          }

          return t;
        });

        setTracks(t);

        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = `${name}.mp3`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(error => console.log('Authorization failed : ' + error.message));
  };

  const downloadAll = () => {

    tracks.forEach(track => {
      if (track.id in fetchedIds && fetchedIds[track.id]) {
        downloadTrack(fetchedIds[track.id], track);
      }
    });
  };

  return (
          <React.Fragment>
          {
            tracks.length > 0 &&
            <div className={classes.tracks}>
              <Table striped variant="dark">
                <thead>
                  <tr>
                    <th width={'40%'}>Artist</th>
                    <th width={'40%'}>Title</th>
                    <th>
                      {
                        tracks.length > 0 && !fetching &&
                        <Image
                          className={classes.youtubeIcon}
                          src={youtubeLogo}
                          onClick={() => getYoutubeLinks()}
                        />
                      }

                      {
                        tracks.length > 0 && fetching &&
                        <Image
                          className={classes.youtubeIcon}
                          src={loader}
                        />
                      }
                      {
                        Object.keys(fetchedIds).length > 0 &&
                        <Image
                          className={classes.youtubeIcon}
                          src={download}
                          onClick={() => downloadAll()}
                        />
                      }
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    tracks.map((track, index) => {
                      return <tr key={index}>
                        <td style={{ verticalAlign: 'middle' }}>
                          {track.artists}
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          {track.name}
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          {
                            track.id in fetchedIds && fetchedIds[track.id] &&
                            <React.Fragment>
                              <Image
                                className={classes.youtubeIcon}
                                src={youtubeLogo}
                                onClick={() => window.open('https://youtube.com/watch?v=' + fetchedIds[track.id], '_blank')}
                              />

                              {
                                track.status === TRACK_STATUS_FETCHED &&
                                <Image
                                  className={classes.youtubeIcon}
                                  src={download}
                                  onClick={() => downloadTrack(fetchedIds[track.id], track)}
                                />
                              }
                            </React.Fragment>
                          }

                          {
                            track.status === TRACK_STATUS_DOWNLOADING &&
                            <Image
                              className={classes.youtubeIcon}
                              src={loader}
                            />
                          }

                          {
                            track.status === TRACK_STATUS_DOWNLOAD_SUCCESS &&
                            <Image
                              className={classes.youtubeIcon}
                              src={success}
                            />
                          }

                          {
                            track.status === TRACK_STATUS_DOWNLOAD_FAILURE &&
                            <Image
                              className={classes.youtubeIcon}
                              src={error}
                            />
                          }

                        </td>
                        <td></td>
                      </tr>
                    })
                  }
                </tbody>
              </Table>
            </div>
          }
          </React.Fragment>
  );
};

export default Tracks;