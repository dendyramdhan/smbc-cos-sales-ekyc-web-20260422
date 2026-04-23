'use client';

import {
  Dialog,
  Button,
  Text,
} from '@chakra-ui/react';

interface DeleteConfirmDialogProps {
  memberName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function DeleteConfirmDialog({
  memberName,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog.Root open onOpenChange={({ open }) => { if (!open) onCancel(); }}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="md" borderRadius="lg">
          <Dialog.Header>
            <Dialog.Title fontWeight="semibold" fontSize="md">
              Remove Member
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <Text fontSize="sm" color="gray.700">
              Are you sure you want to delete this record?{' '}
              {memberName && <Text as="strong">{memberName}</Text>}{' '}
              This action cannot be undone.
            </Text>
          </Dialog.Body>

          <Dialog.Footer gap={3}>
            <Button
              variant="ghost"
              colorPalette="gray"
              size="sm"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              colorPalette="green"
              size="sm"
              onClick={onConfirm}
              loading={isLoading}
            >
              Remove
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
