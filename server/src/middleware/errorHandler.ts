import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

class APIError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

function errorHandler(
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(err);
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    return res.status(400).json({
      success: false,
      message: errors[0],
    });
  }

  return res
    .status(err.statusCode || 500)
    .json({ success: false, message: "Something went wront at server side." });
}

export { APIError, errorHandler };
