'use client';

import { Box, HStack, Skeleton } from '@chakra-ui/react';

const COLUMN_WIDTHS = [120, 100, 80, 100, 90, 80, 100, 140];
const ROW_CELL_WIDTHS = [...COLUMN_WIDTHS, 32]; // last 32px is for the action button

export default function ManagementUboSkeleton() {
  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Skeleton height="20px" width="200px" borderRadius="md" />
        <Skeleton height="32px" width="130px" borderRadius="md" />
      </HStack>

      <Box border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
        <HStack bg="gray.50" px={3} py={2.5} gap={4}>
          {COLUMN_WIDTHS.map((w, i) => (
            <Skeleton key={i} height="12px" width={`${w}px`} borderRadius="md" />
          ))}
        </HStack>

        {Array.from({ length: 3 }).map((_, i) => (
          <HStack key={i} px={3} py={3} gap={4} borderTop="1px solid" borderColor="gray.100">
            {ROW_CELL_WIDTHS.map((w, j) => (
              <Skeleton key={j} height="32px" width={`${w}px`} borderRadius="md" />
            ))}
          </HStack>
        ))}
      </Box>
    </Box>
  );
}
