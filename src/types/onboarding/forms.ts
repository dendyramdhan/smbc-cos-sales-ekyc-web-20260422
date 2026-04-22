export interface OnboardingFormStepProps<T> {
  onNext?: () => void;
  onSaveAndContinue?: () => void;
  onSaveAndEnd?: () => void;
  onDataChange?: (data: T) => void;
  isEditing?: boolean;
}