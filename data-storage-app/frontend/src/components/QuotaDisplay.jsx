import { Box, Text, Progress, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { formatBytes } from '../utils/formatBytes';

const QuotaDisplay = ({ usage, quota }) => {
  const navigate = useNavigate();
  const percent = (usage / quota) * 100;

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" bg="white">
      <Text fontSize="sm" fontWeight="bold" mb={2}>Dung lượng</Text>
      <Progress
        value={percent}
        size="sm"
        colorScheme={percent > 90 ? 'red' : 'blue'}
        mb={2}
        hasStripe
        isAnimated
      />
      <Text fontSize="xs">
        {formatBytes(usage)} / {formatBytes(quota)}
      </Text>
      {percent > 90 && (
        <Button
          colorScheme="orange"
          size="xs"
          mt={3}
          w="100%"
          onClick={() => navigate('/billing')}
        >
          Nâng cấp ngay
        </Button>
      )}
    </Box>
  );
};

export default QuotaDisplay;