"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Flex, Text, VStack, HStack, Icon, Badge } from "@chakra-ui/react";
import { 
  House, 
  UserPlus, 
  Users, 
  UserMinus, 
  PieChart, 
  Clock, 
  BellRing, 
  FileEdit 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { id: 1, label: "HOME", href: "/ekyc", icon: House },
    { id: 2, label: "NEW ONBOARD", href: "/new-onboard", icon: UserPlus },
  ];

  return (
    <Flex
      w="280px"
      bg="brand.900"
      borderRight="1px solid"
      borderColor="brand.800"
      direction="column"
      h="calc(100vh - 72px)"
      position="sticky"
      top="72px"
    >
      <Box p={6} flex="1" overflowY="auto">
        <Box mb={8}>
          <Text fontSize="xs" fontWeight="bold" color="whiteAlpha.500" letterSpacing="widest" mb={3}>
            MANAGEMENT SYSTEM
          </Text>
        </Box>

        <VStack as="nav" spacing={2} align="stretch">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Box key={item.id}>
                <Link href={item.href} passHref>
                  <HStack
                    as="span"
                    px={4}
                    py={3}
                    borderRadius="lg"
                    bg={isActive ? "whiteAlpha.200" : "transparent"}
                    color={isActive ? "white" : "whiteAlpha.700"}
                    _hover={{
                      bg: isActive ? "whiteAlpha.300" : "whiteAlpha.100",
                      color: isActive ? "white" : "whiteAlpha.900"
                    }}
                    transition="all 0.2s"
                    cursor="pointer"
                    role="group"
                  >
                    <Icon 
                      as={item.icon} 
                      boxSize={5} 
                      color={isActive ? "brand.200" : "whiteAlpha.600"} 
                      _groupHover={{ color: isActive ? "brand.100" : "whiteAlpha.800" }}
                      transition="color 0.2s"
                    />
                    <Text fontSize="sm" fontWeight={isActive ? "bold" : "medium"}>
                      {item.label}
                    </Text>
                  </HStack>
                </Link>
              </Box>
            );
          })}
        </VStack>
      </Box>

      <Flex p={4} borderTop="1px solid" borderColor="brand.800" bg="brand.900" align="center" gap={3}>
        <Box w={2} h={2} borderRadius="full" bg="brand.300" boxShadow="0 0 0 2px rgba(134, 239, 172, 0.2)" />
        <Text fontSize="xs" fontWeight="semibold" color="whiteAlpha.800">
          System Online
        </Text>
      </Flex>
    </Flex>
  );
}
