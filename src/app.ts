import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import prisma from "./lib/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});
app.post("/api/users/register", async (req: Request, res: Response) => {
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
});

export default app;
