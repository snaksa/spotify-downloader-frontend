import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
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
        float: 'left',
        [theme.breakpoints.down('md')]: {
            width: '100px',
            marginTop: '30px'
        },
    },
    logoImage: {
        margin: 10,
        width: '200px',
        [theme.breakpoints.down('md')]: {
            width: '100%'
        },
    }
}));

export default useStyles;