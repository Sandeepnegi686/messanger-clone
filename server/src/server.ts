import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import connectDB from "./config/connectDB";
import authRouter from "./Routes/auth.route";
import userRouter from "./Routes/user.route";
import conversationRouter from "./Routes/conversation.route";
import { errorHandler } from "./middleware/errorHandler";
require("dotenv").config();
import passport from "./config/passport";
import authenticateUser from "./middleware/authenticateUser";

const PORT = process.env.PORT || 80;
const DB_URL = process.env.DB_URL || "";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL!, credentials: true }));
app.use(helmet());
app.use(passport.initialize());

//request logger
app.use(function (req, res, next) {
  console.log(`${req.method} request on ${req.url}`);
  next();
});

app.get("/", (_: Request, res: Response) => res.send("Hello from Ts - node"));

app.use("/api/v1", authRouter);
app.use("/api/v1/user", authenticateUser, userRouter);
app.use("/api/v1/conversation", authenticateUser, conversationRouter);

app.use(errorHandler);

function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`Server Started at port : ${PORT}`);
    });
    connectDB(DB_URL)
      .then(() => console.log("Database Connected"))
      .catch((e) => console.log(e));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

startServer();
