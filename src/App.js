import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Home from './components/Home/Home';
import Login from './components/Login';
import Playlists from './components/Playlists/Playlists';

const theme = createMuiTheme({
  palette: {
    primary:  {
      main: '#67d860'
    }
  }
});

const App = () => {
  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <Router>
          <div>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/playlists" component={Playlists} />
          </div>
        </Router>
      </MuiThemeProvider>
    </div>
  );
}

export default App;