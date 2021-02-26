import { bindActionCreators } from 'redux';
import { signUp } from '../../store/registration/actions';

export function SignUp(props) {
    return (
        <button
            onClick={() => props.signUpAction({ mail: 'some@mail.ru', password: 'some-password' })}
        >
            Try sign up
        </button>
    )
}

export function mapDispatchToProps() {
    return dispatch => {
        return {
            signUpAction: bindActionCreators(signUp, dispatch),
        }
    }
}
