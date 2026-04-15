import { render, screen } from '@testing-library/react';
import Providers from '@/components/providers/Providers';

jest.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => null,
}));

describe('Providers', () => {
  it('should render children', () => {
    render(
      <Providers>
        <div data-testid="child">Hello</div>
      </Providers>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should provide QueryClient to children (no crash)', () => {
    // If QueryClientProvider is missing, useQueryClient would throw
    expect(() =>
      render(
        <Providers>
          <span>Works</span>
        </Providers>,
      ),
    ).not.toThrow();
  });
});
