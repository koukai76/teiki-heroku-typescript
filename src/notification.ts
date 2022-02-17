import axios from 'axios';

export const notification = async (
  title: string,
  body: string,
  uids: string[]
) => {
  // EXPO_ID2→旧SEs
  await axios.post(
    'https://exp.host/--/api/v2/push/send',
    {
      to: uids,
      title: title,
      body: body,
      priority: 'high',
      sound: 'default',
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};
