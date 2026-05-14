import { Request, Response, NextFunction } from "express"
import { HttpError } from "../common/httpError"

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    })
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error"
  })
}