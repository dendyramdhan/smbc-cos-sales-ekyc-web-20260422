'use client';

import { Table, Text, VStack } from '@chakra-ui/react';
import { Users } from 'lucide-react';
import type { ManagementUboMember } from '@/types/onboarding';
import type { CountryParameter } from '@/types/onboarding';
import ManagementUboRow from './ManagementUboRow';

interface ManagementUboTableProps {
  members: ManagementUboMember[];
  isEditing: boolean;
  countryOptions: CountryParameter[];
  onUpdateMember: (index: number, field: keyof ManagementUboMember, value: string | boolean) => void;
  onRequestDelete: (index: number) => void;
}

const COLUMNS = [
  { label: 'Name', required: true },
  { label: 'Position Type', required: true },
  { label: 'Type', required: true },
  { label: 'NIK/Passport', required: false },
  { label: 'Auth. Signer', required: true },
  { label: 'DOB', required: false },
  { label: 'Country', required: false },
  { label: 'Address', required: false },
  { label: '', required: false },
];

export default function ManagementUboTable({
  members,
  isEditing,
  countryOptions,
  onUpdateMember,
  onRequestDelete,
}: ManagementUboTableProps) {
  return (
    <Table.Root size="sm" variant="outline" borderRadius="md" overflow="hidden">
      <Table.Header bg="gray.50">
        <Table.Row>
          {COLUMNS.map((col, i) => (
            <Table.ColumnHeader key={i} fontSize="xs" fontWeight="semibold" color="gray.600" py={2.5} px={3}>
              {col.required && isEditing ? (
                <span>
                  {col.label}{' '}
                  <span style={{ color: 'var(--chakra-colors-red-500)' }}>*</span>
                </span>
              ) : (
                col.label
              )}
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {members.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={COLUMNS.length} textAlign="center" py={10}>
              <VStack gap={2} color="gray.400">
                <Users size={28} />
                <Text fontSize="sm">No members added yet</Text>
              </VStack>
            </Table.Cell>
          </Table.Row>
        ) : (
          members.map((member, index) => (
            <ManagementUboRow
              key={index}
              member={member}
              isEditing={isEditing}
              countryOptions={countryOptions}
              onUpdate={(field, value) => onUpdateMember(index, field, value)}
              onRequestDelete={() => onRequestDelete(index)}
            />
          ))
        )}
      </Table.Body>
    </Table.Root>
  );
}
