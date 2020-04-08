import expressJwt from "express-jwt";
import config from "./config";
import User from "@app/database/schema/user";
import { NextFunction, Request, Response } from "express";

function jwt() {
  const secret = config.SECRET;
  return expressJwt({
    secret,
    isRevoked: async function (req, payload, done) {
      try {
        const user = await User.findById(payload.sub);
        if (!user) {
          return done(null, true);
        }
        done(null, false);
      } catch (e) {
        done(null, true);
      }
    },
  });
}
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // eslint-disable-next-line no-console
  console.error(err);
  if (typeof err === "string") {
    // custom application error
    return res.status(400).json({ message: err });
  }

  if (err.name === "ValidationError") {
    // mongoose validation error
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    if (err.inner.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired", code: "token_expired" });
    }
    return res
      .status(401)
      .json({ message: "Invalid Token", code: "token_invalid" });
  }

  // default to 500 server error
  return res.status(500).json({ message: err.message });
};

export { jwt, errorHandler };
