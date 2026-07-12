import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, profilePhoto } = payload;
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
      profile: {
        create: {
          profilePhoto,
        },
      },
    },
  });
  // await prisma.profile.create({
  //   data: {
  //     userId: CreatedUser.id,
  //     profilePhoto,
  //   },
  // });
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
  return user;
};

const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return user;
};

const updateMyProfileInDB = async (userId: string, payload: any) => {
  const { name, email, profilePhoto, bio } = payload;
  const updatedUser = await prisma.user.update({
    where: {id: userId},
    data: {
      name,
      email,
      profile: {
        update: {
          profilePhoto,
          bio,}
  }},
  omit:{password: true},
  include: {
    profile: true,
}})
return updatedUser;
};

export const UserService = {
  registerUserIntoDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
};
