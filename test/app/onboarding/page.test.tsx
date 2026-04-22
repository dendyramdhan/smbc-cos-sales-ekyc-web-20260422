import React from 'react';
import { render, screen, fireEvent, act } from '@/utils/test-utils';
import OnboardingPage from '@/app/(onboarding-form)/onboarding/[id]/page';
import { useParams } from 'next/navigation';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock child components to isolate page logic
jest.mock('@/components/onboarding/OnboardingSidebar', () => {
  const MockSidebar = () => {
    const { useOnboardingForm } = jest.requireActual('@/features/onboarding/OnboardingFormContext');
    const { activeStep, isEditing, navigateToStep } = useOnboardingForm();
    return (
      <div data-testid="sidebar" data-active-step={activeStep} data-editing={String(isEditing)}>
        <button onClick={() => {
          window.location.hash = 'ownership';
          navigateToStep('ownership');
        }}>Go Ownership</button>
      </div>
    );
  };
  MockSidebar.displayName = 'MockOnboardingSidebar';
  return {
    __esModule: true,
    default: MockSidebar,
    ONBOARDING_STEPS: [
      { id: 'customer-info', label: 'Customer Info', icon: () => null },
      { id: 'ownership', label: 'Ownership', icon: () => null },
      { id: 'management-ubo', label: 'Management & UBO', icon: () => null },
    ],
  };
});

jest.mock('@/components/onboarding/steps', () => ({
  CustomerInfoStep: function MockCustomerInfoStep() {
    const { useOnboardingForm } = jest.requireActual('@/features/onboarding/OnboardingFormContext');
    const { isEditing, nextStep } = useOnboardingForm();
    return (
      <div data-testid="customer-info-step" data-editing={String(isEditing)}>
        <button onClick={nextStep}>Next Step</button>
      </div>
    );
  },
}));

jest.mock('@/components/ui/RenderIf', () => {
  const MockRenderElse = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  MockRenderElse.displayName = 'RenderElse';

  const MockRenderIf = ({ when, children }: { when: boolean; children: React.ReactNode }) => {
    const ifChildren: React.ReactNode[] = [];
    const elseChildren: React.ReactNode[] = [];

    React.Children.forEach(children, (child: React.ReactNode) => {
      const el = child as React.ReactElement<{ children: React.ReactNode }> | null;
      if (
        el != null &&
        React.isValidElement(el) &&
        typeof el.type === 'function' &&
        (el.type as { displayName?: string }).displayName === 'RenderElse'
      ) {
        elseChildren.push(el.props.children);
      } else {
        ifChildren.push(child);
      }
    });

    return when ? <>{ifChildren}</> : <>{elseChildren}</>;
  };
  MockRenderIf.displayName = 'MockRenderIf';

  return { __esModule: true, default: MockRenderIf, RenderElse: MockRenderElse };
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
const originalLocation = window.location;

function setupWindowLocation(hash = '') {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { ...originalLocation, hash },
  });
}

describe('OnboardingPage', () => {
  let addEventListenerSpy: jest.SpyInstance;
  let removeEventListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: 'test-id' });
    setupWindowLocation('');
    addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  // ── Snapshot ─────────────────────────────────────────────────────────────

  it('should match snapshot after mount', () => {
    const { container } = render(<OnboardingPage />);
    expect(container).toMatchSnapshot();
  });

  // ── Mount Behavior ───────────────────────────────────────────────────────

  it('should render page content after mount', () => {
    render(<OnboardingPage />);
    expect(screen.getByText('New Onboarding')).toBeInTheDocument();
  });

  it('should register hashchange event listener', () => {
    render(<OnboardingPage />);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'hashchange',
      expect.any(Function),
    );
  });

  it('should remove hashchange listener on unmount', () => {
    const { unmount } = render(<OnboardingPage />);
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'hashchange',
      expect.any(Function),
    );
  });

  // ── Default Active Step ──────────────────────────────────────────────────

  it('should default to customer-info step when no hash', () => {
    render(<OnboardingPage />);
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('data-active-step', 'customer-info');
  });

  it('should render CustomerInfoStep when activeStep is customer-info', () => {
    render(<OnboardingPage />);
    expect(screen.getByTestId('customer-info-step')).toBeInTheDocument();
  });

  // ── Hash Navigation ──────────────────────────────────────────────────────

  it('should update activeStep when hash changes', () => {
    render(<OnboardingPage />);

    // Simulate hash change
    act(() => {
      window.location.hash = '#ownership';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('data-active-step', 'ownership');
  });

  it('should read initial hash on mount', () => {
    setupWindowLocation('#ownership');
    render(<OnboardingPage />);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('data-active-step', 'ownership');
  });

  // ── Edit Toggle ──────────────────────────────────────────────────────────

  it('should show Start Editing button by default', () => {
    render(<OnboardingPage />);
    expect(screen.getByText('Start Editing')).toBeInTheDocument();
  });

  it('should toggle to Stop Editing when edit button is clicked', () => {
    render(<OnboardingPage />);

    fireEvent.click(screen.getByText('Start Editing'));
    expect(screen.getByText('Stop Editing')).toBeInTheDocument();
  });

  it('should toggle back to Start Editing when Stop Editing is clicked', () => {
    render(<OnboardingPage />);

    fireEvent.click(screen.getByText('Start Editing'));
    fireEvent.click(screen.getByText('Stop Editing'));
    expect(screen.getByText('Start Editing')).toBeInTheDocument();
  });

  it('should pass isEditing state to CustomerInfoStep', () => {
    render(<OnboardingPage />);

    const step = screen.getByTestId('customer-info-step');
    expect(step).toHaveAttribute('data-editing', 'false');

    fireEvent.click(screen.getByText('Start Editing'));
    expect(step).toHaveAttribute('data-editing', 'true');
  });

  it('should pass hasStartEdited state to sidebar', () => {
    render(<OnboardingPage />);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('data-editing', 'false');

    fireEvent.click(screen.getByText('Start Editing'));
    expect(sidebar).toHaveAttribute('data-editing', 'true');
  });

  // ── Next Step Navigation ─────────────────────────────────────────────────

  it('should navigate to next step when Next is clicked in CustomerInfoStep', () => {
    render(<OnboardingPage />);

    fireEvent.click(screen.getByText('Next Step'));

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('data-active-step', 'ownership');
  });
});
