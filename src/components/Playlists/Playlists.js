import React, { useEffect, useState } from 'react';
import { Card, Table, Image } from 'react-bootstrap';
import {
  TRACK_STATUS_FETCHED,
  TRACK_STATUS_DOWNLOADING,
  TRACK_STATUS_DOWNLOAD_SUCCESS,
  TRACK_STATUS_DOWNLOAD_FAILURE
} from '../../constants/downloadStatus';
import spotifyLogo from '../../images/spotifyLogo.png';
import youtubeLogo from '../../images/youtubeLogo.png';
import loader from '../../images/loader.svg';
import download from '../../images/download.webp';
import success from '../../images/success.png';
import error from '../../images/error.png';
import request from '../../api/request';

const Playlists = ({ history }) => {

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
  }


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
  }

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

        var url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = `${name}.mp3`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(error => console.log('Authorization failed : ' + error.message));
  }

  const downloadAll = () => {

    tracks.forEach(track => {
      if (track.id in fetchedIds && fetchedIds[track.id]) {
        downloadTrack(fetchedIds[track.id], track);
      }
    });
  }

  const logout = () => {
    localStorage.setItem('accessToken', null);
    localStorage.setItem('refreshToken', null);
    history.push('/');
  }

  return (
    <div className={'main'}>
      <Card bg="dark" text="white">
        <Card.Header>
          <div className={'header'}>
            <div className={'headerProfile'}>
              <Image src={localStorage.getItem('image')} className={'profileImage'} />
              <br />
              {localStorage.getItem('name')}

              {
                localStorage.getItem('accessToken') &&
                <div onClick={() => logout()} style={{ color: '#67d860', cursor: 'pointer' }}>
                  Logout
                </div>
              }
            </div>

          </div>

          <div className={'headerLogo'}>
            <Image src={spotifyLogo} style={{ margin: 10, width: '200px', }} />
          </div>
        </Card.Header>
        <Card.Body>
          <div className={'playlists'}>
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
                    return <tr key={index} className={'tableRow' + (playlist.id === selectedPlaylist ? 'Selected' : '')} onClick={() => getTracks(playlist.id)}>
                      <td style={{ verticalAlign: 'middle' }}>
                        <Image src={playlist.image} className={'playlistImage'} />
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {playlist.name}
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
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

          <div className={'tracks'}>
            <Table striped variant="dark">
              <thead>
                <tr>
                  <th width={'40%'}>Artist</th>
                  <th width={'40%'}>Title</th>
                  <th>
                    {
                      tracks.length > 0 && !fetching &&
                      <Image
                        className={'youtubeIcon'}
                        src={youtubeLogo}
                        onClick={() => getYoutubeLinks()}
                      />
                    }

                    {
                      tracks.length > 0 && fetching &&
                      <Image
                        className={'youtubeIcon'}
                        src={loader}
                      />
                    }
                    {
                      Object.keys(fetchedIds).length > 0 &&
                      <Image
                        className={'youtubeIcon'}
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
                              className={'youtubeIcon'}
                              src={youtubeLogo}
                              onClick={() => window.open('https://youtube.com/watch?v=' + fetchedIds[track.id], '_blank')}
                            />

                            {
                              track.status === TRACK_STATUS_FETCHED &&
                              <Image
                                className={'youtubeIcon'}
                                src={download}
                                onClick={() => downloadTrack(fetchedIds[track.id], track)}
                              />
                            }
                          </React.Fragment>
                        }

                        {
                          track.status === TRACK_STATUS_DOWNLOADING &&
                          <Image
                            className={'youtubeIcon'}
                            src={loader}
                          />
                        }

                        {
                          track.status === TRACK_STATUS_DOWNLOAD_SUCCESS &&
                          <Image
                            className={'youtubeIcon'}
                            src={success}
                          />
                        }

                        {
                          track.status === TRACK_STATUS_DOWNLOAD_FAILURE &&
                          <Image
                            className={'youtubeIcon'}
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
        </Card.Body>
      </Card>
    </div>
  );
}

export default Playlists;