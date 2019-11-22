import React, { useEffect, useState } from 'react';
import { Card, Table, Image } from 'react-bootstrap';
import request from '../../api/request';

const Playlists = ({history}) => {

  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [fetchedIds, setFetchedIds] = useState({});

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
            status: 0
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

    request(`/api/youtube/find`, 'post', {
      songs: names
    })
      .then(response => response.json())
      .then(json => {
        setFetchedIds(json);
      })
      .catch(error => console.log('Authorization failed : ' + error.message));
  }

  const downloadTrack = (id, track) => {
    const name = track.artists + ' - ' + track.name;

    let t = tracks.map(t => {
      if (track.id === t.id) {
        t.status = 1;
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
            t.status = 2;
          }

          return t;
        });

        setTracks(t);

        if (!blob) {
          console.log('error');
          return;
        }

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
            <Image src={'https://1.bp.blogspot.com/-xtFG2HxsdKc/XHkuICL5ePI/AAAAAAAAIPs/-FBy2Apa3qUxBF1WNOzB_dF4_KUuLJrygCK4BGAYYCw/s1600/spotify%2Bicon%2B.png'} style={{ margin: 10, width: '200px', }} />
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
                      tracks.length > 0 &&
                      <Image
                        className={'youtubeIcon'}
                        src={'https://www.freepnglogos.com/uploads/youtube-logo-icon-transparent---32.png'}
                        onClick={() => getYoutubeLinks()}
                      />
                    }
                    {
                      Object.keys(fetchedIds).length > 0 &&
                      <Image
                        className={'youtubeIcon'}
                        src={'https://cdn.pixabay.com/photo/2016/12/18/13/45/download-1915753_960_720.png'}
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
                              src={'https://www.freepnglogos.com/uploads/youtube-logo-icon-transparent---32.png'}
                              onClick={() => window.open('https://youtube.com/watch?v=' + fetchedIds[track.id], '_blank')}
                            />

                            {
                              track.status === 0 &&
                              <Image
                                className={'youtubeIcon'}
                                src={'https://cdn.pixabay.com/photo/2016/12/18/13/45/download-1915753_960_720.png'}
                                onClick={() => downloadTrack(fetchedIds[track.id], track)}
                              />
                            }
                          </React.Fragment>
                        }

                        {
                          track.status === 1 &&
                          <Image
                            className={'youtubeIcon'}
                            src={'https://crunchy.co/wp-content/themes/crunchy/assets/images/ajax-loader.svg'}
                          />
                        }

                        {
                          track.status === 2 &&
                          <Image
                            className={'youtubeIcon'}
                            src={'https://cdn0.iconfinder.com/data/icons/round-ui-icons/512/tick_green.png'}
                          />
                        }

                        {
                          track.status === 3 &&
                          <Image
                            className={'youtubeIcon'}
                            src={'http://www.digital-web.com/wp-content/uploads/2014/01/false-2061131__340.png'}
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