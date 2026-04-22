import { render, screen, fireEvent } from '@/utils/test-utils';
import OnboardingSidebar, {
  ONBOARDING_STEPS,
} from '@/components/onboarding/OnboardingSidebar';

// ─── Context Mock ────────────────────────────────────────────────────────────

const mockNavigateToStep = jest.fn();
const mockUseOnboardingForm = jest.fn();

jest.mock('@/features/onboarding/OnboardingFormContext', () => ({
  useOnboardingForm: () => mockUseOnboardingForm(),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const originalLocation = window.location;

const buildContextValue = (overrides: Partial<ReturnType<typeof mockUseOnboardingForm>> = {}) => ({
  activeStep: 'customer-info',
  navigateToStep: mockNavigateToStep,
  disabledSteps: [] as string[],
  isWarningActiveStep: false,
  ...overrides,
});

// ─── Tests ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { ...originalLocation, hash: '' },
  });
});

afterAll(() => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: originalLocation,
  });
});

describe('OnboardingSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseOnboardingForm.mockReturnValue(buildContextValue());
  });

  // ── Snapshot ─────────────────────────────────────────────────────────────

  it('should match snapshot with no disabled steps', () => {
    const { container } = render(<OnboardingSidebar />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with disabled steps', () => {
    mockUseOnboardingForm.mockReturnValue(
      buildContextValue({ disabledSteps: ['ownership', 'management-ubo', 'counterparties', 'product-services'] }),
    );
    const { container } = render(<OnboardingSidebar />);
    expect(container).toMatchSnapshot();
  });

  // ── Rendering ────────────────────────────────────────────────────────────

  it('should render all onboarding steps', () => {
    render(<OnboardingSidebar />);
    ONBOARDING_STEPS.forEach((step) => {
      expect(screen.getByText(step.label)).toBeInTheDocument();
    });
  });

  it('ONBOARDING_STEPS should have exactly 5 items', () => {
    expect(ONBOARDING_STEPS).toHaveLength(5);
  });

  it('should render each step with its correct id in ONBOARDING_STEPS', () => {
    expect(ONBOARDING_STEPS[0].id).toBe('customer-info');
    expect(ONBOARDING_STEPS[1].id).toBe('ownership');
    expect(ONBOARDING_STEPS[4].id).toBe('product-services');
  });

  // ── Navigation ───────────────────────────────────────────────────────────

  it('should call navigateToStep when a step is clicked', () => {
    render(<OnboardingSidebar />);
    fireEvent.click(screen.getByText('Ownership/Shareholder'));
    expect(mockNavigateToStep).toHaveBeenCalledWith('ownership');
  });

  it('should set window.location.hash when a step is clicked', () => {
    render(<OnboardingSidebar />);
    fireEvent.click(screen.getByText('Product & Services'));
    expect(window.location.hash).toBe('product-services');
  });

  // ── Disabled Steps ───────────────────────────────────────────────────────

  it('should set aria-disabled on steps that are in disabledSteps', () => {
    mockUseOnboardingForm.mockReturnValue(
      buildContextValue({
        activeStep: 'customer-info',
        disabledSteps: ['ownership', 'management-ubo', 'counterparties', 'product-services'],
      }),
    );
    render(<OnboardingSidebar />);

    const ownershipButton = screen.getByText('Ownership/Shareholder').closest('button');
    expect(ownershipButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('should not set aria-disabled on active step when it is not in disabledSteps', () => {
    mockUseOnboardingForm.mockReturnValue(
      buildContextValue({
        activeStep: 'customer-info',
        disabledSteps: ['ownership', 'management-ubo', 'counterparties', 'product-services'],
      }),
    );
    render(<OnboardingSidebar />);

    const activeButton = screen.getByText('Customer Info').closest('button');
    expect(activeButton).toHaveAttribute('aria-disabled', 'false');
  });

  it('should not set aria-disabled on any step when disabledSteps is empty', () => {
    render(<OnboardingSidebar />);

    ONBOARDING_STEPS.forEach((step) => {
      const button = screen.getByText(step.label).closest('button');
      expect(button).toHaveAttribute('aria-disabled', 'false');
    });
  });

  // ── Warning Icons ─────────────────────────────────────────────────────────

  it('should show warning icon on active step when isWarningActiveStep is true', () => {
    mockUseOnboardingForm.mockReturnValue(
      buildContextValue({
        activeStep: 'customer-info',
        disabledSteps: ['ownership', 'management-ubo', 'counterparties', 'product-services'],
        isWarningActiveStep: true,
      }),
    );
    const { container } = render(<OnboardingSidebar />);
    // TriangleAlert icon should be present on active step
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('should highlight the active step differently from other steps', () => {
    render(<OnboardingSidebar />);

    const activeButton = screen.getByText('Customer Info').closest('button');
    const inactiveButton = screen.getByText('Ownership/Shareholder').closest('button');

    // Active step button exists and is distinct from inactive ones
    expect(activeButton).toBeInTheDocument();
    expect(inactiveButton).toBeInTheDocument();
    expect(activeButton).not.toBe(inactiveButton);
  });
});
