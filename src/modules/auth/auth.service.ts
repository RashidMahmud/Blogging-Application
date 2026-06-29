import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(jwtPayload, "refresh_secret", {
    expiresIn: "7d",
  });
  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  loginUser,
};
