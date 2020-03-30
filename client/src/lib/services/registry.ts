import DraftService from "src/modules/draft/service";
import config from "src/lib/config";

const build = (defaultConfig = config) => {
  const serviceConfig = {
    baseUrl: defaultConfig.SERVER_HOST,
  };
  return {
    draft: new DraftService(serviceConfig),
  };
};

const serviceRegistry = build();

export { serviceRegistry };
