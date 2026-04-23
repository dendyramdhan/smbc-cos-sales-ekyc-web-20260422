import { render, act } from '@/utils/test-utils';
import {
  OnboardingFormProvider,
  useOnboardingForm,
} from '@/features/onboarding/OnboardingFormContext';
import { ONBOARDING_STEPS } from '@/components/onboarding/OnboardingSidebar';
import type { CustomerInfoData } from '@/types/onboarding';

// ─── Helpers ─────────────────────────────────────────────────────────────────

type ContextValue = ReturnType<typeof useOnboardingForm>;

const createContextCapture = () => {
  let captured: ContextValue;

  const Capture = () => {
    captured = useOnboardingForm();
    return null;
  };

  const get = () => captured;
  return { Capture, get };
};

const renderProvider = (
  ui?: React.ReactElement,
  props: { initialStep?: string } = {},
) => {
  const { Capture, get } = createContextCapture();
  render(
    <OnboardingFormProvider {...props}>
      <Capture />
      {ui}
    </OnboardingFormProvider>,
  );
  return get;
};

const STEP_IDS = ONBOARDING_STEPS.map((s) => s.id);
const FIRST_STEP = STEP_IDS[0]; // 'customer-info'
const SECOND_STEP = STEP_IDS[1]; // 'ownership'
const LAST_STEP = STEP_IDS[STEP_IDS.length - 1]; // 'product-services'
const OTHER_STEPS = STEP_IDS.slice(1); // all except first

