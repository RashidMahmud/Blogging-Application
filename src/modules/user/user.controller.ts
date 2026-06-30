import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await UserService.registerUserIntoDB(payload);
    // res.status(httpStatus.CREATED).json({
    //   success: true,
    //   statuscode: httpStatus.CREATED,
    //   message: "User registered successfully",
    //   data: {
    //     user,
    //   },
    // });
    sendResponse(res, {
      success: true,
      statuscode: httpStatus.CREATED,
      message: "User registered successfully",
      data: { user },
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("Get My Profile");
  },
);

export const userController = {
  registerUser,
  getMyProfile,
};
