'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Box, Flex, HStack, Text, Badge, Button } from '@chakra-ui/react';
import { UserCog, UserPlus } from 'lucide-react';
import type { ManagementUboMember } from '@/types/onboarding';
import { useOnboardingForm } from '@/features/onboarding/OnboardingFormContext';
import OnboardingFormAction from '../OnboardingFormAction';
import {
  useManagementUboMembers,
  useSaveManagementUboMembers,
  useDeleteManagementUboMember,
} from '@/hooks/queries/useManagementUboQueries';
import { useCountryOptions } from '@/hooks/queries/useEKYCParameterQueries';
import ManagementUboTable from '../management-ubo/ManagementUboTable';
import DeleteConfirmDialog from '../management-ubo/DeleteConfirmDialog';
import { ManagementUboSkeleton } from '../loading';
import RenderIf from '@/components/ui/RenderIf';

const BLANK_MEMBER: ManagementUboMember = {
  positionType: '',
  name: '',
  groupType: 'INDIVIDUAL',
  authorizedSigner: false,
  dateOfBirth: '',
  nikPassportNo: '',
  countryOfResidence: '',
  address: '',
};

export default function ManagementUboStep() {
  const { id: referenceId } = useParams<{ id: string }>();
  const { isEditing, setIsEditing } = useOnboardingForm();

  const { data: membersResponse, isLoading } = useManagementUboMembers(referenceId ?? '');
  const { data: countryResponse } = useCountryOptions();
  const saveMutation = useSaveManagementUboMembers(referenceId ?? '');
  const deleteMutation = useDeleteManagementUboMember(referenceId ?? '');

  const [members, setMembers] = useState<ManagementUboMember[]>([]);
  const [pendingDelete, setPendingDelete] = useState<{ index: number; member: ManagementUboMember } | null>(null);
  const [actionLoading, setActionLoading] = useState({ saveAndContinue: false, saveAndEnd: false });

  const countryOptions = countryResponse?.result ?? [];

  useEffect(() => {
    if (membersResponse?.result) {
      setMembers(membersResponse.result);
    }
  }, [membersResponse]);

  const handleAddMember = useCallback(() => {
    setMembers((prev) => [...prev, { ...BLANK_MEMBER }]);
  }, []);

  const handleUpdateMember = useCallback(
    (index: number, field: keyof ManagementUboMember, value: string | boolean) => {
      setMembers((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    },
    [],
  );

  const handleRequestDelete = useCallback((index: number) => {
    setPendingDelete({ index, member: members[index] });
  }, [members]);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    const { index, member } = pendingDelete;
    if (member.id) {
      await deleteMutation.mutateAsync(member.id);
    }
    setMembers((prev) => prev.filter((_, i) => i !== index));
    setPendingDelete(null);
  }, [pendingDelete, deleteMutation]);

  const handleCancelDelete = useCallback(() => {
    setPendingDelete(null);
  }, []);

  const doSave = useCallback(async () => {
    await saveMutation.mutateAsync(members);
  }, [members, saveMutation]);

  const handleSaveAndContinue = useCallback(async () => {
    setActionLoading((prev) => ({ ...prev, saveAndContinue: true }));
    try {
      await doSave();
    } finally {
      setActionLoading((prev) => ({ ...prev, saveAndContinue: false }));
    }
  }, [doSave]);

  const handleSaveAndEnd = useCallback(async () => {
    setActionLoading((prev) => ({ ...prev, saveAndEnd: true }));
    try {
      await doSave();
      setIsEditing(false);
    } finally {
      setActionLoading((prev) => ({ ...prev, saveAndEnd: false }));
    }
  }, [doSave, setIsEditing]);

  if (isLoading) return <ManagementUboSkeleton />;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <HStack gap={2}>
          <Flex
            w={8}
            h={8}
            borderRadius="full"
            bg="brand.500"
            align="center"
            justify="center"
            flexShrink={0}
          >
            <UserCog size={16} color="white" />
          </Flex>
          <Box>
            <Text fontWeight="semibold" fontSize="sm" color="brand.600">
              Management & UBO
            </Text>
            <Text fontSize="xs" color="gray.500">
              {members.length} member{members.length !== 1 ? 's' : ''} recorded
            </Text>
          </Box>
          <Badge colorPalette="gray" size="sm" ml={2}>
            {members.length} Total
          </Badge>
        </HStack>

        <RenderIf when={isEditing}>
          <Button
            size="sm"
            colorPalette="green"
            variant="solid"
            fontWeight="semibold"
            onClick={handleAddMember}
          >
            <UserPlus size={14} />
            Add New Member
          </Button>
        </RenderIf>
      </Flex>

      <RenderIf when={isEditing}>
        <HStack gap={4} mb={3}>
          <HStack gap={1.5}>
            <Box w={2} h={2} borderRadius="full" bg="red.500" />
            <Text fontSize="xs" color="gray.600">Required field</Text>
          </HStack>
          <HStack gap={1.5}>
            <Box w={2} h={2} borderRadius="full" bg="gray.300" />
            <Text fontSize="xs" color="gray.500">Optional field</Text>
          </HStack>
        </HStack>
      </RenderIf>

      <ManagementUboTable
        members={members}
        isEditing={isEditing}
        countryOptions={countryOptions}
        onUpdateMember={handleUpdateMember}
        onRequestDelete={handleRequestDelete}
      />

      {pendingDelete && (
        <DeleteConfirmDialog
          memberName={pendingDelete.member.name}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isLoading={deleteMutation.isPending}
        />
      )}

      <OnboardingFormAction
        onSaveAndContinue={handleSaveAndContinue}
        onSaveAndEnd={handleSaveAndEnd}
        hasSaveAndContinueLoading={actionLoading.saveAndContinue}
        hasSaveAndEndLoading={actionLoading.saveAndEnd}
      />
    </Box>
  );
}
