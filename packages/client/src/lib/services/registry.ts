import DraftService from "src/modules/draft/service";
import DraftServiceUtil from "src/modules/draft/request-util";
import AuthService from "src/modules/auth/service";
import config from "src/lib/config";
import { RequestUtilService } from "react-common-util";

const build = (defaultConfig = config) => {
  const serviceConfig = {
    baseUrl: defaultConfig.SERVER_HOST,
  };
  const services = {
    draft: new DraftService({
      RequestUtil: new DraftServiceUtil(serviceConfig),
    }),
    auth: new AuthService({
      RequestUtil: new RequestUtilService(serviceConfig),
    }),
  };
  return services;
};

const serviceRegistry = build();

export { serviceRegistry };
