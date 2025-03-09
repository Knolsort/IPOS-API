import express from "express";
import { createShopCredit, deleteShopCredit, getShopCreditById, getShopCredits, updateShopCredit } from "../controllers/shop-credits";


const shopCreditRouter = express.Router();

shopCreditRouter.post("/shopCredits", createShopCredit);
shopCreditRouter.get("/shopCredits", getShopCredits);
shopCreditRouter.get("/shopCredits/:shopId", getShopCreditById);
shopCreditRouter.put("/shopCredits/:id", updateShopCredit);
shopCreditRouter.delete("/shopCredits/:id", deleteShopCredit);

export default shopCreditRouter;
