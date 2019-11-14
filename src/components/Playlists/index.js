import React, { useEffect, useState } from 'react';
import { Card, Table, Image } from 'react-bootstrap';
import * as ytdl from 'ytdl-core';
import * as fs from 'fs';
import './styles.css';

const Playlists = () => {

  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [fetchedIds, setFetchedIds] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/me/playlists', {
      method: 'get',
      mode: 'cors',
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'application/json',
      }),
    })
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
    fetch('http://localhost:8080/api/playlists/' + id + '/tracks', {
      method: 'get',
      mode: 'cors',
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(json => {
        const result = json.map((item) => {
          const artists = item.artists.map((artist) => {
            return artist.name;
          });

          return {
            id: item.id,
            name: item.name,
            artists: artists.join(' & ')
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

    fetch('http://localhost:8080/api/youtube/find', {
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({
        songs: names
      }),
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(json => {
        setFetchedIds(json);


        const arr = Object.values(json);
        for (var i = 0; i < arr.length; i++) {
          console.log("https://youtube.com/watch?v=" + arr[i]);
          ytdl("https://youtube.com/watch?v=" + arr[i]).pipe(
            fs.createWriteStream(
              "test" + i + ".mp3"
            )
          );
        }

      })
      .catch(error => console.log('Authorization failed : ' + error.message));
  }

  const downloadTrack = (id, name) => {

    fetch(`http://localhost:9090/track?id=${id}`, {
      method: 'get',
      mode: 'cors',
    })
      .then(response => {
        if (response.status === 200) {
          return response.blob();
        }
      })
      .then(blob => {
        if(!blob) {
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

  return (
    <div className={'main'}>
      <Card bg="dark" text="white">
        <Card.Header>
          <div className={'header'}>
            <div className={'headerProfile'}>
              <Image src={localStorage.getItem('image')} className={'profileImage'} />
              <br />
              {localStorage.getItem('name')}
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
            <Table striped hover variant="dark">
              <thead>
                <tr>
                  <th width={'40%'}>Artist</th>
                  <th width={'40%'}>Title</th>
                  <th width={'20%'}></th>
                  <th>
                    <Image
                      className={'youtubeIcon'}
                      src={'https://www.freepnglogos.com/uploads/youtube-logo-icon-transparent---32.png'}
                      onClick={() => getYoutubeLinks()}
                    />
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

                            <Image
                              className={'youtubeIcon'}
                              src={'https://cdn.pixabay.com/photo/2016/12/18/13/45/download-1915753_960_720.png'}
                              onClick={() => downloadTrack(fetchedIds[track.id], track.artists + ' - ' + track.name)}
                            />
                          </React.Fragment>
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