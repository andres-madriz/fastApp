// lib/cloudinary.ts
import axios from "axios";
import { Platform } from "react-native";

const CLOUDINARY_CLOUD_NAME = 'dvzlv2crv';
const CLOUDINARY_UPLOAD_PRESET = 'HomeHub';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Helper to convert a file uri to a base64 string (for web compatibility)
 */
async function uriToBase64(uri: string): Promise<string | null> {
  if (Platform.OS === "web") {
    // Fetch the image and convert to base64
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result?.toString().split(',')[1] || null);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  }
  return null;
}

export const uploadFileToCloudinary = async (
  file: { uri?: string } | string,
  folderName: string,
): Promise<{ success: boolean; data?: string; msg?: string }> => {
  try {
    if (typeof file === 'string') {
      return { data: file, success: true };
    }
    if (file && file.uri) {
      const formData = new FormData();

      // Special handling for web: Convert to base64
      if (Platform.OS === "web") {
        const base64 = await uriToBase64(file.uri);
        if (!base64) return { success: false, msg: "Failed to read image in web mode" };
        formData.append('file', `data:image/jpeg;base64,${base64}`);
      } else {
        formData.append('file', {
          name: file.uri.split('/').pop() || 'file.jpg',
          type: 'image/jpeg',
          uri: file.uri,
        } as any);
      }

      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', folderName);

      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { data: response.data.secure_url, success: true };
    } else {
      return { msg: 'Invalid file', success: false };
    }
  } catch (error: any) {
    return { msg: error?.message || 'Could not upload media', success: false };
  }
};

export const getProfileImage = (file: any) => {
  if (file && typeof file == 'string') return file;
  if (file && typeof file == 'object' && file.uri) return file.uri;
  return require('../assets/images/defaultAvatar.png');
};
