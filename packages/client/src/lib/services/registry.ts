import DraftService from "src/modules/draft/service";
import DraftServiceUtil from "src/modules/draft/request-util";
import AuthService from "src/modules/auth/service";
import config from "src/lib/config";

const build = (defaultConfig = config) => {
  const serviceConfig = {
    baseUrl: defaultConfig.SERVER_HOST,
  };
  const services = {
    draft: new DraftService({
      ...serviceConfig,
      storageAuthKey: "cred",
      RequestUtil: DraftServiceUtil,
    }),
    auth: new AuthService(serviceConfig),
  };
  return services;
};

const serviceRegistry = build();

export { serviceRegistry };
