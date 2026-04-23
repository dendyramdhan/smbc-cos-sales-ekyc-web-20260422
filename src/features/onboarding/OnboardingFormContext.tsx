'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';
import type { CustomerInfoData, ManagementUboMember } from '@/types/onboarding';
import { ONBOARDING_STEPS, OnboardingStepId } from '@/components/onboarding/OnboardingSidebar';

// ---------------------------------------------------------------------------
// Form data — typed per step. Add new step keys here as the form grows.
// ---------------------------------------------------------------------------
interface OnboardingFormData {
  customerInfo: CustomerInfoData | null;
  managementUbo: ManagementUboMember[] | null;
}

// ---------------------------------------------------------------------------
// Reducer — consolidates all related state into a single, predictable unit
// ---------------------------------------------------------------------------
interface FormState {
  mounted: boolean;
  activeStep: string;
  isEditing: boolean;
  formData: OnboardingFormData;
  disabledSteps: OnboardingStepId[];
  isWarningActiveStep: boolean;
}

type FormAction =
  | { type: 'MOUNT' }
  | { type: 'SET_STEP'; payload: string }
  | { type: 'TOGGLE_EDITING' }
  | { type: 'SET_EDITING'; payload: boolean }
  | { type: 'SET_DISABLED_STEPS'; payload: OnboardingStepId[] }
  | { type: 'SET_WARNING'; payload: boolean }
  | { type: 'UPDATE_CUSTOMER_INFO'; payload: CustomerInfoData }
  | { type: 'UPDATE_MANAGEMENT_UBO'; payload: ManagementUboMember[] };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'MOUNT':
      return { ...state, mounted: true };
    case 'SET_STEP':
      return { ...state, activeStep: action.payload };
    case 'TOGGLE_EDITING':
      return { ...state, isEditing: !state.isEditing };
    case 'SET_EDITING':
      return { ...state, isEditing: action.payload };
    case 'SET_DISABLED_STEPS':
      return { ...state, disabledSteps: action.payload };
    case 'SET_WARNING':
      return { ...state, isWarningActiveStep: action.payload };
    case 'UPDATE_CUSTOMER_INFO':
      return { ...state, formData: { ...state.formData, customerInfo: action.payload } };
    case 'UPDATE_MANAGEMENT_UBO':
      return { ...state, formData: { ...state.formData, managementUbo: action.payload } };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context value shape
// ---------------------------------------------------------------------------
interface OnboardingFormContextValue {
  // State
  mounted: boolean;
  activeStep: string;
  isEditing: boolean;
  formData: OnboardingFormData;
  disabledSteps: OnboardingStepId[];
  isAllStepsDisabled: boolean;
  isWarningActiveStep: boolean;
  // Navigation
  navigateToStep: (stepId: string) => void;
  nextStep: () => void;
  // Edit mode
  setIsEditing: (editing: boolean) => void;
  toggleEditing: () => void;
  // Step guards
  setDisabledSteps: (steps: OnboardingStepId[]) => void;
  setIsWarningActiveStep: (active: boolean) => void;
  // Form data
  updateCustomerInfo: (data: CustomerInfoData) => void;
  updateManagementUbo: (members: ManagementUboMember[]) => void;
}

// ---------------------------------------------------------------------------
// Context — typed, null-initialised so the guard hook can catch misuse
// ---------------------------------------------------------------------------
const OnboardingFormContext = createContext<OnboardingFormContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
interface OnboardingFormProviderProps {
  children: ReactNode;
  initialStep?: string;
}

const buildInitialState = (initialStep: string): FormState => ({
  mounted: false,
  activeStep: initialStep,
  isEditing: false,
  formData: { customerInfo: null, managementUbo: null },
  disabledSteps: [],
  isWarningActiveStep: false,
});

export const OnboardingFormProvider = ({
  children,
  initialStep = 'customer-info',
}: OnboardingFormProviderProps) => {
  const [state, dispatch] = useReducer(formReducer, buildInitialState(initialStep));

  // Listen to hash changes
  useEffect(() => {
    dispatch({ type: 'MOUNT' });
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'customer-info';
      dispatch({ type: 'SET_STEP', payload: hash });
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToStep = useCallback((stepId: string) => {
    dispatch({ type: 'SET_STEP', payload: stepId });
  }, []);

  const nextStep = useCallback(() => {
    const currentIndex = ONBOARDING_STEPS.findIndex((s) => s.id === state.activeStep);
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      const next = ONBOARDING_STEPS[currentIndex + 1];
      window.location.hash = next.id;
      dispatch({ type: 'SET_STEP', payload: next.id });
    }
  }, [state.activeStep]);

  const setIsEditing = useCallback((editing: boolean) => {
    dispatch({ type: 'SET_EDITING', payload: editing });
  }, []);

  const toggleEditing = useCallback(() => {
    dispatch({ type: 'TOGGLE_EDITING' });
  }, []);

  const setDisabledSteps = useCallback((steps: OnboardingStepId[]) => {
    dispatch({ type: 'SET_DISABLED_STEPS', payload: steps });
  }, []);

  const setIsWarningActiveStep = useCallback((active: boolean) => {
    dispatch({ type: 'SET_WARNING', payload: active });
  }, []);

  const updateCustomerInfo = useCallback((data: CustomerInfoData) => {
    dispatch({ type: 'UPDATE_CUSTOMER_INFO', payload: data });
  }, []);

  const updateManagementUbo = useCallback((members: ManagementUboMember[]) => {
    dispatch({ type: 'UPDATE_MANAGEMENT_UBO', payload: members });
  }, []);

  const isAllStepsDisabled = useMemo(() => {
    const otherStepIds = ONBOARDING_STEPS
      .map((s) => s.id)
      .filter((id) => id !== state.activeStep);
    return otherStepIds.length > 0 && otherStepIds.every((id) => state.disabledSteps.includes(id));
  }, [state.disabledSteps, state.activeStep]);

  const value = useMemo<OnboardingFormContextValue>(() => ({
    ...state,
    isAllStepsDisabled,
    navigateToStep,
    nextStep,
    setIsEditing,
    toggleEditing,
    setDisabledSteps,
    setIsWarningActiveStep,
    updateCustomerInfo,
    updateManagementUbo,
  }), [
    state,
    isAllStepsDisabled,
    navigateToStep,
    nextStep,
    setIsEditing,
    toggleEditing,
    setDisabledSteps,
    setIsWarningActiveStep,
    updateCustomerInfo,
    updateManagementUbo,
  ]);

  return (
    <OnboardingFormContext.Provider value={value}>
      {children}
    </OnboardingFormContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// Hook — throws if used outside the provider
// ---------------------------------------------------------------------------
export const useOnboardingForm = (): OnboardingFormContextValue => {
  const context = useContext(OnboardingFormContext);
  if (!context) {
    throw new Error('useOnboardingForm must be used within <OnboardingFormProvider>');
  }
  return context;
};
