'use client';

import { useParams } from 'next/navigation';
import { Box, Flex, Heading, HStack, Button } from '@chakra-ui/react';
import { Pencil, UserPlus, X } from 'lucide-react';
import OnboardingSidebar from '@/components/onboarding/OnboardingSidebar';
import { CustomerInfoStep, ManagementUboStep } from '@/components/onboarding/steps';
import RenderIf, { RenderElse } from '@/components/ui/RenderIf';
import { OnboardingFormProvider, useOnboardingForm } from '@/features/onboarding/OnboardingFormContext';

const OnboardingPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = useParams<{ id: string }>();

  const { mounted, activeStep, isEditing, toggleEditing } = useOnboardingForm();

  if (!mounted) return null;

  return (
    <Box display="flex" flexDirection="column" h="100%">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={5}>
        <HStack gap={3}>
          <Flex
            w={10}
            h={10}
            borderRadius="full"
            bg="brand.500"
            align="center"
            justify="center"
            flexShrink={0}
          >
            <UserPlus size={20} color="white" />
          </Flex>
          <Heading size="lg" color="brand.600" fontWeight="bold">
            New Onboarding
          </Heading>
        </HStack>

        <Button
          onClick={toggleEditing}
          variant={isEditing ? 'outline' : 'solid'}
          colorPalette={isEditing ? 'red' : 'green'}
          size="sm"
          borderRadius="md"
          fontWeight="semibold"
          transition="all 0.2s ease"
        >
          <RenderIf when={isEditing}>
            <X size={14} />
            Stop Editing

            <RenderElse>
              <Pencil />
              Start Editing
            </RenderElse>
          </RenderIf>
        </Button>
      </Flex>

      {/* Main Content */}
      <Box
        bg="gray.100"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="xl"
        transition="box-shadow 0.3s ease"
        boxShadow={isEditing ? 'sm' : 'none'}
        flex={1}
        minH={0}
        overflow="hidden"
      >
        <Flex gap={0} align="flex-start" h="100%">
          {/* Sidebar */}
          <Box w="220px" minW="220px" h="100%" overflowY="auto" flexShrink={0}>
            <OnboardingSidebar />
          </Box>

          {/* Divider */}
          <Box w="1px" bg="gray.300" alignSelf="stretch" flexShrink={0} />

          {/* Step Content */}
          <Box flex={1} minW={0} p={5} bg="white" borderEndRadius="xl" h="100%" overflowY="auto">
            <RenderIf when={activeStep === 'customer-info'}>
              <CustomerInfoStep />
            </RenderIf>
            <RenderIf when={activeStep === 'management-ubo'}>
              <ManagementUboStep />
            </RenderIf>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default function OnboardingPageWrapper() {
  return (
    <OnboardingFormProvider>
      <OnboardingPage />
    </OnboardingFormProvider>
  );
}