// This file will be used for similar type of APIs. For APIs which require different setup, please make a new file and call API there

import axios from 'axios';
import {BASE_URL} from '@env';
import {useMutation} from 'react-query';
import {Messages} from '../../libs';

const useApi = (urlWithOutBase, customConfig = {}) => {
  const defaultConfig = {
    method: 'post', // or 'get', 'put', 'delete', etc.
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      // Add any other common headers here
    },
  };

  const config = {
    ...defaultConfig,
    ...customConfig,
  };

  const fetchData = async body => {
    try {
      const response = await axios.request({
        url: urlWithOutBase,
        data: body,
        ...config,
      });

      return response.data;
    } catch (error) {
      // Handle network errors, failed requests, etc.
      const message =
        error?.response?.data?.message ||
        error?.message ||
        Messages.apiMessages.generalPostMessage;
      throw new Error(message);
    }
  };

  return useMutation(body => fetchData(body));
};

export default useApi;
