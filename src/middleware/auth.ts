import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import type { ROLES } from "../types";

export interface CustomRequest extends Request {
  user?: JwtPayload & { id: number; name: string; role: ROLES };
}

const userAuth = (...roles:ROLES[]) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
          errors: "Missing authorization header",
        });
        return;
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
          errors: "Token missing from Bearer format!",
        });
        return;
      }

      const decoded = jwt.verify(
        token,
        config.jwtSecret as string,
      ) as JwtPayload & { id: number; name: string; role: ROLES };
      req.user = decoded;

      if(roles.length > 0){
        const hasAccess = roles.includes(req.user.role as ROLES);
        if (!hasAccess) {
          res.status(403).json({
            success: false,
            message: "Forbidden",
            errors: "Valid token but insufficient permissions"
          });
          return;
        }
      }

      next();
    } catch (error: unknown) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
        errors: "Invalid or expired token!",
      });
    }
  };
};

export default userAuth;
