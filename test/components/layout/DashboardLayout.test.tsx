import DashboardLayout from '@/components/layout/DashboardLayout';
import { render, screen } from '@/utils/test-utils';

describe('DashboardLayout', () => {
  it('renders children', () => {
    render(
      <DashboardLayout>
        <div>test content</div>
      </DashboardLayout>,
    );
    expect(screen.getByText('test content')).toBeInTheDocument();
  });
});
