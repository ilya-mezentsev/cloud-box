import { bindActionCreators } from 'redux';
import { signIn } from '../../store/session/actions';

export function SignIn(props) {
    return (
        <>
            <button
                onClick={() => props.signInAction({ mail: 'some@mail.ru', password: 'some-password' })}
            >
                Try sign in
            </button>
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
