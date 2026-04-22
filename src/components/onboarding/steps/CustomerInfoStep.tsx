'use client';

import { useState, useCallback, useMemo, useEffect, startTransition } from 'react';
import {
  Box,
  Text,
  Heading,
  HStack,
  VStack,
  SimpleGrid,
  Checkbox,
} from '@chakra-ui/react';
import { Pencil, Lock } from 'lucide-react';
import type { CustomerInfoData } from '@/types/onboarding/customerInfo';
import { useOnboardingForm } from '@/features/onboarding/OnboardingFormContext';
import OnboardingFormAction from '../OnboardingFormAction';
import { useOnboarding } from '@/hooks/queries';
import { getCustomerInfo } from '@/utils/onboardingUtil';
import { CustomerInfoSkeleton } from '../loading';
import { CustomerInfoFormField } from '../form';
import { useCustomerInfoOptions } from '@/hooks/queries/useEKYCParameterQueries';
import RenderIf from '@/components/ui/RenderIf';
import { ONBOARDING_STEPS } from '../OnboardingSidebar';

const SYSTEM_FIELDS = new Set<keyof CustomerInfoData>([
  'capId',
  'besReferenceNo',
  'cifNo',
  'checklistStatus',
  'checklistStage',
  'finalRiskRating',
  'riskScore',
  'creationDate',
  'approvalDate',
  'previousChecklistId',
  'previousRiskRating',
  'nextReviewDueDate',
  'reviewedTo',
]);

const REQUIRED_FIELDS = new Set<keyof CustomerInfoData>([
  'customerName',
  'legalEntityType',
  'legalEntityCharacteristic',
  'lineOfBusiness',
  'registerAddressCountry',
  'correspondenceAddressCountry',
  'rmRoName',
  'rmRoCode',
  'department',
]);

