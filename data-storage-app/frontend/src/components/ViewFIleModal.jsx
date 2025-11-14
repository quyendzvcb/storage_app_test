import { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, Spinner, Center, Image, Text
} from '@chakra-ui/react';
import apiService from '../api';

const FileViewer = ({ file, url }) => {
  if (!file) return null;
  const filename = file.original_filename.toLowerCase();

  if (filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png') || filename.endsWith('.gif')) {
    return <Image src={url} maxH="70vh" objectFit="contain" />;
  }
  if (filename.endsWith('.mp4')) {
    return (
      <video controls style={{ width: '100%' }}>
        <source src={url} type="video/mp4" />
        Trình duyệt không hỗ trợ xem video.
      </video>
    );
  }

  // (PDF cần iframe hoặc thư viện react-pdf)
  // if (filename.endsWith('.pdf')) {
  //   return <iframe src={url} width="100%" height="70vh" />;
  // }

  return <Text>Không hỗ trợ xem trước cho loại file này.</Text>;
};

const ViewFileModal = ({ isOpen, onClose, file }) => {
  const [viewUrl, setViewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (file && isOpen) {
      const fetchUrl = async () => {
        setIsLoading(true);
        setViewUrl(null);
        try {
          const response = await apiService.getViewUrl(file.id);
          setViewUrl(response.data.url);
        } catch (error) {
          console.error("Lỗi lấy view URL:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUrl();
    }
  }, [file, isOpen]); // Chạy lại khi file hoặc trạng thái mở thay đổi

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{file?.original_filename}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Center minH="400px">
            {isLoading ? (
              <Spinner />
            ) : viewUrl ? (
              <FileViewer file={file} url={viewUrl} />
            ) : (
              <Text>Không thể tải dữ liệu xem trước.</Text>
            )}
          </Center>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Đóng</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewFileModal;