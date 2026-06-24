import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import httpStatus from "http-status";

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, profilePhoto } = req.body;

  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });
  if (isUserExists) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcryptSaltRounds),
  );
  const CreatedUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  await prisma.profile.create({
    data: {
      userId: CreatedUser.id,
      profilePhoto,
    },
  });
  const user = await prisma.user.findUnique({
    where: {
      id: CreatedUser.id,
      email: CreatedUser.email || email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
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