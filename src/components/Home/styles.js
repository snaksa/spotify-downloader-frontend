import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    main: {
        width: '90%',
        margin: '30px auto',
        opacity: '0.9'
    },
    headerLogo: {
        width: '100%',
        textAlign: 'center',
        float: 'left'
    },
    logoImage: {
        margin: 10,
        width: '300px',
        [theme.breakpoints.down('md')]: {
            width: '80%'
        },
    },
    inputContainer: {
        width: '400px',
        margin: '0 auto',
    },
    youtubeLogo: {
        width: '100px',
        marginTop: '50px',
        marginBottom: '15px'
    },
    youtubeDownloadButton: {
        width: '100%'
    }
}));

export default useStyles;