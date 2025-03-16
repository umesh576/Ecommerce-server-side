import express from "express";
import {
  getAllOrder,
  placeOrder,
  getByUserId,
} from "../controller/order.controller";
import { Authenticate } from "../middleware/authentication.middleware";

import { onlyUser } from "../@types/global.types";

const router = express.Router();

router.post("/", Authenticate(onlyUser), placeOrder);
router.get("/", Authenticate(onlyUser), getAllOrder);
router.patch("/:id", Authenticate(onlyUser), getByUserId);

export default router;
