'use client';

import { Flex, Text, Avatar, Button, HStack } from '@chakra-ui/react';
import { LogOut } from 'lucide-react';

export default function Header() {
  const handleLogout = () => {
    alert('Logout clicked');
  };

  return (
    <Flex
      as="header"
      w="full"
      h="72px"
      bg="surface.light"
      borderBottom="1px solid"
      borderColor="gray.200"
      px={6}
      align="center"
      justify="flex-end"
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={100}
    >
      <HStack gap={6}>
        <HStack
          gap={3}
          bg="gray.50"
          border="1px solid"
          borderColor="gray.100"
          borderRadius="full"
          pl={1}
          pr={4}
          py={1}
        >
          <Avatar.Root size="sm" bg="brand.500" color="white">
            <Avatar.Fallback name="User Profile" />
          </Avatar.Root>
          <Text fontSize="sm" fontWeight="semibold" color="gray.700">
            User Profile
          </Text>
        </HStack>

        <Button
          onClick={handleLogout}
          variant="ghost"
          colorPalette="gray"
          size="sm"
          fontWeight="semibold"
          color="gray.600"
          _hover={{ bg: 'red.50', color: 'red.600' }}
        >
          <LogOut size={16} />
          Logout
        </Button>
      </HStack>
    </Flex>
  );
}
