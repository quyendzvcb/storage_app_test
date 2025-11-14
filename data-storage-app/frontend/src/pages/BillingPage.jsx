import { useState, useEffect } from 'react';
import { Box, Heading, SimpleGrid, Spinner, Text, Button, VStack, Center } from '@chakra-ui/react';
import apiService from '../api';

const PricingCard = ({ plan, onSubscribe }) => (
  <VStack
    p={8}
    bg="white"
    borderWidth="1px"
    borderRadius="lg"
    shadow="md"
    spacing={4}
    align="stretch"
  >
    <Heading size="md" textAlign="center">{plan.name}</Heading>
    <Text fontSize="3xl" fontWeight="bold" textAlign="center">
      {plan.price.toLocaleString('vi-VN')} VNĐ/tháng
    </Text>
    <Text textAlign="center">{plan.description}</Text>
    <Button
      colorScheme="blue"
      onClick={() => onSubscribe(plan.id)}
    >
      Nâng cấp
    </Button>
  </VStack>
);

const BillingPage = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getPlans();
        setPlans(response.data);
      } catch (error) {
        console.error("Lỗi tải gói cước:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId) => {
    try {
      const response = await apiService.subscribeToPlan(planId);
      if (response.data.paymentUrl) {
        // API thật sẽ trả về link. Mock chỉ alert (trong mockApiService)
        window.location.href = response.data.paymentUrl;
      }
    } catch (error) {
      console.error("Lỗi đăng ký gói:", error);
    }
  };

  if (isLoading) {
    return <Center h="100vh"><Spinner size="xl" /></Center>;
  }

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Heading mb={8} textAlign="center">Nâng cấp Gói cước</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} maxW="container.md" mx="auto">
        {plans.map(plan => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onSubscribe={handleSubscribe}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default BillingPage;