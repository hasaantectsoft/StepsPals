import useApi from './index';

const useLogin = () => {
  return useApi('/v1/login', {
    // You can customize headers or other configurations specific to this API call
  });
};

export default useLogin;
