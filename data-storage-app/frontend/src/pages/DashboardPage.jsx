import { useState, useEffect } from 'react';
import { Box, Grid, GridItem, Button, Heading, useDisclosure, Spinner, Center, Text } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import apiService from '../api'; // <-- Dùng "cầu dao"

// Import các component con
import QuotaDisplay from '../components/QuotaDisplay';
import FileListTable from '../components/FileListTable';
import UploadModal from '../components/UploadModal';
import ViewFileModal from '../components/ViewFileModal';

const DashboardPage = () => {
  const { userProfile, logout, fetchUserProfile } = useAuth();
  const [files, setFiles] = useState([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  // State cho Modal
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const [fileToView, setFileToView] = useState(null);

  // Hàm tải danh sách file
  const fetchFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const response = await apiService.getFiles();
      setFiles(response.data);
    } catch (error) {
      console.error("Lỗi tải file list:", error);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  useEffect(() => {
    fetchFiles(); // Tải file list khi component mount
  }, []);

  // Xử lý sau khi upload thành công
  const handleUploadSuccess = () => {
    onUploadClose();
    fetchFiles(); // Tải lại list file
    fetchUserProfile(); // Tải lại quota
  };

  // Xử lý khi bấm "View"
  const handleViewFile = (file) => {
    setFileToView(file);
    onViewOpen();
  };

  // Xử lý khi bấm "Delete"
  const handleDeleteFile = async (fileId) => {
    if (window.confirm('Bạn có chắc muốn xóa file này?')) {
      try {
        await apiService.deleteFile(fileId);
        fetchFiles(); // Tải lại list
        fetchUserProfile(); // Tải lại quota
      } catch (error) {
        console.error("Lỗi xóa file:", error);
      }
    }
  };

  // userProfile được load từ AuthContext
  if (!userProfile) {
    return <Center h="100vh"><Spinner size="xl" /></Center>;
  }

  return (
    <>
      <Grid
        templateAreas={`"header header"
                        "nav main"`}
        gridTemplateRows={'64px 1fr'}
        gridTemplateColumns={'250px 1fr'}
        h="100vh"
        overflow="hidden"
      >
        {/* Header */}
        <GridItem area={'header'} bg="white" shadow="sm" p={4} display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="md">Cloud Storage</Heading>
          <Box>
            <Text as="span" mr={4}>Chào, <b>{userProfile.username}</b> ({userProfile.plan})</Text>
            <Button onClick={logout} colorScheme="red" size="sm">
              Đăng xuất
            </Button>
          </Box>
        </GridItem>

        {/* Sidebar Trái (Nav) */}
        <GridItem area={'nav'} bg="gray.50" p={4} borderRight="1px solid" borderColor="gray.200">
          <Button colorScheme="blue" w="100%" mb={8} onClick={onUploadOpen}>
            Tải lên (Upload)
          </Button>
          <QuotaDisplay
            usage={userProfile.usage}
            quota={userProfile.quota}
          />
        </GridItem>

        {/* Main Content (Danh sách file) */}
        <GridItem area={'main'} p={4} overflowY="auto">
          {isLoadingFiles ? (
            <Spinner />
          ) : (
            <FileListTable
              files={files}
              onView={handleViewFile}
              onDelete={handleDeleteFile}
            />
          )}
        </GridItem>
      </Grid>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={onUploadClose}
        onUploadSuccess={handleUploadSuccess}
      />

      <ViewFileModal
        isOpen={isViewOpen}
        onClose={onViewClose}
        file={fileToView}
      />
    </>
  );
};

export default DashboardPage;