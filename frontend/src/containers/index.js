import { connect } from 'react-redux';

import {
    SignIn as SignInContainer,
    mapDispatchToProps as SignInMapDispatchToProps,
} from './sign_in/SignIn';

import {
    SignUp as SignUpContainer,
    mapDispatchToProps as SignUpMapDispatchToProps,
} from './sign_up/SignUp';

export const SignIn = connect(null, SignInMapDispatchToProps())(SignInContainer);
export const SignUp = connect(null, SignUpMapDispatchToProps())(SignUpContainer);
