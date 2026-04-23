'use client';

import { useCallback } from 'react';
import { Box, Flex, VStack, Text } from '@chakra-ui/react';
import {
  ClipboardList,
  Users,
  UserCog,
  ArrowLeftRight,
  Package,
  Lock,
  TriangleAlert
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import RenderIf, { RenderElse } from '../ui/RenderIf';
import { useOnboardingForm } from '@/features/onboarding/OnboardingFormContext';

export type OnboardingStepId = 'customer-info'
  | 'ownership'
  | 'management-ubo'
  | 'counterparties'
  | 'product-services';

interface OnboardingStep {
  id: OnboardingStepId;
  label: string;
  icon: LucideIcon;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 'customer-info', label: 'Customer Info', icon: ClipboardList },
  { id: 'ownership', label: 'Ownership/Shareholder', icon: Users },
  { id: 'management-ubo', label: 'Management & UBO', icon: UserCog },
  { id: 'counterparties', label: 'Counterparties', icon: ArrowLeftRight },
  { id: 'product-services', label: 'Product & Services', icon: Package },
  // { id: 'screening', label: 'Screening', icon: Search },
  // { id: 'document-checking', label: 'Document Checking', icon: FileCheck },
  // { id: 'cdd', label: 'CDD', icon: Shield },
  // { id: 'risk-rating', label: 'Risk Rating', icon: BarChart3 },
  // {
  //   id: 'final-risk-assessment',
  //   label: 'Final Risk Assessment',
  //   icon: ClipboardCheck,
  // },
  // {
  //   id: 'trade-finance-due',
  //   label: 'Trade Finance Due...',
  //   icon: Landmark,
  // },
  // { id: 'fatca-crs', label: 'Fatca/CRS', icon: Flag },
  // { id: 'edd', label: 'EDD', icon: FileSearch },
  // { id: 'document-uploads', label: 'Document Uploads', icon: Upload },
  // { id: 'approval', label: 'Approval', icon: CheckCircle },
];

export default function OnboardingSidebar() {
  const { activeStep, navigateToStep, disabledSteps, isWarningActiveStep } = useOnboardingForm();

  const handleStepClick = useCallback(
    (stepId: string) => {
      window.location.hash = stepId;
      navigateToStep(stepId);
    },
    [navigateToStep],
  );

  return (
    <Box
      w="220px"
      minW="220px"
      py={2}
    >
      <VStack gap={0} align="stretch">
        {ONBOARDING_STEPS.map((step) => {
          const isActive = step.id === activeStep;
          const StepIcon = step.icon;

          return (
            <Flex
              key={step.id}
              as="button"
              px={3}
              py={2.5}
              gap={2.5}
              align="center"
              cursor="pointer"
              bg={isActive ? 'white' : 'transparent'}
              borderLeft="4px solid"
              borderLeftColor={isActive ? 'brand.600' : 'transparent'}
              color={isActive ? 'brand.600' : 'gray.400'}
              _hover={{
                bg: 'brand.50',
                color: 'brand.500',
                borderColor: 'brand.500'
              }}
              transition="all 0.2s ease"
              onClick={() => handleStepClick(step.id)}
              width="100%"
              textAlign="left"
              aria-disabled={disabledSteps.includes(step.id)}
              pointerEvents={disabledSteps.includes(step.id) ? 'none' : 'auto'}
              borderRadius={4}
              boxShadow={isActive ? '0 2px 2px var(--chakra-colors-gray-400)' : 'none'}
            >
              <StepIcon size={15} />
              <Text
                flex={1}
                fontSize="13px"
                fontWeight={isActive ? 'bold' : 'semibold'}
                lineClamp={1}
              >
                {step.label}
              </Text>

              <RenderIf when={disabledSteps.length > 0}>
                <RenderIf when={isActive && isWarningActiveStep}>
                  <TriangleAlert size={14} style={{ color: 'rgb(255, 0, 0)' }} />

                  <RenderElse>
                    <RenderIf when={disabledSteps.includes(step.id)}>
                      <Lock size={12} style={{ color: isWarningActiveStep ? 'rgba(255, 0, 0, 0.4)' : 'var(--chakra-colors-gray-300)' }} />
                    </RenderIf>
                  </RenderElse>
                </RenderIf>
              </RenderIf>
            </Flex>
          );
        })}
      </VStack>
    </Box>
  );
}
