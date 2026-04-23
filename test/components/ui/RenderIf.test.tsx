import React from 'react';
import { render, screen } from '@testing-library/react';
import RenderIf, { RenderElse } from '@/components/ui/RenderIf';

describe('RenderIf', () => {
  it('should match snapshot when condition is true', () => {
    const { container } = render(
      <RenderIf when={true}>
        <span>Visible</span>
      </RenderIf>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when condition is false with RenderElse', () => {
    const { container } = render(
      <RenderIf when={false}>
        <span>Main</span>
        <RenderElse>
          <span>Fallback</span>
        </RenderElse>
      </RenderIf>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render children when condition is true', () => {
    render(
      <RenderIf when={true}>
        <span>Visible Content</span>
      </RenderIf>,
    );
    expect(screen.getByText('Visible Content')).toBeInTheDocument();
  });

  it('should not render children when condition is false', () => {
    render(
      <RenderIf when={false}>
        <span>Hidden Content</span>
      </RenderIf>,
    );
    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });

  it('should render RenderElse content when condition is false', () => {
    render(
      <RenderIf when={false}>
        <span>Main</span>
        <RenderElse>
          <span>Else Content</span>
        </RenderElse>
      </RenderIf>,
    );
    expect(screen.queryByText('Main')).not.toBeInTheDocument();
    expect(screen.getByText('Else Content')).toBeInTheDocument();
  });

  it('should not render RenderElse content when condition is true', () => {
    render(
      <RenderIf when={true}>
        <span>Main</span>
        <RenderElse>
          <span>Else Content</span>
        </RenderElse>
      </RenderIf>,
    );
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.queryByText('Else Content')).not.toBeInTheDocument();
  });

  it('should return null when children is null/undefined', () => {
    const { container } = render(
      <RenderIf when={true}>{null as unknown as React.ReactNode}</RenderIf>,
    );
    expect(container.innerHTML).toBe('');
  });

  it('should return null when condition is false and no RenderElse', () => {
    const { container } = render(
      <RenderIf when={false}>
        <span>Only main</span>
      </RenderIf>,
    );
    expect(container.innerHTML).toBe('');
  });

  it('should render multiple children when condition is true', () => {
    render(
      <RenderIf when={true}>
        <span>First</span>
        <span>Second</span>
      </RenderIf>,
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});

describe('RenderElse', () => {
  it('should have displayName set to RenderElse', () => {
    expect(RenderElse.displayName).toBe('RenderElse');
  });
});
