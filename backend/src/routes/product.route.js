import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
  addProductSchemaValidation,
  updateProductSchemaValidation,
} from "../utils/schemaValidation.js";
import {
  AddProduct,
  getProductById,
  getProducts,
  deleteProductById,
  updateProductById,
  deleteDiscount,
} from "../controllers/product.controller.js";
import { authMiddleWare } from "../middlewares/auth.middleware.js";

const routes = express.Router();

routes
  .route("/addproduct")
  .post(
    authMiddleWare(["ADMIN"]),
    validate(addProductSchemaValidation),
    AddProduct
  );

routes.route("/getproducts").post(getProducts);

routes.route("/getoneproduct/:id").get(getProductById);

routes
  .route("/deleteoneproduct/:id")
  .delete(authMiddleWare(["ADMIN"]), deleteProductById);

routes
  .route("/updateoneproduct/:id")
  .put(
    authMiddleWare(["ADMIN"]),
    validate(updateProductSchemaValidation),
    updateProductById
  );

routes
  .route("/discount/:discountId")
  .delete(authMiddleWare(["ADMIN"]), deleteDiscount);

export default routes;
