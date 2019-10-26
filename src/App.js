import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Home from './components/Home';
import Login from './components/Login';
import Playlists from './components/Playlists';

const App = () => {
    return (
      <div>
        <Router>
          <div>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/playlists" component={Playlists} />
          </div>
        </Router>
      </div>
    );
}

export default App;