import React from 'react';
import {Link} from 'react-router-dom'

const Home = (params) => {
  return (
    <div>
      <p>Home Screen</p>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/playlists">Playlists</Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;