import express from "express";
import {
  createCredit,
  deleteCreditById,
  getCredits,
  getSingleCredit,
  updateCreditById,
} from "../controllers/credits";

const creditRouter = express.Router();

creditRouter.post("/credits", createCredit);
creditRouter.get("/credits", getCredits);
creditRouter.get("/credits/:id", getSingleCredit);
creditRouter.put("/credits/:id", updateCreditById);
creditRouter.delete("/credits/:id", deleteCreditById);

export default creditRouter;
