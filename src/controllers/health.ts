import { RequestHandler } from "express";

export const healthCheck: RequestHandler = async (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is healthy 🚀",
  });
};