export default function CustomerInfoStep() {
  const { isEditing, updateCustomerInfo, setIsEditing, setDisabledSteps, setIsWarningActiveStep } = useOnboardingForm();
  const { data: onboardingResponse, isLoading } = useOnboarding('get-id-from-path');
  const {
    customerTypeOptions,
    legalEntityTypeOptions,
    legalEntityCharacteristicOptions,
    lineOfBusinessOptions,
    countryOptions,
    generalCheckingOptions
  } = useCustomerInfoOptions();

  const [selectedChecks, setSelectedChecks] = useState<string[]>([]);
  const [customerInfoData, setCustomerInfoData] = useState<CustomerInfoData | null>(null);
  const [actionLoading, setActionLoading] = useState({
    saveAndContinue: false,
    saveAndEnd: false,
  });

  const onboardingData = useMemo(() => onboardingResponse?.data, [onboardingResponse]);

  useEffect(() => {
    if (!onboardingData) return;

    const mappedCustomerInfo = getCustomerInfo(onboardingData);
    setCustomerInfoData(mappedCustomerInfo);
    setSelectedChecks(mappedCustomerInfo.generalChecking ?? []);
  }, [onboardingData]);

  // Sync selectedChecks into customerInfoData (deferred — don't block checkbox paint)
  useEffect(() => {
    startTransition(() => {
      setCustomerInfoData((current) => {
        if (!current) return current;
        return { ...current, generalChecking: selectedChecks };
      });
    });
  }, [selectedChecks]);

  // Sync local draft to context after render (deferred — don't block field re-renders)
  useEffect(() => {
    if (customerInfoData) {
      startTransition(() => {
        updateCustomerInfo(customerInfoData);
      });
    }
  }, [customerInfoData, updateCustomerInfo]);

  const updateField = useCallback(
    (field: keyof CustomerInfoData, value: string) => {
      setCustomerInfoData((prev) => {
        if (!prev) return prev;
        return { ...prev, [field]: value };
      });
    },
    [],
  );

  const handleCheckChange = useCallback((key: string, checked: boolean) => {
    setSelectedChecks((prev) => {
      if (key === 'f' && checked) return ['f'];
      if (key !== 'f' && checked) return [...prev.filter((c) => c !== 'f'), key];
      return prev.filter((c) => c !== key);
    });
  }, []);

  const handleSaveAndContinue = useCallback(async () => {
    setActionLoading((prev) => ({ ...prev, saveAndContinue: true }));
    setTimeout(() => {
      // TODO: call API to persist data
      setActionLoading((prev) => ({ ...prev, saveAndContinue: false }));
    }, 2000);
  }, []);

  const handleSaveAndEnd = useCallback(async () => {
    setActionLoading((prev) => ({ ...prev, saveAndEnd: true }));
    setTimeout(() => {
      // TODO: call API to persist data
      setIsEditing(false);
      setActionLoading((prev) => ({ ...prev, saveAndEnd: false }));
    }, 2000);
  }, [setIsEditing]);

  const hasProhibitedSelection = useMemo(() => selectedChecks.some((c) =>
    ['a', 'b', 'c', 'd', 'e'].includes(c),
  ), [selectedChecks]);
  const hasNoneOfAbove = useMemo(() => selectedChecks.includes('f'), [selectedChecks]);
  const hasNoSelection = useMemo(() => selectedChecks.length === 0, [selectedChecks]);

  useEffect(() => {
    setIsWarningActiveStep(hasProhibitedSelection);

    if (hasProhibitedSelection || hasNoSelection) {
      const allSteps = ONBOARDING_STEPS.filter((s) => s.id !== 'customer-info').map((s) => s.id);
      setDisabledSteps(allSteps);
    } else {
      setDisabledSteps([]);
    }
  }, [hasProhibitedSelection, hasNoSelection, setDisabledSteps]);

  if (isLoading) return <CustomerInfoSkeleton />;
  const isNextDisabled = isEditing && (hasProhibitedSelection || hasNoSelection);

  const renderField = (config: {
    field: keyof CustomerInfoData;
    label: string;
    type?: 'text' | 'date' | 'select' | 'combobox';
    options?: readonly string[];
  }) => customerInfoData && (
    <CustomerInfoFormField
      key={config.field}
      label={config.label}
      value={String(customerInfoData[config.field] ?? '')}
      onChange={(v) => updateField(config.field, v)}
      isEditing={isEditing}
      isSystem={SYSTEM_FIELDS.has(config.field)}
      isRequired={REQUIRED_FIELDS.has(config.field)}
      type={config.type}
      options={config.options}
    />
  );

  return (
    <Box>
      <Box
        overflow="hidden"
        maxH={isEditing ? '40px' : '0px'}
        opacity={isEditing ? 1 : 0}
        transition="max-height 0.3s ease, opacity 0.25s ease, margin 0.3s ease"
        mb={isEditing ? 5 : 0}
      >
        <HStack gap={6}>
          <HStack gap={1.5}>
            <Pencil size={12} style={{ color: 'brand.600' }} />
            <Text fontSize="xs" color="brand.600" fontWeight="semibold">
              Editable by Maker
            </Text>
          </HStack>
          <HStack gap={1.5}>
            <Lock size={12} style={{ color: 'gray.500' }} />
            <Text fontSize="xs" color="gray.500">
              System-managed / read-only
            </Text>
          </HStack>
        </HStack>
      </Box>

      <SimpleGrid columns={3} gap={4} mb={6}>
        {renderField({
          field: 'customerType',
          label: 'Customer Type',
          type: 'select',
          options: customerTypeOptions.map((opt) => `${opt.code} - ${opt.name}`),
        })}
        {renderField({
          field: 'checklistStatus',
          label: 'Checklist Status',
        })}
        {renderField({
          field: 'checklistStage',
          label: 'Checklist Stage',
        })}
      </SimpleGrid>

      <Heading size="sm" color="brand.600" fontWeight="bold" mb={4}>
        Basic Information
      </Heading>

      <SimpleGrid columns={2} gap={4} mb={2}>
        {renderField({ field: 'capId', label: 'CAP ID' })}
        {renderField({
          field: 'besReferenceNo',
          label: 'BES Reference No.',
        })}
        {renderField({ field: 'cifNo', label: 'CIF No.' })}
        {renderField({
          field: 'customerName',
          label: 'Customer Name',
        })}
        {renderField({
          field: 'formerlyKnownAs',
          label: 'Formerly Known As',
        })}
        {renderField({
          field: 'businessNameAlsoKnownAs',
          label: 'Business Name/Also Known As',
        })}
        {renderField({
          field: 'dateOfEstablishment',
          label: 'Date of Establishment',
          type: 'date',
        })}
        {renderField({
          field: 'legalEntityType',
          label: 'Legal Entity Type',
          type: 'select',
          options: legalEntityTypeOptions.map((opt) => opt.label),
        })}
        {renderField({
          field: 'legalEntityCharacteristic',
          label: 'Legal Entity Characteristic',
          type: 'select',
          options: legalEntityCharacteristicOptions.map((opt) => opt.label),
        })}
        {renderField({
          field: 'lineOfBusiness',
          label: 'Line of business',
          type: 'select',
          options: lineOfBusinessOptions.map((opt) => opt.label),
        })}
        {renderField({
          field: 'registerAddressCountry',
          label: 'Register Address (Country)',
          type: 'combobox',
          options: countryOptions.map((opt) => opt.name),
        })}
        {renderField({
          field: 'correspondenceAddressCountry',
          label: 'Correspondence Address (Country)',
          type: 'combobox',
          options: countryOptions.map((opt) => opt.name),
        })}
        {renderField({ field: 'rmRoName', label: 'RM/RO Name' })}
        {renderField({ field: 'rmRoCode', label: 'RM/RO Code' })}
        {renderField({ field: 'department', label: 'Department' })}
        {renderField({
          field: 'finalRiskRating',
          label: 'Final Risk Rating',
        })}
        {renderField({ field: 'riskScore', label: 'Risk Score' })}
        {renderField({
          field: 'creationDate',
          label: 'Creation Date',
        })}
      </SimpleGrid>

      <SimpleGrid columns={2} gap={4} mb={6}>
        {renderField({
          field: 'approvalDate',
          label: 'Approval Date',
        })}
        <Box />
      </SimpleGrid>

      <Heading size="sm" color="brand.600" fontWeight="bold" mb={4}>
        Previous Checklist
      </Heading>

      <SimpleGrid columns={2} gap={4} mb={6}>
        {renderField({
          field: 'previousChecklistId',
          label: 'Checklist ID',
        })}
        {renderField({
          field: 'previousRiskRating',
          label: 'Risk Rating',
        })}
        {renderField({
          field: 'nextReviewDueDate',
          label: 'Next Review Due Date',
        })}
        {renderField({ field: 'reviewedTo', label: 'Reviewed To' })}
      </SimpleGrid>

      <Box mb={6}>
        <HStack gap={1} mb={1}>
          <Text color="red.500" fontWeight="bold" fontSize="sm">
            *
          </Text>
          <Text fontSize="sm" color="gray.700" fontWeight="medium">
            General checking to prohibit the establishment of banking
            relationship with non acceptable customers:
          </Text>
        </HStack>

        <RenderIf when={isEditing && hasNoSelection}>
          <Text fontSize="sm" color="red.500" mb={2}>
            Please select at least 1 option.
          </Text>
        </RenderIf>

        <VStack gap={2} align="stretch" pl={3} mt={3}>
          {generalCheckingOptions.map((option) => (
            <Checkbox.Root
              key={option.key}
              checked={selectedChecks.includes(option.key)}
              onCheckedChange={(details) =>
                handleCheckChange(option.key, !!details.checked)
              }
              disabled={!isEditing}
              colorPalette="green"
              size="sm"
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control
                transition="all 0.15s ease"
                borderRadius="sm"
              />
              <Checkbox.Label>
                <Text fontSize="sm" color="gray.600">
                  {option.key}) {option.label}
                </Text>
              </Checkbox.Label>
            </Checkbox.Root>
          ))}
        </VStack>

        <RenderIf when={hasProhibitedSelection}>
          <Text
            mt={5}
            fontSize="sm"
            color="red.600"
            fontWeight="bold"
            transition="opacity 0.25s ease"
          >
            NO ACCOUNT SHOULD BE OPENED and NO BUSINESS should be done with
            the customer. If required please contact AML CFT Department.
          </Text>
        </RenderIf>

        <RenderIf when={hasNoneOfAbove}>
          <Text
            mt={5}
            fontSize="sm"
            color="blue.600"
            fontWeight="semibold"
            transition="opacity 0.25s ease"
          >
            Please CONTINUE with the remaining questions.
          </Text>
        </RenderIf>
      </Box>

      <OnboardingFormAction
        hasNextDisabled={isNextDisabled}
        onSaveAndEnd={handleSaveAndEnd}
        onSaveAndContinue={handleSaveAndContinue}
        hasSaveAndContinueLoading={actionLoading.saveAndContinue}
        hasSaveAndEndLoading={actionLoading.saveAndEnd}
      />
    </Box>
  );
}
