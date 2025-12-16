import express from "express";
const router = express.Router();
import {
  createCustomOption,
  getCustomOptions,
  updateCustomOption,
  deleteCustomOption,
} from "../controllers/customOptionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(getCustomOptions)
  .post(protect, admin, createCustomOption);

router
  .route("/:id")
  .put(protect, admin, updateCustomOption)
  .delete(protect, admin, deleteCustomOption);

export default router;
