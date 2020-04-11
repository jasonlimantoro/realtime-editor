import { BaseService } from "rc-common";

export default class AuthService extends BaseService {
  login = async (username: string, password: string) =>
    this.requestUtil.request({
      path: "auth/login",
      method: "post",
      data: { username, password },
    });

  register = async (username: string, password: string) =>
    this.requestUtil.request({
      path: "auth/register",
      method: "post",
      data: { username, password },
    });
}
