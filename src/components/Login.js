import React, { useEffect } from 'react';

const Login = ({ location, history }) => {
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get('code');
  const error = queryParams.get('error');

  useEffect(() => {
    if (!error) {
      fetch('http://localhost:8001/spotify/callback?code=' + code)
        .then(response => response.json())
        .then((data) => {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);

          fetch('http://localhost:8001/api/me', {
            method: 'get',
            mode: 'cors',
            headers: new Headers({
              'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
              'Content-Type': 'application/json',
            }),
          })
            .then(response => response.json())
            .then(data => {
              const image = data.images.length > 0 ? data.images[0].url : '';

              localStorage.setItem('name', data.name);
              localStorage.setItem('image', image);
            })
            .catch(error => console.log('Authorization failed : ' + error.message));

          history.push('/playlists');
        });
    }
  }, [code, error, history]);

  return (
    <div>
      <p>Login Screen</p>
    </div>
  );
}

export default Login;