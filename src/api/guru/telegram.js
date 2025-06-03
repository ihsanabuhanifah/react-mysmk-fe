import axios from 'axios';


export const sendFileToTelegram = async (file) => {
  const BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;

  const formData = new FormData();
  formData.append('chat_id', CHAT_ID);
  formData.append('caption', 'File dari React App');
  formData.append('document', file); // Kirim sebagai dokumen

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const fileId = response.data.result.document.file_id;
    const getFileResponse = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
    );

    const filePath = getFileResponse.data.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
    return fileUrl;
  } catch (error) {
    console.error('Gagal mengirim:', error);
  }
};