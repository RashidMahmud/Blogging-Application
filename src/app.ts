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
  res
    .status(httpStatus.CREATED)
    .json({ message: "User registered successfully" });
});

export default app;
