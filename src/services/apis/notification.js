import axios from 'axios';

export const messageNotification = async (
  token,
  messageText,
  senderName,
  senderImage,
) => {
  try {
    await axios.post(
      'https://node-ap-is-ten.vercel.app/v1/sendMessageNotification',
      {token, messageText, senderName, senderImage},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return 'sent';
  } catch (error) {
    console.error(error);
    return null;
  }
};
