import './App.css';
import { SignIn, SignUp } from './containers';
import { store } from './store';

function App() {
    return (
        <div>
            <SignIn store={store} />
            <SignUp store={store} />
        </div>
    );
}

export default App;
