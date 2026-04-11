import Home from '@/app/page';
import { render, screen } from '@/utils/test-utils';

describe('Home Page Component', () => {
  it('renders the welcome banner correctly', () => {
    render(<Home />);

    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Good Morning')).toBeInTheDocument();
  });
});
