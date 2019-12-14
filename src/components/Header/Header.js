import React from 'react';
import { Card, Image } from 'react-bootstrap';
import useStyles from './styles';
import spotifyLogo from '../../images/spotifyLogo.png';

const Header = ({ history }) => {
  const classes = useStyles();

  const logout = () => {
    localStorage.setItem('accessToken', null);
    localStorage.setItem('refreshToken', null);
    history.push('/');
  };

  return (
        <Card.Header>
          <div className={classes.header}>
            <div className={classes.headerProfile}>
              <Image src={localStorage.getItem('image')} className={classes.profileImage} />
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

          <div className={classes.headerLogo}>
            <Image className={classes.logoImage} src={spotifyLogo} />
          </div>
        </Card.Header>
  );
};

export default Header;