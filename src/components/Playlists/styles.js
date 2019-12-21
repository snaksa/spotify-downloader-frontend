import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    main: {
        width: '90%',
        margin: '30px auto',
        opacity: '0.9'
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
        },
        [theme.breakpoints.down('md')]: {
            width: '100%',
            float: 'none'
        },
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
        width: '34px',
        cursor: 'pointer'
    }
}));

export default useStyles;