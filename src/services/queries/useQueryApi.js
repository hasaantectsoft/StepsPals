import axios from 'axios';
import {BASE_URL} from '@env';
import {useQuery} from 'react-query';
import {Messages} from '../../libs';

const useQueryApi = (
  queryKey,
  urlWithOutBase,
  userToken,
  customConfig = {},
) => {
  const defaultConfig = {
    method: 'get', // or 'post', 'put', 'delete', etc., depending on your API
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: userToken ? `Bearer ${userToken}` : '', // Include user token if available
      // Add any other common headers here
    },
  };

  const config = {
    ...defaultConfig,
    ...customConfig,
  };

  const fetchData = async () => {
    try {
      const response = await axios.request({
        url: urlWithOutBase,
        ...config,
      });

      return response.data;
    } catch (error) {
      // Handle network errors, failed requests, etc.
      const message =
        error?.response?.data?.message ||
        error?.message ||
        Messages.apiMessages.generalGetMessage;
      throw new Error(message);
    }
  };

  return useQuery(queryKey, fetchData);
};

export default useQueryApi;
