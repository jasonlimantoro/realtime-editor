import { ApiActionType } from "src/store/middlewares/api/types";

interface RequestHandler {
  onStart: () => any;
  onSuccess: (data: any) => any;
  onFailure: (error: any) => any;
}
interface Param {
  handler: {
    update?: RequestHandler;
    create?: RequestHandler;
    list?: RequestHandler;
    remove?: RequestHandler;
    detail?: RequestHandler;
  };
  service: {
    update: (body: any) => Promise<any>;
    create: (body: any) => Promise<any>;
    list: () => Promise<any>;
    destroy: (id: any) => Promise<any>;
    detail: (id: any) => Promise<any>;
  };
}
export const crudActions = ({ handler, service }: Param) => {
  return {
    detail(id: any) {
      return {
        type: ApiActionType,
        payload: {
          network: () => service.detail(id),
          ...handler.detail,
        },
      };
    },
    list() {
      return {
        type: ApiActionType,
        payload: {
          network: service.list,
          ...handler.list,
        },
      };
    },
    create(body: any) {
      return {
        type: ApiActionType,
        payload: {
          network: () => service.create(body),
          ...handler.create,
        },
      };
    },
    update(body: any) {
      return {
        type: ApiActionType,
        payload: {
          network: () => service.update(body),
          ...handler.update,
        },
      };
    },
    remove(id: any) {
      return {
        type: ApiActionType,
        payload: {
          network: () => service.destroy(id),
          ...handler.remove,
        },
      };
    },
  };
};
