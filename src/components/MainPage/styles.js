import {makeStyles} from '@material-ui/core/styles'

export const useStyles = makeStyles({
    mainGridTitle: {
        textAlign: 'center', 
        margin: '20px',
    },
    categoriesCardContainer: {
        justifyContent: 'center',
        marginTop: '10px',
        height: '100vh',
        paddingBottom: '200px',
        overflowY: 'scroll'
    },
})