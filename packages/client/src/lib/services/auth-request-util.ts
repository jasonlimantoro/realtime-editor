import { RequestUtilService } from "react-common-util";
import { defaultStorage } from "src/lib/storage";

export default class AuthRequestUtil extends RequestUtilService {
  getConfig = () => {
    const credentials = defaultStorage.get();
    if (credentials && credentials.token) {
      return {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      };
    }
    return {};
  };
}
