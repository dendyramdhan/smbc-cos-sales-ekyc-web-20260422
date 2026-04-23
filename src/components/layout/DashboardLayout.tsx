import { Flex, Box } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex minH="100vh" direction="column">
      <Header />
      <Flex flex="1">
        <Sidebar />
        <Box
          as="main"
          flex="1"
          p={8}
          bg="background"
          overflowY="auto"
          h="calc(100vh - 72px)"
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
