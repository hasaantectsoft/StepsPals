import useQueryApi from './useQueryApi';
const useMainData = userToken => {
  return useQueryApi('mainData', '/v1/data', userToken, {
    // You can customize headers or other configurations specific to this API call
  });
};

export default useMainData;
