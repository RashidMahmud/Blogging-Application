import { Router, Request, Response, NextFunction } from "express";
import { userController } from "./user.controller";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/client";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../lib/prisma";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/register", userController.registerUser);

router.get(
  "/me",
  // (req: Request, res: Response, next: NextFunction) => {
  //   console.log(req.cookies);
  //   const { accessToken } = req.cookies;
  //   console.log(accessToken);

  //   const verifiedToken = jwtUtils.verifyToken(
  //     accessToken,
  //     config.jwt_access_secret,
  //   );
  //   if (!verifiedToken.success) {
  //     throw new Error(verifiedToken.message);
  //   }
  //   const { email, name, id, role } = verifiedToken.data as JwtPayload;
  //   const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];
  //   if (!requiredRoles.includes(role)) {
  //     return res.status(403).json({
  //       success: false,
  //       statuscode: httpStatus.FORBIDDEN,
  //       message:
  //         "Forbidden. You do not have permission to access this resource",
  //     });
  //   }
  //   req.user = {
  //     email,
  //     name,
  //     id,
  //     role,
  //   };
  //   next();
  // },

  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  userController.getMyProfile,
);

router.put("/my-profile", auth(Role.ADMIN, Role.USER, Role.AUTHOR), userController.updateMyProfile);

export const userRoutes = router;
