import { render, screen, fireEvent, act } from '@/utils/test-utils';
import CustomerInfoStep from '@/components/onboarding/steps/CustomerInfoStep';
import { CUSTOMER_INFO_MOCK_DATA } from '@/services/__mocks__/customerInfo.onboarding';
import {
  CUSTOMER_TYPE_MOCK_DATA,
  LEGAL_ENTITY_TYPE_MOCK_DATA,
  LEGAL_ENTITY_CHARACTERISTIC_MOCK_DATA,
  LINE_OF_BUSINESS_MOCK_DATA,
  COUNTRY_MOCK_DATA,
  GENERAL_CHECKING_MOCK_DATA,
} from '@/services/__mocks__/ekycParameter.onboarding';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockUseOnboarding = jest.fn();
jest.mock('@/hooks/queries', () => ({
  useOnboarding: (...args: unknown[]) => mockUseOnboarding(...args),
}));

const mockUseCustomerInfoOptions = jest.fn();
jest.mock('@/hooks/queries/useEKYCParameterQueries', () => ({
  useCustomerInfoOptions: () => mockUseCustomerInfoOptions(),
}));

const mockNextStep = jest.fn();
const mockSetIsEditing = jest.fn();
const mockSetDisabledSteps = jest.fn();
const mockSetIsWarningActiveStep = jest.fn();
const mockUpdateCustomerInfo = jest.fn();
const mockUseOnboardingForm = jest.fn();

