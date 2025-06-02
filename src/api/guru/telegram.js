import axios from 'axios';

// export const sendFileToTelegram = async (file) => {
//   const BOT_TOKEN = "7595577952:AAFKqUdN2MUyZJDDj1PUUVNfwVegCmUDEJM";
//   const CHAT_ID = -1002581112538;

//   const formData = new FormData();
//   formData.append('chat_id', CHAT_ID);
//   formData.append('caption', 'File dari React App'); // Opsional
// //   formData.append('document', file); // Untuk file umum
//   formData.append('photo', file); // Khusus gambar
//   // formData.append('video', file); // Khusus video

//   try {
//     const response = await axios.post(
//       `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       }
//     );


//  const fileId = response.data.result.photo[0].file_id; // Untuk gambar

//  const getFileResponse = await axios.get(
//   `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
// );

// const filePath = getFileResponse.data.result.file_path;
// const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
// // const fileId = response.data.result.video.file_id; // Untuk video
// // const fileId = response.data.result.document.file_id; // Untuk dokumen
//     return fileUrl // Mengembalikan data respons dari Telegram
  
//   } catch (error) {
//     console.error('Gagal mengirim:', error);
//   }
// };


export const sendFileToTelegram = async (file) => {
  const BOT_TOKEN = "7595577952:AAFKqUdN2MUyZJDDj1PUUVNfwVegCmUDEJM";
  const CHAT_ID = -1002581112538;

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