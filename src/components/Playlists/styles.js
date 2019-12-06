import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    main: {
        width: '90%',
        margin: '30px auto',
        opacity: '0.9'
    },
    header: {
        width: '30%',
        float: 'left'
    },

    headerProfile: {
        width: 'fit-content',
        textAlign: 'center'
    },

    profileImage: {
        margin: '10',
        width: '60px',
        border: '2px solid #67d860',
        borderRadius: '50px'
    },

    headerLogo: {
        width: '40%',
        textAlign: 'center',
        float: 'left'
    },
    playlists: {
        width: '50%',
        float: 'left',
        paddingRight: '10px',
        '& tbody': {
            '& tr': {
                '&:hover': {
                    '& td': {
                        backgroundColor: '#67d860',
                        cursor: 'pointer'
                    }
                },
            }
        }
    },
    tracks: {
        width: '50%',
        float: 'right',
        paddingLeft: '10px',
        borderLeft: '1px solid grey',
        '& tbody': {
            '& tr': {
                '&:hover': {
                    '& td': {
                        backgroundColor: '#67d860'
                    }
                }
            }
        }
    },

    tableRowSelected: {
        '& td': {
            backgroundColor: '#67d860'
        }
    },

    playlistImage: {
        margin: '10',
        width: '60px',
        border: '2px solid #67d860'
    },

    youtubeIcon: {
        width: '50px',
        cursor: 'pointer'
    }
}));

export default useStyles;