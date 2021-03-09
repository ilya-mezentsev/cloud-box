import { bindActionCreators } from 'redux';
import { signIn } from '../../store/session/actions';
import Button from '@material-ui/core/Button';

export function SignIn(props) {
    return (
        <>
            <Button variant="contained" color="primary"
                onClick={() => props.signInAction({ mail: 'some@mail.ru', password: 'some-password' })}
            >
                Try sign in
            </Button>
            {props.error && alert(JSON.stringify(props.error))}
        </>
    )
}

export function mapDispatchToProps() {
    return dispatch => {
        return {
            signInAction: bindActionCreators(signIn, dispatch),
        }
    }
}

export function mapStateToProps() {
    return state => ({
        error: state.error,
    });
}
