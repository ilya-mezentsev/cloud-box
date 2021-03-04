import { connect } from 'react-redux';

import {
    SignIn as SignInContainer,
    mapDispatchToProps as SignInMapDispatchToProps,
    mapStateToProps as SignInMapStateToProps,
} from './sign_in/SignIn';

import {
    SignUp as SignUpContainer,
    mapDispatchToProps as SignUpMapDispatchToProps,
} from './sign_up/SignUp';

export const SignIn = connect(SignInMapStateToProps(), SignInMapDispatchToProps())(SignInContainer);
export const SignUp = connect(null, SignUpMapDispatchToProps())(SignUpContainer);
