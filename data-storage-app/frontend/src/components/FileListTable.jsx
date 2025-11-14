import { Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, HStack, useToast } from '@chakra-ui/react';
import { DownloadIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import { formatBytes } from '../utils/formatBytes';
import apiService from '../api';

const FileListTable = ({ files, onView, onDelete }) => {
  const toast = useToast();

  const handleDownload = async (fileId) => {
    try {
      const response = await apiService.getDownloadUrl(fileId);
      window.open(response.data.url, '_blank'); // Mở link download
    } catch (error) {
      toast({ title: 'Lỗi tải file', status: 'error' });
    }
  };

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Tên File</Th>
          <Th>Kích thước</Th>
          <Th>Ngày tải lên</Th>
          <Th>Hành động</Th>
        </Tr>
      </Thead>
      <Tbody>
        {files.map((file) => (
          <Tr key={file.id}>
            <Td>{file.original_filename}</Td>
            <Td>{formatBytes(file.size)}</Td>
            <Td>{new Date(file.created_at).toLocaleDateString('vi-VN')}</Td>
            <Td>
              <HStack spacing={2}>
                <IconButton
                  icon={<ViewIcon />}
                  size="sm"
                  colorScheme="gray"
                  onClick={() => onView(file)} // Gọi hàm từ cha
                />
                <IconButton
                  icon={<DownloadIcon />}
                  size="sm"
                  colorScheme="blue"
                  onClick={() => handleDownload(file.id)}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => onDelete(file.id)} // Gọi hàm từ cha
                />
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default FileListTable;