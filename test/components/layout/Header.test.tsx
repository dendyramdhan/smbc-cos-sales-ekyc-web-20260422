import Header from '@/components/layout/Header';
import { render, screen } from '@/utils/test-utils';

describe('Header', () => {
  it('renders user profile', () => {
    render(<Header />);
    expect(screen.getByText('User Profile')).toBeInTheDocument();
  });
});
