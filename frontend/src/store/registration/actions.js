import { registerUser } from '../../services/api';

/**
 *
 * @param {string} mail
 * @param {string} password
 * @return {function(): Promise<void>}
 */
export function signUp({mail, password}) {
    return async () => {
        try {
            const registrationResponse = await registerUser({mail, password});

            if (registrationResponse.isOk()) {
                console.log(`Registration performed successfully!`);
            } else {
                console.log(`Error while trying to perform registration: ${JSON.stringify(registrationResponse.data())}`);
            }
        } catch (e) {
            console.error(e);
        }
    }
}
