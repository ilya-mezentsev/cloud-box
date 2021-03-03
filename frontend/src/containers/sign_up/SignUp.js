import { bindActionCreators } from 'redux';
import { signUp } from '../../store/registration/actions';
import Button from '@material-ui/core/Button';

export function SignUp(props) {
    return (
        <Button variant="contained" color="primary"
            onClick={() => props.signUpAction({ mail: 'some@mail.ru', password: 'some-password' })}
        >
            Try sign up
        </Button>
    )
}

export function mapDispatchToProps() {
    return dispatch => {
        return {
            signUpAction: bindActionCreators(signUp, dispatch),
        }
    }
}
