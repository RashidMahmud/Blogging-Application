import { Router, Request, Response } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/register", userController.registerUser);
router.get(
  "/me",
  (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        statuscode: 200,
        message: "User profile fetched successfully",
    });
  },
  userController.getMyProfile,
);

export const userRoutes = router;