jest.mock('@/features/onboarding/OnboardingFormContext', () => ({
  useOnboardingForm: () => mockUseOnboardingForm(),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const defaultOnboardingResult = {
  data: { data: { ...CUSTOMER_INFO_MOCK_DATA }, message: 'SUCCESS', status: 0 },
  isLoading: false,
  isSuccess: true,
};

const defaultOptionsResult = {
  customerTypeOptions: CUSTOMER_TYPE_MOCK_DATA,
  legalEntityTypeOptions: LEGAL_ENTITY_TYPE_MOCK_DATA,
  legalEntityCharacteristicOptions: LEGAL_ENTITY_CHARACTERISTIC_MOCK_DATA,
  lineOfBusinessOptions: LINE_OF_BUSINESS_MOCK_DATA,
  countryOptions: COUNTRY_MOCK_DATA,
  generalCheckingOptions: GENERAL_CHECKING_MOCK_DATA,
  isLoading: false,
};

const buildContextValue = (overrides = {}) => ({
  isEditing: false,
  nextStep: mockNextStep,
  setIsEditing: mockSetIsEditing,
  setDisabledSteps: mockSetDisabledSteps,
  setIsWarningActiveStep: mockSetIsWarningActiveStep,
  updateCustomerInfo: mockUpdateCustomerInfo,
  isAllStepsDisabled: false,
  ...overrides,
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('CustomerInfoStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockUseOnboarding.mockReturnValue(defaultOnboardingResult);
    mockUseCustomerInfoOptions.mockReturnValue(defaultOptionsResult);
    mockUseOnboardingForm.mockReturnValue(buildContextValue());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ── Snapshot ─────────────────────────────────────────────────────────────

  it('should match snapshot in read-only mode', () => {
    const { container } = render(<CustomerInfoStep />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in editing mode', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    const { container } = render(<CustomerInfoStep />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when loading', () => {
    mockUseOnboarding.mockReturnValue({ ...defaultOnboardingResult, isLoading: true });
    const { container } = render(<CustomerInfoStep />);
    expect(container).toMatchSnapshot();
  });

  // ── Loading ──────────────────────────────────────────────────────────────

  it('should show skeleton when loading', () => {
    mockUseOnboarding.mockReturnValue({
      ...defaultOnboardingResult,
      data: undefined,
      isLoading: true,
    });

    const { container } = render(<CustomerInfoStep />);
    // Skeleton renders Skeleton components
    expect(container.querySelector('[data-testid]') || container.innerHTML).toBeTruthy();
    expect(screen.queryByText('Basic Information')).not.toBeInTheDocument();
  });

  // ── Field Rendering ──────────────────────────────────────────────────────

  it('should render customer info fields from mock data', () => {
    render(<CustomerInfoStep />);

    expect(screen.getByDisplayValue('SUZUKI MOTOR CORPORATION')).toBeInTheDocument();
    expect(screen.getByDisplayValue('CAP-2024-001')).toBeInTheDocument();
    expect(screen.getByDisplayValue('CIF12345678')).toBeInTheDocument();
    expect(screen.getByDisplayValue('BES-998877')).toBeInTheDocument();
  });

  it('should render section headings', () => {
    render(<CustomerInfoStep />);

    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Previous Checklist')).toBeInTheDocument();
  });

  it('should render general checking options', () => {
    render(<CustomerInfoStep />);

    GENERAL_CHECKING_MOCK_DATA.forEach((opt) => {
      expect(screen.getByText(new RegExp(opt.key + '\\)'))).toBeInTheDocument();
    });
  });

  // ── Editing Legend ────────────────────────────────────────────────────────

  it('should show editing legend when isEditing is true in context', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(<CustomerInfoStep />);
    expect(screen.getByText('Editable by Maker')).toBeInTheDocument();
    expect(screen.getByText('System-managed / read-only')).toBeInTheDocument();
  });

  // ── Checkbox Logic ───────────────────────────────────────────────────────

  it('should show "Please select at least 1 option" when editing with no selection', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(<CustomerInfoStep />);
    expect(
      screen.getByText('Please select at least 1 option.'),
    ).toBeInTheDocument();
  });

  it('should show prohibited warning when a-e option is checked', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(<CustomerInfoStep />);

    const checkboxes = screen.getAllByRole('checkbox');
    act(() => {
      fireEvent.click(checkboxes[0]);
      jest.runAllTimers();
    });

    expect(
      screen.getByText(/NO ACCOUNT SHOULD BE OPENED/),
    ).toBeInTheDocument();
  });

  it('should show continue message when "None of the above" (f) is checked', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(<CustomerInfoStep />);

    const checkboxes = screen.getAllByRole('checkbox');
    act(() => {
      fireEvent.click(checkboxes[checkboxes.length - 1]);
      jest.runAllTimers();
    });

    expect(
      screen.getByText(/CONTINUE with the remaining questions/),
    ).toBeInTheDocument();
  });

  it('should deselect "f" when any a-e is checked', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(<CustomerInfoStep />);

    const checkboxes = screen.getAllByRole('checkbox');

    // Select f first
    act(() => {
      fireEvent.click(checkboxes[checkboxes.length - 1]);
      jest.runAllTimers();
    });
    expect(
      screen.getByText(/CONTINUE with the remaining questions/),
    ).toBeInTheDocument();

    // Now select a → f should be deselected
    act(() => {
      fireEvent.click(checkboxes[0]);
      jest.runAllTimers();
    });
    expect(
      screen.queryByText(/CONTINUE with the remaining questions/),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/NO ACCOUNT SHOULD BE OPENED/),
    ).toBeInTheDocument();
  });

  it('should deselect a-e when "f" is checked', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(<CustomerInfoStep />);

    const checkboxes = screen.getAllByRole('checkbox');

    // Select a first
    act(() => {
      fireEvent.click(checkboxes[0]);
      jest.runAllTimers();
    });
    expect(
      screen.getByText(/NO ACCOUNT SHOULD BE OPENED/),
    ).toBeInTheDocument();

    // Now select f → a should be deselected
    act(() => {
      fireEvent.click(checkboxes[checkboxes.length - 1]);
      jest.runAllTimers();
    });
    expect(
      screen.queryByText(/NO ACCOUNT SHOULD BE OPENED/),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/CONTINUE with the remaining questions/),
    ).toBeInTheDocument();
  });

  // ── Next Disabled Logic ──────────────────────────────────────────────────

  it('should disable Next when editing with no checkbox selection', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(<CustomerInfoStep />);
    expect(screen.getByText('Next').closest('button')).toBeDisabled();
  });

  it('should disable Next when editing with prohibited selection (a-e)', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(<CustomerInfoStep />);

    const checkboxes = screen.getAllByRole('checkbox');
    act(() => {
      fireEvent.click(checkboxes[0]);
      jest.runAllTimers();
    });

    expect(screen.getByText('Next').closest('button')).toBeDisabled();
  });

  it('should enable Next when editing with "None of above" (f) selected', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(<CustomerInfoStep />);

    const checkboxes = screen.getAllByRole('checkbox');
    act(() => {
      fireEvent.click(checkboxes[checkboxes.length - 1]);
      jest.runAllTimers();
    });

    expect(screen.getByText('Next').closest('button')).not.toBeDisabled();
  });

  it('should enable Next in non-editing mode regardless of checkbox state', () => {
    render(<CustomerInfoStep />);
    expect(screen.getByText('Next').closest('button')).not.toBeDisabled();
  });

  // ── Action Callbacks ─────────────────────────────────────────────────────

  it('should call nextStep from context when Next button is clicked', () => {
    render(<CustomerInfoStep />);
    fireEvent.click(screen.getByText('Next'));
    expect(mockNextStep).toHaveBeenCalledTimes(1);
  });

  it('should show loading spinner on Save and Continue Edit after clicking', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(<CustomerInfoStep />);

    act(() => {
      fireEvent.click(screen.getByText('Save and Continue Edit'));
    });

    // After clicking, hasSaveAndContinueLoading=true disables both save buttons.
    // The "Save and Continue Edit" text is replaced by a Spinner; verify via the other save button.
    expect(screen.getByText('Save and End Edit').closest('button')).toBeDisabled();
  });

  it('should call setIsEditing(false) after Save and End Edit timer completes', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(<CustomerInfoStep />);

    act(() => {
      fireEvent.click(screen.getByText('Save and End Edit'));
      jest.advanceTimersByTime(2000);
    });

    expect(mockSetIsEditing).toHaveBeenCalledWith(false);
  });

  // ── Context Integration ──────────────────────────────────────────────────

  it('should call updateCustomerInfo when a field is updated', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(<CustomerInfoStep />);

    const customerNameInput = screen.getByDisplayValue('SUZUKI MOTOR CORPORATION');
    act(() => {
      fireEvent.change(customerNameInput, { target: { value: 'UPDATED NAME' } });
      fireEvent.blur(customerNameInput);
      jest.runAllTimers();
    });

    expect(mockUpdateCustomerInfo).toHaveBeenLastCalledWith(
      expect.objectContaining({ customerName: 'UPDATED NAME' }),
    );
  });

  it('should call setDisabledSteps when no checkbox is selected', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(<CustomerInfoStep />);

    // Initially no selection → all other steps should be disabled
    expect(mockSetDisabledSteps).toHaveBeenCalled();
  });

  // ── Select Fields ────────────────────────────────────────────────────────

  it('should render select dropdowns when editing', () => {
    mockUseOnboardingForm.mockReturnValue(buildContextValue({ isEditing: true }));
    render(<CustomerInfoStep />);

    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);
  });
});
