import { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, Input, useToast,
  Progress, VStack, Text
} from '@chakra-ui/react';
import apiService from '../api';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const toast = useToast();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({ title: 'Vui lòng chọn file', status: 'warning' });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      await apiService.uploadFile(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      toast({ title: 'Upload thành công!', status: 'success' });
      onUploadSuccess(); // Gọi hàm của cha để refresh
    } catch (error) {
      toast({ title: 'Upload thất bại', description: error.message, status: 'error' });
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tải file lên</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Input type="file" onChange={handleFileChange} />
            {isUploading && (
              <VStack w="100%">
                <Progress value={uploadProgress} w="100%" colorScheme="blue" hasStripe />
                <Text>{uploadProgress}%</Text>
              </VStack>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} disabled={isUploading}>Hủy</Button>
          <Button
            colorScheme="blue"
            onClick={handleUpload}
            isLoading={isUploading}
            disabled={!selectedFile}
          >
            Tải lên
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadModal;