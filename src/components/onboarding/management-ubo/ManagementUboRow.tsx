'use client';

import {
  Table,
  Input,
  NativeSelect,
  Badge,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { Check, X, Trash2 } from 'lucide-react';
import type { ManagementUboMember, GroupType } from '@/types/onboarding';
import type { CountryParameter } from '@/types/onboarding';

interface ManagementUboRowProps {
  member: ManagementUboMember;
  isEditing: boolean;
  countryOptions: CountryParameter[];
  onUpdate: (field: keyof ManagementUboMember, value: string | boolean) => void;
  onRequestDelete: () => void;
}

export default function ManagementUboRow({
  member,
  isEditing,
  countryOptions,
  onUpdate,
  onRequestDelete,
}: ManagementUboRowProps) {
  if (!isEditing) {
    return (
      <Table.Row>
        <Table.Cell fontSize="sm">{member.name}</Table.Cell>
        <Table.Cell fontSize="sm">{member.positionType}</Table.Cell>
        <Table.Cell>
          <Badge colorPalette={member.groupType === 'INDIVIDUAL' ? 'green' : 'blue'} size="sm">
            {member.groupType}
          </Badge>
        </Table.Cell>
        <Table.Cell fontSize="sm">{member.nikPassportNo ?? '—'}</Table.Cell>
        <Table.Cell>
          {member.authorizedSigner ? (
            <HStack gap={1}>
              <Check size={14} style={{ color: 'var(--chakra-colors-green-600)' }} />
              <span style={{ fontSize: '12px', color: 'var(--chakra-colors-green-600)' }}>Yes</span>
            </HStack>
          ) : (
            <HStack gap={1}>
              <X size={14} style={{ color: 'var(--chakra-colors-red-500)' }} />
              <span style={{ fontSize: '12px', color: 'var(--chakra-colors-red-500)' }}>No</span>
            </HStack>
          )}
        </Table.Cell>
        <Table.Cell fontSize="sm">{member.dateOfBirth ?? '—'}</Table.Cell>
        <Table.Cell fontSize="sm">{member.countryOfResidence ?? '—'}</Table.Cell>
        <Table.Cell fontSize="sm">{member.address ?? '—'}</Table.Cell>
        <Table.Cell />
      </Table.Row>
    );
  }

  return (
    <Table.Row>
      <Table.Cell p={1}>
        <Input
          size="sm"
          placeholder="Full legal name *"
          value={member.name}
          onChange={(e) => onUpdate('name', e.target.value)}
        />
      </Table.Cell>
      <Table.Cell p={1}>
        <Input
          size="sm"
          placeholder="e.g. Director *"
          value={member.positionType}
          onChange={(e) => onUpdate('positionType', e.target.value)}
        />
      </Table.Cell>
      <Table.Cell p={1}>
        <NativeSelect.Root size="sm">
          <NativeSelect.Field
            value={member.groupType}
            onChange={(e) => onUpdate('groupType', e.target.value as GroupType)}
          >
            <option value="">Select *</option>
            <option value="INDIVIDUAL">Individual</option>
            <option value="ENTITY">Entity</option>
          </NativeSelect.Field>
        </NativeSelect.Root>
      </Table.Cell>
      <Table.Cell p={1}>
        <Input
          size="sm"
          placeholder="ID card or Passport"
          value={member.nikPassportNo ?? ''}
          onChange={(e) => onUpdate('nikPassportNo', e.target.value)}
        />
      </Table.Cell>
      <Table.Cell p={1}>
        <NativeSelect.Root size="sm">
          <NativeSelect.Field
            value={member.authorizedSigner ? 'yes' : 'no'}
            onChange={(e) => onUpdate('authorizedSigner', e.target.value === 'yes')}
          >
            <option value="">Select *</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </NativeSelect.Field>
        </NativeSelect.Root>
      </Table.Cell>
      <Table.Cell p={1}>
        <Input
          size="sm"
          type="date"
          value={member.dateOfBirth ?? ''}
          onChange={(e) => onUpdate('dateOfBirth', e.target.value)}
        />
      </Table.Cell>
      <Table.Cell p={1}>
        <NativeSelect.Root size="sm">
          <NativeSelect.Field
            value={member.countryOfResidence ?? ''}
            onChange={(e) => onUpdate('countryOfResidence', e.target.value)}
          >
            <option value="">Select country</option>
            {countryOptions.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </NativeSelect.Field>
        </NativeSelect.Root>
      </Table.Cell>
      <Table.Cell p={1}>
        <Input
          size="sm"
          placeholder="Full registered address"
          value={member.address ?? ''}
          onChange={(e) => onUpdate('address', e.target.value)}
        />
      </Table.Cell>
      <Table.Cell p={1}>
        <IconButton
          aria-label="Remove member"
          size="xs"
          variant="ghost"
          colorPalette="red"
          onClick={onRequestDelete}
        >
          <Trash2 size={14} />
        </IconButton>
      </Table.Cell>
    </Table.Row>
  );
}
