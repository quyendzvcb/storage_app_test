import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner, Center } from '@chakra-ui/react';

const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    // Chờ AuthContext load xong
    return <Center h="100vh"><Spinner size="xl" /></Center>;
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;