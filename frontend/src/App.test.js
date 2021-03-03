import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
    render(<App />);
    expect(screen.getByText(/Try sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/Try sign up/i)).toBeInTheDocument();
});
