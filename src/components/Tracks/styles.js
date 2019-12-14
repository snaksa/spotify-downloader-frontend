import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
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
        },
        [theme.breakpoints.down('md')]: {
            width: '100%',
            marginTop: '30px',
            float: 'none'
        },
    },
    youtubeIcon: {
        width: '34px',
        cursor: 'pointer'
    }
}));

export default useStyles;