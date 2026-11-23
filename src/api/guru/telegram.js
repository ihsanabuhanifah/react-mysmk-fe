import axiosClient from "../axiosClient";

const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:8085/").replace(/\/?$/, "/");

/**
 * Upload file lewat backend (backend yang meneruskan ke Telegram, token bot tidak ada di browser).
 * @returns URL publik file, mis. https://api.example.com/telegram/file/<file_id>
 */
export const sendFileToTelegram = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient.post("/telegram/upload", formData);
  const fileId = response.data?.file_id;
  if (!fileId) throw new Error("Upload file gagal");
  return `${API_URL}telegram/file/${fileId}`;
};
