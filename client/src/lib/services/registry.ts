import DraftService from "src/modules/draft/service";
import AuthService from "src/modules/auth/service";
import config from "src/lib/config";

const build = (defaultConfig = config) => {
  const serviceConfig = {
    baseUrl: defaultConfig.SERVER_HOST,
  };
  return {
    draft: new DraftService(serviceConfig),
    auth: new AuthService(serviceConfig),
  };
};

const serviceRegistry = build();

export { serviceRegistry };
