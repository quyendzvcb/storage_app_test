import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box, Button, Input, VStack, Heading, useToast, Center
} from '@chakra-ui/react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(username, password);
      navigate('/'); // Login thành công, bay về Dashboard
    } catch (error) {
      toast({
        title: 'Đăng nhập thất bại',
        description: error.message || 'Sai tên đăng nhập hoặc mật khẩu.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center h="100vh" bg="gray.50">
      <Box w="md" p={8} borderWidth={1} borderRadius="lg" bg="white" shadow="lg">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Heading>Đăng nhập Cloud Storage</Heading>
            <Input
              placeholder="Tên đăng nhập (admin)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Mật khẩu (admin)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              w="100%"
            >
              Đăng nhập
            </Button>
          </VStack>
        </form>
      </Box>
    </Center>
  );
};

export default LoginPage;