// /backend/routes/customOptionRoutes.js

import express from "express";
const router = express.Router();
import {
  createCustomOption,
  getCustomOptions,
  deleteCustomOption,
} from "../controllers/customOptionController.js";
// import { protect, admin } from '../middleware/authMiddleware.js';

router.route("/").get(getCustomOptions).post(createCustomOption); // POST necesita auth
router.route("/:id").delete(deleteCustomOption); // DELETE necesita auth

export default router;
