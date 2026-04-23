import { render, screen, fireEvent } from '@/utils/test-utils';
import OnboardingFormAction from '@/components/onboarding/OnboardingFormAction';

// ─── Context Mock ────────────────────────────────────────────────────────────

const mockNextStep = jest.fn();
const mockUseOnboardingForm = jest.fn();

jest.mock('@/features/onboarding/OnboardingFormContext', () => ({
  useOnboardingForm: () => mockUseOnboardingForm(),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const buildContextValue = (overrides = {}) => ({
  isEditing: false,
  nextStep: mockNextStep,
  isAllStepsDisabled: false,
  ...overrides,
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('OnboardingFormAction', () => {
  const defaultProps = {
    onSaveAndContinue: jest.fn(),
    onSaveAndEnd: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseOnboardingForm.mockReturnValue(buildContextValue());
  });

  // ── Snapshot ─────────────────────────────────────────────────────────────

  it('should match snapshot in non-editing mode', () => {
    const { container } = render(<OnboardingFormAction {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in editing mode', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    const { container } = render(<OnboardingFormAction {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  // ── Next Button ──────────────────────────────────────────────────────────

  it('should always render the Next button', () => {
    render(<OnboardingFormAction {...defaultProps} />);
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should call nextStep from context when Next button is clicked', () => {
    render(<OnboardingFormAction {...defaultProps} />);
    fireEvent.click(screen.getByText('Next'));
    expect(mockNextStep).toHaveBeenCalledTimes(1);
  });

  it('should disable Next when hasNextDisabled prop is true', () => {
    render(<OnboardingFormAction {...defaultProps} hasNextDisabled={true} />);
    expect(screen.getByText('Next').closest('button')).toBeDisabled();
  });

  it('should disable Next when isAllStepsDisabled is true in context', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isAllStepsDisabled: true }));
    render(<OnboardingFormAction {...defaultProps} />);
    expect(screen.getByText('Next').closest('button')).toBeDisabled();
  });

  it('should not disable Next when neither hasNextDisabled nor isAllStepsDisabled', () => {
    render(<OnboardingFormAction {...defaultProps} />);
    expect(screen.getByText('Next').closest('button')).not.toBeDisabled();
  });

  // ── Save Buttons ──────────────────────────────────────────────────────────

  it('should show Save buttons only when isEditing is true', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(<OnboardingFormAction {...defaultProps} />);
    expect(screen.getByText('Save and Continue Edit')).toBeInTheDocument();
    expect(screen.getByText('Save and End Edit')).toBeInTheDocument();
  });

  it('should not show Save buttons when isEditing is false', () => {
    render(<OnboardingFormAction {...defaultProps} />);
    expect(screen.queryByText('Save and Continue Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Save and End Edit')).not.toBeInTheDocument();
  });

  it('should call onSaveAndContinue when Save and Continue Edit is clicked', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(<OnboardingFormAction {...defaultProps} />);
    fireEvent.click(screen.getByText('Save and Continue Edit'));
    expect(defaultProps.onSaveAndContinue).toHaveBeenCalledTimes(1);
  });

  it('should call onSaveAndEnd when Save and End Edit is clicked', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(<OnboardingFormAction {...defaultProps} />);
    fireEvent.click(screen.getByText('Save and End Edit'));
    expect(defaultProps.onSaveAndEnd).toHaveBeenCalledTimes(1);
  });

  // ── Save Buttons Loading State ────────────────────────────────────────────

  it('should disable Save buttons when hasSaveAndContinueLoading is true', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(
      <OnboardingFormAction {...defaultProps} hasSaveAndContinueLoading={true} />,
    );
    // hasSaveAndContinueLoading replaces "Save and Continue Edit" text with a Spinner,
    // but both save buttons are still disabled via disabled={hasSaveAndContinueLoading || hasSaveAndEndLoading}
    expect(screen.getByText('Save and End Edit').closest('button')).toBeDisabled();
  });

  it('should disable Save buttons when hasSaveAndEndLoading is true', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(
      <OnboardingFormAction {...defaultProps} hasSaveAndEndLoading={true} />,
    );
    // hasSaveAndEndLoading replaces "Save and End Edit" text with a Spinner,
    // but both save buttons are still disabled via disabled={hasSaveAndContinueLoading || hasSaveAndEndLoading}
    expect(screen.getByText('Save and Continue Edit').closest('button')).toBeDisabled();
  });
});
