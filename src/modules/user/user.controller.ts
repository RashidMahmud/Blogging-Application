import { Request, Response } from "express";
import httpStatus from "http-status";
import { UserService } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
  const payload = req.body;
  const user = await UserService.registerUserIntoDB(payload);

  res.status(httpStatus.CREATED).json({
    success: true,
    statuscode: httpStatus.CREATED,
    message: "User registered successfully",
    data: {
      user,
    },
  });
};


export const userController = {
    registerUser,
}