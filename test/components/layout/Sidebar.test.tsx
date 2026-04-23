import Sidebar from '@/components/layout/Sidebar';
import { SIDEBAR_MENU_ITEMS } from '@/constants';
import { render, screen } from '@/utils/test-utils';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Sidebar Component', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReset();
  });

  it('renders the basic sidebar structure and static text', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<Sidebar />);

    expect(screen.getByText('MANAGEMENT SYSTEM')).toBeInTheDocument();
    expect(screen.getByText('System Online')).toBeInTheDocument();
  });

  it('renders all menu items with correct labels and href attributes', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<Sidebar />);

    SIDEBAR_MENU_ITEMS.forEach((item) => {
      const link = screen.getByText(item.label).closest('a');

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', item.href);
    });
  });

  it('renders the correct number of menu items', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<Sidebar />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(SIDEBAR_MENU_ITEMS.length);
  });

  it('handles rendering when on a specific route', () => {
    const targetItem = SIDEBAR_MENU_ITEMS.find((item) => item.href !== '/');
    const mockPath = targetItem?.href ?? '/';

    (usePathname as jest.Mock).mockReturnValue(mockPath);

    render(<Sidebar />);

    SIDEBAR_MENU_ITEMS.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('applies active state when pathname matches the item href', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<Sidebar />);
    const link = screen.getByText('HOME').closest('a');
    expect(link).toBeInTheDocument();
  });

  it('applies inactive state when pathname does not match the item href', () => {
    (usePathname as jest.Mock).mockReturnValue('/some-other-route');
    render(<Sidebar />);
    const link = screen.getByText('HOME').closest('a');
    expect(link).toBeInTheDocument();
  });
});
