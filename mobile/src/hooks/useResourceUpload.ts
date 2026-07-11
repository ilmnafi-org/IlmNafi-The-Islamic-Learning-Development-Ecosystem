import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

interface UploadOptions {
  getUploadUrl: () => Promise<{ uploadUrl: string; authorizationToken: string }>;
  onProgress?: (progress: number) => void;
}

export function useResourceUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickAndUploadFile = async (options: UploadOptions) => {
    try {
      setError(null);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const file = result.assets[0];
      setIsUploading(true);

      // 1. Get B2 upload URL and token from our backend
      const { uploadUrl, authorizationToken } = await options.getUploadUrl();

      // 2. Read file info (size, mime type, etc.)
      const fileInfo = await FileSystem.getInfoAsync(file.uri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      // 3. Upload to B2 using expo-file-system
      const uploadTask = FileSystem.createUploadTask(
        uploadUrl,
        file.uri,
        {
          headers: {
            Authorization: authorizationToken,
            'X-Bz-File-Name': file.name,
            'Content-Type': file.mimeType || 'b2/x-auto',
            'X-Bz-Content-Sha1': 'do_not_verify', // or calculate SHA1
          },
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        },
        (data) => {
          if (options.onProgress && data.totalBytesExpectedToSend > 0) {
            options.onProgress(data.totalBytesSent / data.totalBytesExpectedToSend);
          }
        }
      );

      const response = await uploadTask.uploadAsync();

      if (response?.status !== 200) {
        throw new Error(`Upload failed with status ${response?.status}`);
      }

      setIsUploading(false);
      return JSON.parse(response.body); // Should contain B2 file info (fileId, fileName)
    } catch (e: any) {
      setIsUploading(false);
      setError(e.message);
      return null;
    }
  };

  return {
    isUploading,
    error,
    pickAndUploadFile
  };
}
