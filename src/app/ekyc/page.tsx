'use client';

import DashboardLayout from "@/components/DashboardLayout";
import { 
  Hand, 
  BarChart3
} from "lucide-react";
import { 
  Box, Flex, Text, VStack, Icon
} from '@chakra-ui/react';

export default function Home() {
  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hrs ago`;
    return `${diffDays} days ago`;
  };

  return (
    <DashboardLayout>
      <VStack spacing={8} align="stretch">
        <Box 
          bg="brand.900" 
          borderRadius="2xl" 
          p={10} 
          position="relative" 
          overflow="hidden"
          boxShadow="lg"
        >
          <Box position="absolute" top="-10%" right="-5%" opacity={0.05} transform="rotate(15deg)">
             <Icon as={BarChart3} boxSize="400px" color="white" />
          </Box>
          <Flex align="center" gap={6} mb={8} position="relative" zIndex={1}>
            <Flex 
              w={20} h={20} 
              bg="whiteAlpha.200" 
              backdropFilter="blur(10px)" 
              borderRadius="full" 
              align="center" 
              justify="center" 
              border="1px solid" 
              borderColor="whiteAlpha.300"
            >
              <Icon as={Hand} boxSize={10} color="white" />
            </Flex>
            <Box>
              <Text fontSize="4xl" fontWeight="bold" color="white" lineHeight="1.2">
                Welcome
              </Text>
              <Text fontSize="lg" color="brand.100" mt={1}>
                Good Morning
              </Text>
            </Box>
          </Flex>
        </Box>
      </VStack>
    </DashboardLayout>
  );
}
