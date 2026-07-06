import { Router, Request, Response, NextFunction } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/register", userController.registerUser);
router.get(
  "/me",
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.cookies);
    next();
  },
  userController.getMyProfile,
);

export const userRoutes = router;
