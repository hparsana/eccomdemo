import express from "express";
import {
  getSavedProducts,
  addSavedProduct,
  removeSavedProduct,
} from "../controllers/savedProduct.controller.js";
import { authMiddleWare } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/getsavedproducts",
  authMiddleWare(["USER", "ADMIN"]),
  getSavedProducts
);
router.post(
  "/addsaveproduct",
  authMiddleWare(["USER", "ADMIN"]),
  addSavedProduct
);
router.delete(
  "/removesavedproduct",
  authMiddleWare(["USER", "ADMIN"]),
  removeSavedProduct
);

export default router;
