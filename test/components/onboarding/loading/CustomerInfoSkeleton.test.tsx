import { render } from '@/utils/test-utils';
import { CustomerInfoSkeleton } from '@/components/onboarding/loading';

describe('CustomerInfoSkeleton', () => {
  it('should match snapshot', () => {
    const { container } = render(<CustomerInfoSkeleton />);
    expect(container).toMatchSnapshot();
  });

  it('should render without errors', () => {
    expect(() => render(<CustomerInfoSkeleton />)).not.toThrow();
  });
});
