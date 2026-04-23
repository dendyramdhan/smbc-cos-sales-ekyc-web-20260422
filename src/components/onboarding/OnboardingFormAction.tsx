import { Flex, Button, Spinner } from '@chakra-ui/react';
import RenderIf, { RenderElse } from '../ui/RenderIf';
import { useOnboardingForm } from '@/features/onboarding/OnboardingFormContext';

interface OnboardingFormActionProps {
  hasNextDisabled?: boolean;
  hasSaveAndContinueLoading?: boolean;
  hasSaveAndEndLoading?: boolean;
  onSaveAndContinue?: () => void;
  onSaveAndEnd?: () => void;
}

export default function OnboardingFormAction({
  hasNextDisabled,
  onSaveAndContinue,
  onSaveAndEnd,
  hasSaveAndContinueLoading = false,
  hasSaveAndEndLoading = false,
}: OnboardingFormActionProps) {
  const { isEditing, nextStep, isAllStepsDisabled } = useOnboardingForm();

  return (
    <Flex justify="flex-end" gap={3} pt={4} align="center">
      <RenderIf when={isEditing}>
        <Button
          disabled={hasSaveAndContinueLoading || hasSaveAndEndLoading}
          variant="outline"
          colorPalette="brand"
          size="sm"
          fontWeight="medium"
          onClick={onSaveAndContinue}
          borderColor="brand.600"
          transition="all 0.15s ease"
          minWidth="175px"
          color="brand.600"
        >
          <RenderIf when={hasSaveAndContinueLoading}>
            <Spinner size="xs" />
            <RenderElse>Save and Continue Edit</RenderElse>
          </RenderIf>
        </Button>
        <Button
          disabled={hasSaveAndContinueLoading || hasSaveAndEndLoading}
          variant="outline"
          colorPalette="brand"
          size="sm"
          fontWeight="semibold"
          onClick={onSaveAndEnd}
          borderColor="brand.600"
          transition="all 0.15s ease"
          minWidth="175px"
          color="brand.600"
        >
          <RenderIf when={hasSaveAndEndLoading}>
            <Spinner size="xs" />
            <RenderElse>Save and End Edit</RenderElse>
          </RenderIf>
        </Button>
      </RenderIf>

      <Button
        variant="solid"
        colorPalette={isAllStepsDisabled ? 'red' : 'green'}
        size="sm"
        disabled={hasNextDisabled || isAllStepsDisabled}
        onClick={nextStep}
        fontWeight="semibold"
        transition="all 0.2s ease"
      >
        Next
      </Button>
    </Flex>
  );
}