import React from 'react';

const Home = () => {
  const url = encodeURIComponent(`http://${process.env.REACT_APP_URL}/login`);
  return (
    <div id="home">
      <div className={'logo'}>
        <div>
          <a href={`https://accounts.spotify.com/en/authorize?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&response_type=code&scope=user-read-private%20user-library-read%20user-read-email&redirect_uri=${url}`}>
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;