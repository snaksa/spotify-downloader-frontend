import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles';
import Home from './components/Home/Home';
import Login from './components/Login';
import Playlists from './components/Playlists/Playlists';

const theme = {};

const App = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Router>
          <div>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/playlists" component={Playlists} />
          </div>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;