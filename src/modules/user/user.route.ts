import { Router, Request, Response, NextFunction } from "express";
import { userController } from "./user.controller";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/client";
import httpStatus from "http-status";
declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

const router = Router();

router.post("/register", userController.registerUser);
router.get(
  "/me",
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.cookies);
    const { accessToken } = req.cookies;
    console.log(accessToken);

    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret,
    );
    if (typeof verifiedToken === "string") {
      throw new Error(verifiedToken);
    }
    const { email, name, id, role } = verifiedToken;
    const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];
    if (!requiredRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        statuscode: httpStatus.FORBIDDEN,
        message:
          "Forbidden. You do not have permission to access this resource",
      });
    }
    req.user = {
      email,
      name,
      id,
      role,
    };
    next();
  },
  userController.getMyProfile,
);

export const userRoutes = router;