const MOCK_CUSTOMER_INFO = { customerName: 'Test Corp' } as CustomerInfoData;

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('OnboardingFormContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.location.hash = '';
  });

  // ── Provider Mounting ────────────────────────────────────────────────────

  it('should set mounted to true on mount', () => {
    const get = renderProvider();
    expect(get().mounted).toBe(true);
  });

  it('should set default initialStep to customer-info', () => {
    const get = renderProvider();
    expect(get().activeStep).toBe(FIRST_STEP);
  });

  it('should respect initialStep prop when hash matches it', () => {
    window.location.hash = `#${SECOND_STEP}`;
    const get = renderProvider(undefined, { initialStep: SECOND_STEP });
    expect(get().activeStep).toBe(SECOND_STEP);
  });

  // ── Hash-based Step Resolution ────────────────────────────────────────────

  it('should set activeStep from window.location.hash on mount', () => {
    window.location.hash = `#${SECOND_STEP}`;
    const get = renderProvider();
    expect(get().activeStep).toBe(SECOND_STEP);
  });

  it('should fall back to customer-info when hash is empty', () => {
    window.location.hash = '';
    const get = renderProvider();
    expect(get().activeStep).toBe(FIRST_STEP);
  });

  it('should update activeStep when hashchange event fires', () => {
    const get = renderProvider();

    act(() => {
      window.location.hash = `#${LAST_STEP}`;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(get().activeStep).toBe(LAST_STEP);
  });

  it('should remove hashchange listener on unmount', () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(
      <OnboardingFormProvider>
        <></>
      </OnboardingFormProvider>,
    );

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('hashchange', expect.any(Function));
    removeSpy.mockRestore();
  });

  // ── Initial State ────────────────────────────────────────────────────────

  it('should have correct initial state values', () => {
    const get = renderProvider();
    const ctx = get();
    expect(ctx.isEditing).toBe(false);
    expect(ctx.disabledSteps).toEqual([]);
    expect(ctx.isWarningActiveStep).toBe(false);
    expect(ctx.isAllStepsDisabled).toBe(false);
    expect(ctx.formData.customerInfo).toBeNull();
  });

  // ── navigateToStep ────────────────────────────────────────────────────────

  it('should update activeStep when navigateToStep is called', () => {
    const get = renderProvider();

    act(() => {
      get().navigateToStep(SECOND_STEP);
    });

    expect(get().activeStep).toBe(SECOND_STEP);
  });

  // ── nextStep ─────────────────────────────────────────────────────────────

  it('should advance to the next step when nextStep is called', () => {
    const get = renderProvider();

    act(() => {
      get().nextStep();
    });

    expect(get().activeStep).toBe(SECOND_STEP);
    expect(window.location.hash).toBe(`#${SECOND_STEP}`);
  });

  it('should not advance past the last step', () => {
    window.location.hash = `#${LAST_STEP}`;
    const get = renderProvider(undefined, { initialStep: LAST_STEP });

    act(() => {
      get().nextStep();
    });

    expect(get().activeStep).toBe(LAST_STEP);
  });

  // ── setIsEditing / toggleEditing ─────────────────────────────────────────

  it('should set isEditing to true via setIsEditing(true)', () => {
    const get = renderProvider();

    act(() => {
      get().setIsEditing(true);
    });

    expect(get().isEditing).toBe(true);
  });

  it('should set isEditing to false via setIsEditing(false)', () => {
    const get = renderProvider();

    act(() => {
      get().setIsEditing(true);
    });
    act(() => {
      get().setIsEditing(false);
    });

    expect(get().isEditing).toBe(false);
  });

  it('should toggle isEditing via toggleEditing', () => {
    const get = renderProvider();

    act(() => {
      get().toggleEditing();
    });
    expect(get().isEditing).toBe(true);

    act(() => {
      get().toggleEditing();
    });
    expect(get().isEditing).toBe(false);
  });

  // ── setDisabledSteps ─────────────────────────────────────────────────────

  it('should update disabledSteps via setDisabledSteps', () => {
    const get = renderProvider();

    act(() => {
      get().setDisabledSteps([SECOND_STEP, LAST_STEP]);
    });

    expect(get().disabledSteps).toEqual([SECOND_STEP, LAST_STEP]);
  });

  it('should clear disabledSteps when an empty array is passed', () => {
    const get = renderProvider();

    act(() => {
      get().setDisabledSteps([SECOND_STEP]);
    });
    act(() => {
      get().setDisabledSteps([]);
    });

    expect(get().disabledSteps).toEqual([]);
  });

  // ── isAllStepsDisabled ────────────────────────────────────────────────────

  it('should set isAllStepsDisabled to true when all non-active steps are disabled', () => {
    const get = renderProvider();

    act(() => {
      get().setDisabledSteps(OTHER_STEPS);
    });

    expect(get().isAllStepsDisabled).toBe(true);
  });

  it('should set isAllStepsDisabled to false when some non-active steps remain enabled', () => {
    const get = renderProvider();

    act(() => {
      get().setDisabledSteps([SECOND_STEP]);
    });

    expect(get().isAllStepsDisabled).toBe(false);
  });

  it('should set isAllStepsDisabled to false when disabledSteps is empty', () => {
    const get = renderProvider();
    expect(get().isAllStepsDisabled).toBe(false);
  });

  // ── setIsWarningActiveStep ────────────────────────────────────────────────

  it('should update isWarningActiveStep via setIsWarningActiveStep', () => {
    const get = renderProvider();

    act(() => {
      get().setIsWarningActiveStep(true);
    });
    expect(get().isWarningActiveStep).toBe(true);

    act(() => {
      get().setIsWarningActiveStep(false);
    });
    expect(get().isWarningActiveStep).toBe(false);
  });

  // ── updateCustomerInfo ────────────────────────────────────────────────────

  it('should update formData.customerInfo via updateCustomerInfo', () => {
    const get = renderProvider();

    act(() => {
      get().updateCustomerInfo(MOCK_CUSTOMER_INFO);
    });

    expect(get().formData.customerInfo).toEqual(MOCK_CUSTOMER_INFO);
  });

  // ── useOnboardingForm guard ───────────────────────────────────────────────

  it('should throw when useOnboardingForm is used outside the provider', () => {
    const BrokenConsumer = () => {
      useOnboardingForm();
      return null;
    };

    const originalError = console.error;
    console.error = jest.fn();

    expect(() => render(<BrokenConsumer />)).toThrow(
      'useOnboardingForm must be used within <OnboardingFormProvider>',
    );

    console.error = originalError;
  });
});
