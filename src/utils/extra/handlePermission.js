import { RESULTS } from "react-native-permissions";

export const handlePermission = result => {
    let isPermitted = false;
    switch (result) {
      case RESULTS.UNAVAILABLE:
       
        break;
      case RESULTS.DENIED:
       
        break;
      case RESULTS.LIMITED:
       
        isPermitted = true;
        break;
      case RESULTS.GRANTED:
       
        isPermitted = true;
        break;
      case RESULTS.BLOCKED:
        break;
    }
    return isPermitted;
  };
  