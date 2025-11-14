// frontend/src/pages/RegisterPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Dùng <Link> để quay về Login
import apiService from '../api'; // Dùng "cầu dao"
import {
  Box, Button, Input, VStack, Heading, useToast, Center, Text
} from '@chakra-ui/react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      toast({
        title: 'Lỗi',
        description: 'Mật khẩu xác nhận không khớp!',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      // 2. Gọi API register (thật hoặc mock) từ "cầu dao"
      await apiService.register(username, password);

      toast({
        title: 'Đăng ký thành công!',
        description: 'Bây giờ bạn có thể đăng nhập.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // 3. Đăng ký xong, tự động chuyển về trang Login
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Đăng ký thất bại',
        description: error.message || 'Tên đăng nhập có thể đã tồn tại.',
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
            <Heading>Đăng ký tài khoản</Heading>
            <Input
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              isRequired
            />
            <Input
              placeholder="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
            />
            <Input
              placeholder="Xác nhận mật khẩu"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isRequired
            />
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              w="100%"
            >
              Đăng ký
            </Button>
            <Text>
              Đã có tài khoản?{' '}
              <Button as={Link} to="/login" variant="link" colorScheme="blue">
                Đăng nhập ngay
              </Button>
            </Text>
          </VStack>
        </form>
      </Box>
    </Center>
  );
};

export default RegisterPage;