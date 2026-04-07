'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Hand, 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  BarChart3, 
  Bell, 
  AlertTriangle, 
  Info 
} from "lucide-react";
import { 
  Box, Flex, Text, SimpleGrid, Card, CardBody, VStack, HStack, Icon, Spinner, Center, Badge
} from '@chakra-ui/react';

interface DashboardMetrics {
  totalOnboards?: number;
  pendingReviews?: number;
  completed?: number;
  activeCustomers?: number;
  highRiskCustomers?: number;
  overdueReviews?: number;
}

interface Activity {
  _id: string;
  type: string;
  description: string;
  timestamp: string;
  customerName?: string;
}

interface Notification {
  _id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
}

export default function Home() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  // if (loading) {
  //   return (
  //     <DashboardLayout>
  //       <Center h="full">
  //         <VStack spacing={4}>
  //           <Spinner color="brand.500" size="xl" />
  //           <Text color="gray.500" fontWeight="medium">Loading workspace...</Text>
  //         </VStack>
  //       </Center>
  //     </DashboardLayout>
  //   );
  // }

  return (
    <DashboardLayout>
      <VStack spacing={8} align="stretch">
        {/* Welcome Section */}
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

        {/* Lower Grid for Activities and Notifications */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          
          {/* Activities */}
          <Card>
            <CardBody p={6}>
              <HStack mb={6} spacing={3}>
                <Flex w={10} h={10} bg="brand.50" borderRadius="lg" align="center" justify="center">
                  <Icon as={BarChart3} color="brand.600" boxSize={5} />
                </Flex>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">Recent Activities</Text>
              </HStack>
              
              <VStack align="stretch" spacing={3}>
                {activities.length > 0 ? (
                  activities.map((activity, i) => (
                    <Flex 
                      key={activity._id} 
                      justify="space-between" 
                      p={4} 
                      bg="gray.50" 
                      _hover={{ bg: "gray.100" }} 
                      borderRadius="lg" 
                      transition="all 0.2s"
                    >
                      <Box>
                        <Text fontWeight="semibold" color="gray.800" fontSize="sm">{activity.type}</Text>
                        <Text fontSize="sm" color="gray.500" mt={0.5}>{activity.description}</Text>
                      </Box>
                      <Text fontSize="xs" color="gray.400" fontWeight="medium">
                        {getTimeAgo(activity.timestamp)}
                      </Text>
                    </Flex>
                  ))
                ) : (
                  <Center py={8}>
                    <Text color="gray.400" fontSize="sm">No recent activities found.</Text>
                  </Center>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Notifications */}
          <Card>
            <CardBody p={6}>
              <HStack mb={6} spacing={3}>
                <Flex w={10} h={10} bg="brand.50" borderRadius="lg" align="center" justify="center">
                  <Icon as={Bell} color="brand.600" boxSize={5} />
                </Flex>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">Alerts & Notifications</Text>
              </HStack>

              <VStack align="stretch" spacing={3}>
                {notifications.length > 0 ? (
                  notifications.map((notification) => {
                    const statusConfig = {
                      warning: { bg: 'orange.50', borderColor: 'orange.400', icon: AlertTriangle, iconColor: 'orange.500' },
                      info: { bg: 'blue.50', borderColor: 'blue.400', icon: Info, iconColor: 'blue.500' },
                      success: { bg: 'green.50', borderColor: 'green.400', icon: CheckCircle, iconColor: 'green.500' }
                    };
                    const conf = statusConfig[notification.type];

                    return (
                      <Flex 
                        key={notification._id} 
                        p={4} 
                        bg={conf.bg} 
                        borderLeft="4px solid" 
                        borderColor={conf.borderColor} 
                        borderRadius="md" 
                        gap={4}
                      >
                        <Icon as={conf.icon} color={conf.iconColor} boxSize={5} mt={0.5} />
                        <Box>
                          <Text fontWeight="bold" color="gray.800" fontSize="sm" mb={1}>{notification.title}</Text>
                          <Text fontSize="sm" color="gray.700" lineHeight="1.4">{notification.message}</Text>
                        </Box>
                      </Flex>
                    );
                  })
                ) : (
                  <Center py={8}>
                    <Text color="gray.400" fontSize="sm">You're all caught up!</Text>
                  </Center>
                )}
              </VStack>
            </CardBody>
          </Card>

        </SimpleGrid>
      </VStack>
    </DashboardLayout>
  );
}
