'use client';

import {
  Box,
  HStack,
  VStack,
  SimpleGrid,
  Skeleton,
} from '@chakra-ui/react';

export default function CustomerInfoSkeleton() {
  return (
    <Box>
      {/* Top 3-col row */}
      <SectionSkeleton columns={3} count={3} />

      <Skeleton height="18px" width="160px" mb={4} borderRadius="md" />

      {/* Basic info 2-col grid */}
      <SectionSkeleton columns={2} count={18} />

      <Skeleton height="18px" width="160px" mb={4} borderRadius="md" />

      {/* Previous checklist */}
      <SectionSkeleton columns={2} count={4} />

      {/* General checking */}
      <Box mb={6}>
        <Skeleton height="14px" width="70%" mb={4} borderRadius="md" />
        <VStack gap={2} align="stretch" pl={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <HStack key={i} gap={3}>
              <Skeleton boxSize="16px" borderRadius="sm" flexShrink={0} />
              <Skeleton height="14px" width={`${60 + (i % 3) * 12}%`} borderRadius="md" />
            </HStack>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

function FieldSkeleton() {
  return (
    <Box>
      <Skeleton height="12px" width="40%" mb={2} borderRadius="md" />
      <Skeleton height="38px" borderRadius="md" />
    </Box>
  );
};

function SectionSkeleton({ columns = 2, count }: { columns?: number; count: number }) {
  return (
    <SimpleGrid columns={columns} gap={4} mb={6}>
      {Array.from({ length: count }).map((_, i) => (
        <FieldSkeleton key={i} />
      ))}
    </SimpleGrid>
  );
};